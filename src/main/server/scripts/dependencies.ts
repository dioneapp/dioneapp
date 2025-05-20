import { execSync } from "node:child_process";
import fs from "node:fs";
import semver from "semver";
import logger from "../utils/logger";
import acceptedDependencies from "./acceptedDependencies.json";
import os from "node:os";
import { executeCommand } from "./process";
import type { Server } from "socket.io";
import path from "node:path";

export interface Command {
	name: string;
	commands: string[];
	catch?: number;
	"not-required"?: boolean;
}

export interface DioneConfig {
	dependencies?: {
		[key: string]: {
			version: string;
		};
	};
	installation: Command[];
}
export interface DependencyConfig {
	[key: string]: {
		checkCommand: string;
		versionRegex?: string;
		parseVersion?: (output: string) => string;
		installCommand?: {
			windows?: string;
			macos?: string;
			linux?: string;
		};
		uninstallCommand?: {
			windows?: string;
			macos?: string;
			linux?: string;
		};
	};
}

export async function readDioneConfig(filePath: string): Promise<DioneConfig> {
	try {
		const data = await fs.promises.readFile(filePath, "utf8");
		return JSON.parse(data) as DioneConfig;
	} catch (error) {
		logger.error("Error reading dione config file:", error);
		throw error;
	}
}

type versionResult = {
	isValid: boolean;
	reason?: string;
};

async function isDependencyInstalled(
	dependency: string,
	requiredVersion: string,
	dependencyConfig: DependencyConfig,
): Promise<versionResult> {
	try {
		if (!dependencyConfig[dependency]) {
			logger.warn(`Not found dependency ${dependency} in config file`);
			return { isValid: false, reason: "not-accepted" };
		}
		const config = dependencyConfig[dependency];
		const output = await execSync(config.checkCommand);
		const installedVersion = output.toString().trim();

		if (requiredVersion === "latest") {
			return { isValid: true, reason: "required-version" };
		}

		if (!semver.satisfies(installedVersion, requiredVersion)) {
			logger.error(`Dependency "${dependency}" version is not satisfied`);
			return { isValid: false, reason: "version-not-satisfied" };
		}

		return { isValid: true, reason: "required-version" };
	} catch (error) {
		logger.error(`Error checking dependency ${dependency} version:`, error);
		return { isValid: false, reason: "error" };
	}
}

export function isDepForCurrentOS(dep: any): boolean {
	const depOS = dep.platform;
	const currentOS = os.platform();
	if (!depOS) return true;
	if (depOS === "windows" && currentOS === "win32") return true;
	if (depOS === "macos" && currentOS === "darwin") return true;
	if (depOS === "linux" && currentOS === "linux") return true;
	return false;
}

export async function checkDependencies(dioneFile: string): Promise<{
	success: boolean;
	missing: { name: string; installed: boolean; reason: string }[];
	error?: boolean;
}> {
	try {
		let config: DioneConfig;
		try {
			config = await readDioneConfig(dioneFile);
		} catch (error) {
			logger.error("Error reading dione config file:", error);
			return { success: false, missing: [], error: true };
		}
		const needEnv = JSON.stringify(config).includes("env");
		const missing: {
			name: string;
			installed: boolean;
			reason: string;
			version: string;
		}[] = [];

		// if use an env, add uv as dependency
		if (needEnv && !config.dependencies?.uv) {
			config.dependencies = {
				...config.dependencies,
				uv: {
					version: "latest",
				},
			};
		}

		// if no dependencies, return success
		if (!config.dependencies) {
			logger.warn("No dependencies found in dione.json");
			return { success: true, missing: [] };
		}

		for (const [dependency, details] of Object.entries(config.dependencies)) {
			// skip dep if not for current os
			if (!isDepForCurrentOS(details)) {
				continue;
			}

			const isInstalled = await isDependencyInstalled(
				dependency,
				details.version,
				acceptedDependencies,
			);

			if (!isInstalled.isValid) {
				logger.error(`Dependency "${dependency}" is not installed`);
				missing.push({
					name: dependency,
					installed: isInstalled.isValid,
					reason: isInstalled.reason as string,
					version: details.version,
				});
			} else {
				missing.push({
					name: dependency,
					installed: isInstalled.isValid,
					reason: "installed",
					version: details.version,
				});
			}
		}
		if (missing.length === 0) {
			logger.info("All dependencies are installed");
		}
		return {
			success: missing.every((dep) => dep.installed),
			missing,
		};
	} catch (error) {
		logger.error("Error checking dependencies:", error);
		return {
			success: false,
			missing: [],
		};
	}
}

function getPlatformKey() {
	const platform = os.platform();
	if (platform === "win32") return "windows";
	if (platform === "darwin") return "macos";
	return "linux";
}

export async function inUseDependencies(dioneFile: string) {
	// should change this later, for now if app uses a dependency, else if its not installed, gonna try to delete it
	const config = await readDioneConfig(dioneFile);
	return config.dependencies;
}

export async function uninstallDependency(dioneFile: string, io: Server) {
	const config = await readDioneConfig(dioneFile);
	const workingDir = path.dirname(dioneFile);
	if (!config.dependencies) {
		logger.warn("No dependencies found in dione.json");
		return {
			success: false,
			missing: [],
			error: true,
			reasons: ["no-dependencies"],
		};
	}

	const results = [] as Array<{
		success: boolean;
		missing: string[];
		error: boolean;
		reason?: string;
	}>;
	for (const [dependency, details] of Object.entries(config.dependencies)) {
		let reason: string | undefined;
		const depConfig = acceptedDependencies[dependency];
		const isInstalled = await isDependencyInstalled(
			dependency,
			details.version,
			acceptedDependencies,
		);

		if (!isInstalled.isValid) {
			logger.error(`Dependency "${dependency}" is not installed`);
			results.push({
				success: false,
				missing: [],
				error: true,
				reason: "not-installed",
			});
			continue;
		}

		let uninstallCommand = depConfig.uninstallCommand;
		if (!uninstallCommand) {
			logger.error(`No uninstall command found for ${dependency}`);
			results.push({
				success: false,
				missing: [],
				error: true,
				reason: "no-uninstall-command",
			});
			continue;
		}

		if (
			typeof uninstallCommand === "object" &&
			!Array.isArray(uninstallCommand)
		) {
			const platformKey = getPlatformKey();
			uninstallCommand = uninstallCommand[platformKey];
		}

		if (!uninstallCommand) {
			logger.error(`No uninstall command found for platform for ${dependency}`);
			results.push({
				success: false,
				missing: [],
				error: true,
				reason: "no-uninstall-command-platform",
			});
			continue;
		}

		const uninstallCommands = Array.isArray(uninstallCommand)
			? uninstallCommand
			: [uninstallCommand.toString()];

		let success = true;
		for (const cmd of uninstallCommands) {
			const command = cmd.replace(/\s+/g, " ");
			logger.info(`Executing uninstall command: ${command}`);
			const result = await executeCommand(
				command,
				io,
				workingDir,
				"deleteUpdate",
			);
			if (result.toString().trim() !== "") {
				logger.error(
					`Error executing uninstall command for ${dependency}: ${result.toString().trim()}`,
				);
				success = false;
				break;
			}
			logger.info(`Successfully uninstalled ${dependency}.`);
		}

		results.push({ success, missing: [], error: !success, reason });
	}

	return {
		success: results.every((r) => r.success),
		missing: [],
		error: results.some((r) => r.error),
		reasons: results.filter((r) => r.error).map((r) => r.reason),
	};
}
