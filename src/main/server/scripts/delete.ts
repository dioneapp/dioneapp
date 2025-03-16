import { promises as fs } from "node:fs";
import path from "node:path";
import type { Response } from "express";

export async function deleteScript(name: string, res: Response) {
	// sanitize name
	const sanitizedName = name.replace(/\s+/g, "-");

	// delete script dirs
	const root = process.cwd();
	const appsDir = path.join(root, "apps");
	const appDir = path.join(appsDir, sanitizedName);

	if (!fs.access(appDir)) {
		res.status(404).send("App not found.");
		return;
	}

	await closeFile(appDir);
	await fs.rm(appDir, { recursive: true, force: true });
	res.status(200).send("App deleted successfully.");
}

async function closeFile(directory: string) {
	try {
		const files = await fs.readdir(directory);
		for (const file of files) {
			const filePath = path.join(directory, file);
			try {
				fs.rm(filePath, { recursive: true, force: true });
				fs.unlink(filePath);
			} catch (err) {
				console.warn(`Could not delete file ${filePath}: ${err}`);
			}
		}
	} catch (err) {
		console.warn(`Could not read directory ${directory}: ${err}`);
	}
}
