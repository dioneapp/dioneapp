import type { ElectronAPI } from "@electron-toolkit/preload";

interface CustomAPI {
	updateDiscordPresence: (details: string, state: string) => Promise<void>;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: CustomAPI;
	}
}
