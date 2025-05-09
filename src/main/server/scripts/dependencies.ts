import fs from "node:fs";
import { execSync } from "node:child_process";
import acceptedDependencies from "./acceptedDependencies.json";
import logger from "../utils/logger";
import semver from "semver";

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
interface DependencyConfig {
	[key: string]: {
		checkCommand: string;
		versionRegex?: string;
		parseVersion?: (output: string) => string;
		installCommand?: {
			windows: string;
			macos: string;
			linux: string;
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
