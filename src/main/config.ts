import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import logger from "./server/utils/logger";

export interface AppConfig {
	firstLaunch: boolean;
	theme: "light" | "dark";
	language: string;
	enableDesktopNotifications: boolean;
	notifyOnInstallComplete: boolean;
	defaultInstallFolder: string;
	defaultScriptsFolder: string;
	defaultLogsPath: string;
	compactMode: boolean;
	alwaysUninstallDependencies: boolean;
	sendAnonymousReports: boolean;
}

// default config
export const defaultConfig: AppConfig = {
	firstLaunch: false,
	theme: "dark",
	language: "en",
	enableDesktopNotifications: true,
	notifyOnInstallComplete: true,
	defaultInstallFolder: app.isPackaged
		? path.join(path.dirname(app.getPath("exe")))
		: path.join(process.cwd()),
	defaultScriptsFolder: app.isPackaged
		? path.join(path.dirname(app.getPath("exe")))
		: path.join(process.cwd()),
	defaultLogsPath: path.join(app.getPath("userData"), "logs"),
	compactMode: false,
	alwaysUninstallDependencies: false,
	sendAnonymousReports: true,
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
// reset config to default
export const resetConfig = () => {
	writeConfig(defaultConfig);
};

export const deleteConfig = () => {
	const path = getConfigPath();
	fs.unlinkSync(path);
};
