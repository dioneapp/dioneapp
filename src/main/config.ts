import fs from "node:fs";
import path from "node:path";
import { app, dialog } from "electron";
import logger from "./server/utils/logger";

export interface AppConfig {
	firstLaunch: boolean;
	theme: "light" | "dark";
	language: string;
	enableDesktopNotifications: boolean;
	notifyOnInstallComplete: boolean;
	autoOpenAfterInstall: boolean;
	defaultInstallFolder: string;
	defaultBinFolder: string;
	defaultLogsPath: string;
	compactMode: boolean;
	alwaysUninstallDependencies: boolean;
	sendAnonymousReports: boolean;
	enableDiscordRPC: boolean;
}

// default config
export const defaultConfig: AppConfig = {
	firstLaunch: false,
	theme: "dark",
	language: "en",
	enableDesktopNotifications: true,
	notifyOnInstallComplete: true,
	autoOpenAfterInstall: true,
	defaultInstallFolder: path.join(app.getPath("userData")),
	defaultBinFolder: path.join(app.getPath("userData")),
	defaultLogsPath: path.join(app.getPath("userData")),
	compactMode: false,
	alwaysUninstallDependencies: false,
	sendAnonymousReports: true,
	enableDiscordRPC: true,
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
	const root = app.isPackaged
		? path.join(path.dirname(app.getPath("exe")))
		: path.join(process.cwd());

	if (!config.defaultInstallFolder) {
		fs.mkdirSync(config.defaultInstallFolder, { recursive: true });
	}

	if (!config.defaultBinFolder) {
		fs.mkdirSync(config.defaultBinFolder, { recursive: true });
	}

	if (config.defaultInstallFolder === root) {
		logger.warn(
			"Default install folder is set to the current working directory. This may cause issues.",
		);
		dialog.showErrorBox(
			"Warning!",
			"To avoid potential errors when updating, please do not use the same path as the Dione executable.",
		);
		config.defaultInstallFolder = path.join(app.getPath("userData"));
	}
	if (config.defaultBinFolder === root) {
		logger.warn(
			"Default bin folder is set to the current working directory. This may cause issues.",
		);
		dialog.showErrorBox(
			"Warning!",
			"To avoid potential errors when updating, please do not use the same path as the Dione executable.",
		);
		config.defaultBinFolder = path.join(app.getPath("userData"));
	}

	const configPath = getConfigPath();
	const fd = fs.openSync(configPath, "w");
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
