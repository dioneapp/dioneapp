import type { ElectronAPI } from "@electron-toolkit/preload";

interface CustomAPI {
	updateDiscordPresence: (details: string, state: string) => Promise<void>;
	getSystemUsage: () => Promise<{
		cpu: number;
		ram: { percent: number; usedGB: number };
	}>;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: CustomAPI;
	}
}
