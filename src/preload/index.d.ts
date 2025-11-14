import type { ElectronAPI } from "@electron-toolkit/preload";

interface TunnelInfo {
	url: string;
	type: "localtunnel";
	status: "active" | "connecting" | "error";
	password?: string;
}

interface CustomAPI {
	updateDiscordPresence: (details: string, state: string) => Promise<void>;
	getSystemUsage: () => Promise<{
		cpu: number;
		ram: { percent: number; usedGB: number };
	}>;
	getNetworkAddress: (port?: number) => Promise<{
		ip: string;
		port: number;
		url: string;
	} | null>;
	startTunnel: (type: "localtunnel", port?: number) => Promise<TunnelInfo>;
	stopTunnel: () => Promise<boolean>;
	getCurrentTunnel: () => Promise<TunnelInfo | null>;
	isTunnelActive: () => Promise<boolean>;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: CustomAPI;
		captureScreenshot: () => Promise<string | null>;
	}
}
