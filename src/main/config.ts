import { app } from "electron";
import path from "node:path";
import fs from "node:fs";
import logger from "./server/utils/logger";

export interface AppConfig {
	firstLaunch: boolean;
	theme: "light" | "dark";
	language: string;
	defaultLogsPath: string;
	enableDesktopNotifications: boolean;
	notifyOnInstallComplete: boolean;
}

// default config
export const defaultConfig: AppConfig = {
	firstLaunch: false,
	theme: "dark",
	language: "en",
	defaultLogsPath: path.join(app.getPath("userData"), "logs"),
	enableDesktopNotifications: true,
	notifyOnInstallComplete: true,
};
// get config file
export const getConfigPath = () => {
	return path.join(app.getPath("userData"), "config.json");
};
// read config
export const readConfig = (): AppConfig | null => {
	try {
		const configPath = getConfigPath();
		if (fs.existsSync(configPath)) {
			const storedConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
			return { ...defaultConfig, ...storedConfig };
		}
		return null;
	} catch (error) {
		logger.error("Error reading configuration:", error);
		return null;
	}
};

// write config
export const writeConfig = (config: AppConfig) => {
	const path = getConfigPath();
	const fd = fs.openSync(path, "w");
	fs.writeFileSync(fd, JSON.stringify(config));
	fs.fsyncSync(fd);
	fs.closeSync(fd);
};
// update config
export const updateConfig = (newSettings: Partial<AppConfig>) => {
	const currentConfig = readConfig();
	const updatedConfig: AppConfig = {
		...defaultConfig,
		...currentConfig,
		...newSettings,
	};

	writeConfig(updatedConfig);
};
