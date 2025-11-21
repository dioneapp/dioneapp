import { readConfig } from "@/config";
import logger from "@/server/utils/logger";
import { ActivityType, Client } from "minimal-discord-rpc";

const clientId = "1374430697024000112";
let rpc: Client | null = null;

export const initializeDiscordPresence = async () => {
	try {
		const config = readConfig();
		if (!config?.enableDiscordRPC) {
			logger.info("Discord RPC is disabled in settings");
			return;
		}

		rpc = new Client({ clientId });

		rpc.on("ready", () => {
			logger.info("Discord RPC connected");
			updatePresence();
		});

		await rpc.login();
	} catch (error) {
		logger.warn("Failed to initialize Discord presence:", error);
	}
};

export const updatePresence = async (details?: string, state?: string) => {
	if (!rpc) return;

	try {
		await rpc.setActivity({
			details: details || "Explore and Install Open-Source AI Apps in 1 Click",
			state: state || "Discovering new apps...",
			timestamps: {
				start: Date.now(),
			},
			assets: {
				large_image: "dione",
				large_text: "Dione",
			},
			buttons: [
				{
					label: "Get Dione",
					url: "https://getdione.app",
				},
			],
			type: ActivityType.Playing,
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

export const toggleDiscordRPC = async (enabled: boolean) => {
	if (enabled) {
		await initializeDiscordPresence();
	} else {
		await destroyPresence();
	}
};

// // window.api.updateDiscordPresence("Installing an app", "Downloading...");
