import fs from "node:fs";
import path from "node:path";
import { resolveScriptPaths } from "@/server/scripts/utils/paths";
import logger from "@/server/utils/logger";
import getAllScripts from "@/server/scripts/installed";

export function getTools() {
	return {
		read_file: async ({ project, file }) => {
			return read_file(project, file);
		},
		get_installed_apps: async () => {
			return get_installed_apps();
		},
	};
}

export function read_file(project: string, file: string) {
	try {
		if (!project || !file) {
			return "Error: Missing 'project' or 'file' parameter.";
		}

		logger.ai(`Reading file: ${file}`);
		const dir = resolveScriptPaths(project).workingDir;
		let pathToRead = path.join(dir, file);

		if (fs.existsSync(pathToRead)) {
			return fs.readFileSync(pathToRead, "utf8");
		}

		// search inside subdirectories
		for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
			const p = path.join(dir, e.name, file);
			if (
				(e.isFile() && e.name === file) ||
				(e.isDirectory() && fs.existsSync(p))
			) {
				pathToRead = p;
				logger.ai(`Found file: ${pathToRead}`);
				return fs.readFileSync(pathToRead, "utf8");
			}
		}

		logger.ai(`File not found: ${file} in ${dir}`);
		return `Error: File "${file}" not found in project "${project}".`;
	} catch (err: any) {
		const errorMsg = `Error reading file "${file}": ${err.message || err}`;
		logger.ai(errorMsg);
		return errorMsg;
	}
}


export async function get_installed_apps() {
	const result = await getAllScripts();
	return result;
}