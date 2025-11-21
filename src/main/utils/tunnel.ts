import { supabase } from "@/server/utils/database";
import logger from "@/server/utils/logger";
import type { Tunnel } from "localtunnel";
import localtunnel from "localtunnel";
import { nanoid } from "nanoid";
import { machineIdSync } from "node-machine-id";

let activeTunnel: Tunnel | null = null;
let currentTunnelUrl: string | null = null;
let currentShortUrl: string | null = null;
let currentTunnelPassword: string | undefined = undefined;

const urlCreationCache = new Map<string, number[]>();

export interface TunnelInfo {
	url: string;
	type: "localtunnel";
	status: "active" | "connecting" | "error";
	password?: string;
	shortUrl?: string;
}

async function getLocaltunnelPassword(): Promise<string | undefined> {
	try {
		const response = await fetch("https://loca.lt/mytunnelpassword");
		if (response.ok) {
			const password = await response.text();
			return password.trim();
		}
	} catch (error) {
		logger.error("Failed to fetch Localtunnel password:", error);
	}
	return undefined;
}

export async function startLocaltunnel(port: number): Promise<TunnelInfo> {
	try {
		// Close any existing tunnel first
		await stopTunnel();

		logger.info(`Starting Localtunnel on port ${port}...`);

		// Fetch the tunnel password
		const password = await getLocaltunnelPassword();
		if (password) {
			logger.info(`Localtunnel password: ${password}`);
		}

		const tunnel = await localtunnel({ port });

		activeTunnel = tunnel;
		currentTunnelUrl = tunnel.url;
		currentShortUrl = null;
		currentTunnelPassword = password;

		tunnel.on("close", () => {
			logger.info("Localtunnel closed");
			activeTunnel = null;
			currentTunnelUrl = null;
			currentShortUrl = null;
			currentTunnelPassword = undefined;
		});

		tunnel.on("error", (err) => {
			logger.error("Localtunnel error:", err);
		});

		logger.info(`Localtunnel started: ${tunnel.url}`);

		return {
			url: tunnel.url,
			type: "localtunnel",
			status: "active",
			password,
		};
	} catch (error) {
		logger.error("Failed to start Localtunnel:", error);
		throw new Error(`Failed to start Localtunnel: ${error}`);
	}
}

export async function stopTunnel(): Promise<void> {
	try {
		if (activeTunnel) {
			logger.info("Closing Localtunnel...");
			activeTunnel.close();
			activeTunnel = null;
		}

		currentTunnelUrl = null;
		currentShortUrl = null;
		currentTunnelPassword = undefined;

		logger.info("Tunnel stopped");
	} catch (error) {
		logger.error("Error stopping tunnel:", error);
		throw error;
	}
}

export function getCurrentTunnel(): TunnelInfo | null {
	if (currentTunnelUrl) {
		return {
			url: currentTunnelUrl,
			type: "localtunnel",
			status: "active",
			password: currentTunnelPassword,
			shortUrl: currentShortUrl || undefined,
		};
	}
	return null;
}

export function isTunnelActive(): boolean {
	return activeTunnel !== null;
}

function isValidUrl(url: string): boolean {
	try {
		const parsed = new URL(url);

		if (!["http:", "https:"].includes(parsed.protocol)) {
			return false;
		}

		const hostname = parsed.hostname.toLowerCase();
		if (
			hostname === "localhost" ||
			hostname.startsWith("127.") ||
			hostname.startsWith("192.168.") ||
			hostname.startsWith("10.") ||
			hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
		) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

export async function shortenUrl(url: string): Promise<string | null> {
	try {
		if (!supabase) {
			logger.warn("Supabase not configured, skipping URL shortening");
			return null;
		}

		if (!isValidUrl(url)) {
			logger.warn("Invalid URL format or blocked URL");
			return null;
		}

		const machineId = machineIdSync();
		const now = Date.now();
		const oneHour = 60 * 60 * 1000;

		const timestamps = urlCreationCache.get(machineId) || [];
		const recentTimestamps = timestamps.filter((t) => now - t < oneHour);

		if (recentTimestamps.length >= 10) {
			logger.warn("Rate limit exceeded for URL shortening (max 10 per hour)");
			return null;
		}

		recentTimestamps.push(now);
		urlCreationCache.set(machineId, recentTimestamps);

		let attempts = 0;
		const maxAttempts = 5;

		while (attempts < maxAttempts) {
			const shortId = nanoid(10);

			const { data: existing } = await supabase
				.from("shared_urls")
				.select("id")
				.eq("id", shortId)
				.single();

			if (!existing) {
				const { data, error } = await supabase
					.from("shared_urls")
					.insert({
						id: shortId,
						long_url: url,
						created_at: new Date().toISOString(),
					})
					.select()
					.single();

				if (error) {
					logger.error("Failed to create shortened URL:", error);
					return null;
				}

				const shortUrl = `https://getdione.app/share/${data.id}`;

				if (url === currentTunnelUrl) {
					currentShortUrl = shortUrl;
				}

				logger.info(`Created shortened URL: ${data.id}`);
				return shortUrl;
			}

			attempts++;
			logger.warn(`ID collision detected (${shortId}), retrying... (${attempts}/${maxAttempts})`);
		}

		logger.error("Failed to generate unique shortened URL after maximum attempts");
		return null;
	} catch (error) {
		logger.error("Error shortening URL:", error);
		return null;
	}
}
