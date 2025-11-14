import type { Tunnel } from "localtunnel";
import localtunnel from "localtunnel";
import logger from "../server/utils/logger";

let activeTunnel: Tunnel | null = null;
let currentTunnelUrl: string | null = null;
let currentTunnelPassword: string | undefined = undefined;

export interface TunnelInfo {
	url: string;
	type: "localtunnel";
	status: "active" | "connecting" | "error";
	password?: string;
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
		currentTunnelPassword = password;

		tunnel.on("close", () => {
			logger.info("Localtunnel closed");
			activeTunnel = null;
			currentTunnelUrl = null;
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
		currentTunnelPassword = undefined;

		logger.info("Tunnel stopped");
	} catch (error) {
		logger.error("Error stopping tunnel:", error);
		throw error;
	}
}

/**
 * Get the current tunnel info
 */
export function getCurrentTunnel(): TunnelInfo | null {
	if (currentTunnelUrl) {
		return {
			url: currentTunnelUrl,
			type: "localtunnel",
			status: "active",
			password: currentTunnelPassword,
		};
	}
	return null;
}

export function isTunnelActive(): boolean {
	return activeTunnel !== null;
}
