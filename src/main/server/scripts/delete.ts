import fs from "node:fs";
import path from "node:path";
import type { Response } from "express";

export async function deleteScript(name: string, res: Response) {
	// sanitize name
	const sanitizedName = name.replace(/\s+/g, "-");

	// delete script dir
	const root = process.cwd();
	const appsDir = path.join(root, "apps");
	const appDir = path.join(appsDir, sanitizedName);

	if (!fs.existsSync(appDir)) {
		res.status(404).send("App not found.");
		return;
	}

	closeFile(appDir);
	fs.rmSync(appDir, { recursive: true, force: true });
	res.status(200).send("App deleted successfully.");
}

function closeFile(directory: string) {
	try {
		const files = fs.readdirSync(directory);
		for (const file of files) {
			const filePath = path.join(directory, file);
			try {
				fs.chmodSync(filePath, 0o777);
				fs.unlinkSync(filePath);
			} catch (err) {
				console.warn(`Could not delete file ${filePath}: ${err}`);
			}
		}
	} catch (err) {
		console.warn(`Could not read directory ${directory}: ${err}`);
	}
}
