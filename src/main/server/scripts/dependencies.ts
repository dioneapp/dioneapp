import fs from "node:fs";
import { execSync } from "node:child_process";
import acceptedDependencies from "./acceptedDependencies.json";
import logger from "../utils/logger";
import semver from "semver";
import type { Command } from "./execute";

export interface DioneConfig {
	dependencies?: {
		[key: string]: {
			version: string;
		};
	};
	installation: Command[];
}
interface DependencyConfig {
	[key: string]: {
		checkCommand: string;
		versionRegex?: string;
		parseVersion?: (output: string) => string;
	};
}

export async function readDioneConfig(filePath: string): Promise<DioneConfig> {
	try {
		const data = await fs.promises.readFile(filePath, "utf8");
		return JSON.parse(data) as DioneConfig;
	} catch (error) {
		console.error("Error reading dione config file:", error);
		throw error;
	}
}

async function isDependencyInstalled(
	dependency: string,
	requiredVersion: string,
	dependencyConfig: DependencyConfig,
): Promise<boolean> {
	try {
		if (!dependencyConfig[dependency]) {
			console.warn(`Not found dependency ${dependency} in config file`);
			return false;
		}
		const config = dependencyConfig[dependency];
		const output = await execSync(config.checkCommand);
		const installedVersion = output.toString().trim();

		if (requiredVersion === "latest") {
			return true;
		}

		if (!semver.satisfies(installedVersion, requiredVersion)) {
			logger.error(`Dependency "${dependency}" version is not satisfied`);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error checking dependency ${dependency} version:`, error);
		return false;
	}
}

export async function checkDependencies(dioneFile: string): Promise<{
	success: boolean;
	missing: string[];
}> {
	try {
		const config = await readDioneConfig(dioneFile);
		const missing: string[] = [];

		// if no dependencies, return success
		if (!config.dependencies) {
			logger.warn("No dependencies found in dione.json");
			return { success: true, missing };
		}

		for (const [dependency, details] of Object.entries(config.dependencies)) {
			const isInstalled = await isDependencyInstalled(
				dependency,
				details.version,
				acceptedDependencies,
			);

			if (!isInstalled) {
				logger.error(`Dependency "${dependency}" is not installed`);
				missing.push(dependency);
			}
		}
		if (missing.length === 0) {
			logger.info("All dependencies are installed");
		}
		return {
			success: missing.length === 0,
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
