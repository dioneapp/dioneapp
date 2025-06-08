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
		const apps = await fs.promises.readdir(scriptsDir);
		if (apps.length === 0) {
			logger.info("No installed apps found.");
			return JSON.stringify({ apps: [] });
		}
		logger.info(
			`Installed applications: [${apps.map((app) => `"${app}"`).join(", ")}]`,
		);
		return JSON.stringify({ apps });
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
	console.log("script dir", scriptDir);
	try {
		await fs.promises.readdir(scriptDir);
		return true;
	} catch (error) {
		return false;
	}
}
