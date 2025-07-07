import fs from "node:fs";
import path from "node:path";
import { readConfig } from "../../config";
import logger from "../utils/logger";

export default async function getAllScripts() {
	const root = process.cwd();
	const config = readConfig();
	const scriptsDir = path.join(config?.defaultInstallFolder || root, "apps");

	try {
		await fs.promises.mkdir(scriptsDir, { recursive: true });
	} catch (error) {
		logger.error("Error creating apps directory:", error);
		return JSON.stringify({ apps: [] });
	}

	try {
		const appDirs = await fs.promises.readdir(scriptsDir, {
			withFileTypes: true,
		});

		const validApps: string[] = [];

		for (const dirent of appDirs) {
			if (dirent.isDirectory()) {
				const appPath = path.join(scriptsDir, dirent.name);
				const files = await fs.promises.readdir(appPath);
				const scriptConfig = files.filter((file) => file !== "dione.json");

				if (scriptConfig.length > 0) {
					validApps.push(dirent.name);
				}
			}
		}

		if (validApps.length === 0) {
			logger.info("No installed apps found.");
			return JSON.stringify({ apps: [] });
		}

		logger.info(
			`Installed apps: [${validApps.map((app) => `"${app}"`).join(", ")}]`,
		);
		return JSON.stringify({ apps: validApps });
	} catch (error) {
		logger.error("Error reading apps directory:", error);
		return JSON.stringify({ apps: [] });
	}
}

export async function getInstalledScript(name: string) {
	const root = process.cwd();
	const config = readConfig();
	const sanitizedName = name.replace(/\s+/g, "-");
	const scriptDir = path.join(
		config?.defaultInstallFolder || root,
		"apps",
		sanitizedName,
	);

	try {
		const files = await fs.promises.readdir(scriptDir, {
			withFileTypes: true,
		});

		return files.some((file) => file.name !== "dione.json");
	} catch (error) {
		return false;
	}
}
