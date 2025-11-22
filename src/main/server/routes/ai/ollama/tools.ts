import fs from "node:fs";
import path from "node:path";
import { resolveScriptPaths } from "@/server/scripts/utils/paths";
import logger from "@/server/utils/logger";

const availableTools = [
	{
		type: "function",
		function: {
			name: "read_file",
			description:
				"Reads content from a specific file in a project. ONLY use this when the user explicitly asks to read a file or asks about a specific project's codebase. Do NOT use for general knowledge questions.",
			parameters: {
				type: "object",
				properties: {
					project: {
						type: "string",
						description: "The project name",
					},
					file: {
						type: "string",
						description: "The file name with extension",
					},
				},
				required: ["project", "file"],
			},
		},
	},
];

export function getTools() {
	return availableTools;
}

export function read_file(project: string, file: string) {
	try {
		if (!project || !file || project === "None" || file === "None") {
			return "Error: You called the tool with empty parameters. Please ask the user for the project and file name first.";
		}

		logger.ai(`Reading file: ${file}`);
		const dir = resolveScriptPaths(project).workingDir;
		let pathToRead = path.join(dir, file);

		if (fs.existsSync(pathToRead)) {
			return fs.readFileSync(pathToRead, "utf8");
		}

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
		return `Error: File "${file}" not found in project "${project}"`;
	} catch (err: any) {
		const errorMsg = `Error reading file "${file}": ${err.message || err}`;
		logger.ai(errorMsg);
		return errorMsg;
	}
}
