import { Client } from "discord-rpc";
import logger from "../server/utils/logger";

const clientId = "1374430697024000112";
let rpc: Client | null = null;

export const initializeDiscordPresence = async () => {
	try {
		rpc = new Client({ transport: "ipc" });

		rpc.on("ready", () => {
			logger.info("Discord RPC connected");
			updatePresence();
		});

		await rpc.login({ clientId });
	} catch (error) {
		logger.error("Failed to initialize Discord presence:", error);
	}
};

export const updatePresence = async (details?: string, state?: string) => {
	if (!rpc) return;

	try {
		await rpc.setActivity({
			details: details || "Explore and Install Open-Source AI Apps in 1 Click",
			state: state || "Discovering new apps...",
			startTimestamp: Date.now(),
			largeImageKey: "dione",
			largeImageText: "Dione",
			instance: false,
		});
	} catch (error) {
		logger.error("Failed to update Discord presence:", error);
	}
};

export const clearPresence = async () => {
	if (!rpc) return;

	try {
		await rpc.clearActivity();
	} catch (error) {
		logger.error("Failed to clear Discord presence:", error);
	}
};

export const destroyPresence = async () => {
	if (!rpc) return;

	try {
		await rpc.destroy();
		rpc = null;
	} catch (error) {
		logger.error("Failed to destroy Discord presence:", error);
	}
};

// // window.api.updateDiscordPresence("Installing an app", "Downloading...");
