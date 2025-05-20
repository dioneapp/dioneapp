import { promises as fs } from "node:fs";
import path from "node:path";
import type { Response } from "express";
import { readConfig } from "../../config";

export async function deleteScript(name: string, res: Response) {
	try {
		// sanitize name
		const sanitizedName = name.replace(/\s+/g, "-");

		// delete script dirs
		const root = process.cwd();
		const config = readConfig();
		const appsDir = path.join(config?.defaultInstallFolder || root, "apps");
		const appDir = path.join(appsDir, sanitizedName);

		// check if dir exists
		try {
			await fs.access(appDir);
		} catch (err) {
			res.status(404).send("App not found.");
			return;
		}

		// stop and delete all files
		await closeFile(appDir);
		await fs.rm(appDir, { recursive: true, force: true });
		res.status(200).send("App deleted successfully.");
	} catch (error) {
		console.error("Error deleting app:", error);
		res.status(500).send("Failed to delete app. Please try again.");
	}
}

async function closeFile(directory: string) {
	try {
		const files = await fs.readdir(directory);
		for (const file of files) {
			const filePath = path.join(directory, file);
			try {
				const stat = await fs.stat(filePath);
				if (stat.isDirectory()) {
					await fs.rm(filePath, { recursive: true, force: true });
				} else {
					await fs.unlink(filePath);
				}
			} catch (err) {
				console.warn(`Could not delete ${filePath}: ${err}`);
			}
		}
	} catch (err) {
		console.warn(`Could not read directory ${directory}: ${err}`);
	}
}
