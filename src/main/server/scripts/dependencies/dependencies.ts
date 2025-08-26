import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import type { Server } from "socket.io";
import { readConfig } from "../../../config";
import logger from "../../utils/logger";
import { dependencyRegistry } from "./accepted-dependencies";

export function readDioneConfig(filePath: string): any {
	try {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error reading Dione config from ${filePath}:`, error);
		return null;
	}
}

export async function checkDependencies(dioneConfigPath: string): Promise<{
	success: boolean;
	missing: { name: string; installed: boolean; reason: string }[];
	error?: boolean;
}> {

	const config = readConfig();
	const binFolder = path.join(
		config?.defaultBinFolder || path.join(app.getPath("userData")),
		"bin",
	);

	const dioneConfig = readDioneConfig(dioneConfigPath);
	const dependencies = dioneConfig?.dependencies || {};
	const needEnv = JSON.stringify(dioneConfig).includes("env");
	const envType =
		dioneConfig.installation.find((dep) => dep.env)?.env?.type || "uv";

	const missing: { name: string; installed: boolean; reason: string }[] = [];

	// if use an environment, check if uv or conda is needed
	if (envType === "uv" && !dependencies.uv && needEnv) {
		dependencies.uv = { version: "latest" };
	}
	if (envType === "conda" && !dependencies.conda && needEnv) {
		dependencies.conda = { version: "latest" };
	}

	if (Object.keys(dependencies).length === 0) {
		logger.warn("No dependencies found in Dione config");
		return {
			success: true,
			missing: [],
		};
	}

	for (const depName of Object.keys(dependencies)) {
		const entry = dependencyRegistry[depName];

		if (!entry) {
			missing.push({
				name: depName,
				installed: false,
				reason: "error",
			});
			continue;
		}

		try {
			const installed = await entry.isInstalled(binFolder);
			if (!installed.installed) {
				logger.warn(
					`Dependency not installed: ${depName}, Reason: ${installed.reason}`,
				);
				missing.push({
					name: depName,
					installed: false,
					reason: installed.reason || "not-installed",
				});
			}
		} catch (err) {
			logger.error(`Error checking dependency ${depName}:`, err);
			missing.push({
				name: depName,
				installed: false,
				reason: `error`,
			});
		}
	}

	return {
		success: missing.length === 0,
		missing,
	};
}

export async function installDependency(
	depName: string,
	id: string,
	io: Server,
) {
	const config = readConfig();
	const binFolder = path.join(
		config?.defaultBinFolder || path.join(app.getPath("userData")),
		"bin",
	);
	const entry = dependencyRegistry[depName];
	if (!entry) {
		logger.error(`Unknown dependency: ${depName}`);
		io.emit("installDep", {
			type: "error",
			content: `Unknown dependency: ${depName}`,
		});
		return {
			success: false,
			reason: "Unknown dependency",
		};
	}

	try {
		const result = await entry.install(binFolder, id, io);
		if (result.success) {
			logger.info(`Dependency ${depName} installed successfully`);
			return { success: true };
		} else {
			logger.error(`Failed to install dependency ${depName}`);
			return { success: false };
		}
	} catch (error) {
		logger.error(`Error installing dependency ${depName}:`, error);
		io.to(id).emit("installDep", {
			type: "error",
			content: `Error installing ${depName}: ${error}`,
		});
		return { success: false, reason: `error` };
	}
}

export async function uninstallDependency(selectedDeps: string[], io: Server) {
	const config = readConfig();
	const binFolder = path.join(
		config?.defaultBinFolder || path.join(app.getPath("userData")),
		"bin",
	);
	const results = await Promise.all(
		selectedDeps.map(async (depName) => {
			io.emit("deleteUpdate", "deleting_deps");
			const entry = dependencyRegistry[depName];
			if (!entry) {
				logger.error(`Unknown dependency: ${depName}`);
				return { success: false, reason: "not-installed" };
			}

			try {
				await entry.uninstall(binFolder);
				logger.info(`Dependency ${depName} uninstalled successfully`);
				return { success: true };
			} catch (error) {
				io.emit("deleteUpdate", "error");
				logger.error(`Error uninstalling dependency ${depName}:`, error);
				return { success: false, reason: `error` };
			}
		}),
	);

	const failed = results.filter((result) => !result.success);
	if (failed.length > 0) {
		return { success: false, reasons: failed.map((f) => f.reason) };
	}

	return { success: true };
}

export async function inUseDependencies(
	dioneFile: string,
): Promise<string[] | null> {
	const dioneConfig = readDioneConfig(dioneFile);
	if (!dioneConfig) {
		return null;
	}

	const dependencies = dioneConfig.dependencies || {};
	if (Object.keys(dependencies).length === 0) {
		return null;
	}

	const inUse: string[] = [];
	Object.keys(dependencies).forEach((depName) => {
		const entry = dependencyRegistry[depName];
		if (entry) {
			inUse.push(depName);
		}
	});

	const needEnv = JSON.stringify(dioneConfig).includes("env");
	const envType =
		dioneConfig.installation.find((dep) => dep.env)?.env.type || "uv";

	if (envType === "uv" && !dioneConfig.dependencies?.uv && needEnv) {
		inUse.push("uv");
	}

	if (envType === "conda" && !dioneConfig.dependencies?.conda && needEnv) {
		inUse.push("conda");
	}

	console.log(`Dependencies in use: ${inUse.join(", ")}`);
	return inUse;
}
