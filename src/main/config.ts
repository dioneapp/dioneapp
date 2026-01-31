import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import logger from "@/server/utils/logger";
import { app, dialog } from "electron";

export interface AppConfig {
	codename: string;
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
	layoutMode: "sidebar" | "topbar";
	alwaysUninstallDependencies: boolean;
	sendAnonymousReports: boolean;
	enableDiscordRPC: boolean;
	disableAutoUpdates: boolean;
	enableSuccessSound: boolean;
	disableFeaturedVideos: boolean;
}
// generate codename
function shortHash(value: string) {
	return crypto
		.createHash("sha1")
		.update(value)
		.digest("hex")
		.slice(0, 6)
		.toUpperCase();
}
// default config
export const defaultConfig: AppConfig = {
	codename: shortHash(
		process.env.USER ||
			process.env.USERNAME ||
			os?.userInfo?.()?.username ||
			crypto.randomUUID(),
	),
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
	layoutMode: "sidebar",
	alwaysUninstallDependencies: false,
	sendAnonymousReports: true,
	enableDiscordRPC: true,
	disableAutoUpdates: false,
	enableSuccessSound: true,
	disableFeaturedVideos: false,
};
// get config file
export const getConfigPath = () => {
	return path.join(app.getPath("userData"), "config.json");
};
// read config
export const readConfig = (): AppConfig => {
	try {
		const configPath = getConfigPath();

		if (!fs.existsSync(configPath)) {
			writeConfig(defaultConfig);
			return defaultConfig;
		}

		const storedConfig = JSON.parse(
			fs.readFileSync(configPath, "utf8"),
		) as Partial<AppConfig>;

		const mergedConfig: AppConfig = {
			...defaultConfig,
			...storedConfig,
		};

		if (Object.keys(defaultConfig).some((key) => !(key in storedConfig))) {
			writeConfig(mergedConfig);
		}

		return mergedConfig;
	} catch (error) {
		logger.error("Error reading configuration:", error);
		return defaultConfig;
	}
};
// write config
export const writeConfig = (config: AppConfig) => {
	const root = app.isPackaged
		? path.join(path.dirname(app.getPath("exe")))
		: path.join(process.cwd());

	if (!fs.existsSync(config.defaultInstallFolder)) {
		fs.mkdirSync(config.defaultInstallFolder, { recursive: true });
	}

	if (!fs.existsSync(config.defaultBinFolder)) {
		fs.mkdirSync(config.defaultBinFolder, { recursive: true });
	}

	const normalizedInstallFolder = path
		.resolve(config.defaultInstallFolder)
		.toLowerCase();
	const normalizedBinFolder = path
		.resolve(config.defaultBinFolder)
		.toLowerCase();
	const normalizedRoot = path.resolve(root).toLowerCase();

	if (normalizedInstallFolder === normalizedRoot) {
		logger.warn(
			"Default install folder is set to the current working directory. This may cause issues.",
		);
		dialog.showErrorBox(
			"Warning!",
			"To avoid potential errors when updating, please do not use the same path as the Dione executable.",
		);
		config.defaultInstallFolder = path.join(app.getPath("userData"));
	}
	if (normalizedBinFolder === normalizedRoot) {
		logger.warn(
			"Default bin folder is set to the current working directory. This may cause issues.",
		);
		dialog.showErrorBox(
			"Warning!",
			"To avoid potential errors when updating, please do not use the same path as the Dione executable.",
		);
		config.defaultBinFolder = config.defaultInstallFolder;
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

	if (newSettings.defaultBinFolder) {
		if (newSettings?.defaultBinFolder !== currentConfig?.defaultBinFolder) {
			try {
				if (!fs.existsSync(newSettings.defaultBinFolder)) {
					fs.mkdirSync(newSettings.defaultBinFolder, { recursive: true });
					console.log(`Created directory: ${newSettings.defaultBinFolder}`);
				}
			} catch (error) {
				logger.error(`Failed to create bin folder: ${error}`);
			}
		}
	}

	if (newSettings.defaultInstallFolder) {
		if (
			newSettings?.defaultInstallFolder !== currentConfig?.defaultInstallFolder
		) {
			try {
				if (!fs.existsSync(newSettings.defaultInstallFolder)) {
					fs.mkdirSync(newSettings.defaultInstallFolder, { recursive: true });
					console.log(`Created directory: ${newSettings.defaultInstallFolder}`);
				}
			} catch (error) {
				logger.error(`Failed to create install folder: ${error}`);
			}
		}
	}

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
