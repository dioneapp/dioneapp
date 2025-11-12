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
		// if file not found in workspace path, search for it
		const files = fs.readdirSync(workspacePath);
		const foundFile = files.find((file) => file === file_name);
		if (foundFile) {
			const foundPath = path.join(workspacePath, foundFile);
			logger.ai(`Reading file: ${foundPath}`);
			const fileContents = fs.readFileSync(foundPath, "utf8");
			return fileContents;
		}
	} else {
		logger.ai(`Reading file: ${full_path}`);
		const fileContents = fs.readFileSync(full_path, "utf8");
		return fileContents;
	}
	logger.ai(`File not found: ${full_path}`);
	return "File not found";
}
