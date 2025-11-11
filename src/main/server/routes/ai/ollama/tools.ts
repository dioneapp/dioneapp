import fs from "node:fs";
import path from "node:path";
import logger from "../../../utils/logger";

const availableTools = [
	{
		type: "function",
		function: {
			name: "read_file",
			description: "Read and return contents of the given file path",
			parameters: {
				type: "object",
				properties: {
					file_path: {
						type: "string",
						description: "The path to the file to read",
					},
				},
				required: ["file_path"],
			},
		},
	},
];

export function getTools() {
	return availableTools;
}

export function readFile(file_name: string, workspacePath: string) {
	const full_path = path.normalize(path.join(workspacePath, file_name));
	if (!fs.existsSync(full_path)) {
		return "File not found";
	}
	logger.ai(`Reading file: ${full_path}`);
	const fileContents = fs.readFileSync(full_path, "utf8");
	return fileContents;
}
