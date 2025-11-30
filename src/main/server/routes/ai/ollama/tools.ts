import fs from "node:fs";
import path from "node:path";
import getAllScripts from "@/server/scripts/installed";
import { resolveScriptPaths } from "@/server/scripts/utils/paths";
import logger from "@/server/utils/logger";

export function getTools(io: any) {
	return {
		read_file: async ({ project, file }) => {
			return read_file(project, file, io);
		},
		get_installed_apps: async () => {
			return get_installed_apps(io);
		},
		get_latest_apps: async () => {
			return get_latest_apps(io);
		},
		navigate_to_app: async ({ name, action }) => {
			return navigate_to_app(io, name, action);
		}
	};
}

export function read_file(project: string, file: string, io: any) {
	try {
		io.emit("ollama:using-tool", { name: "read_file", message: "Reading file" });
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

export async function get_installed_apps(io: any) {
	io.emit("ollama:using-tool", { name: "get_installed_apps", message: "Getting installed apps" });
	logger.ai("Getting installed apps...");
	const result = await getAllScripts();
	logger.ai(`Installed apps: ${result.length}`);
	return result;
}

export async function get_latest_apps(io: any) {
	io.emit("ollama:using-tool", { name: "get_latest_apps", message: "Getting latest apps" });
	async function getData(page: number, limit: number) {
		try {
			const response = await fetch(
				`https://api.getdione.app/v1/scripts?order_type=desc&page=${page}&limit=${limit}&order_by=created_at`,
				{
					headers: {
						...(process.env.API_KEY
							? {
								Authorization: `Bearer ${process.env.API_KEY || import.meta.env.MAIN_VITE_API_KEY}`,
							}
							: {}),
					},
				},
			);

			if (response.status !== 200) {
				logger.error(
					`Fetch failed: [${response.status}] ${response.statusText}`,
				);
				return "Dione API error: " + response.statusText;
			}

			let data: any = null;
			try {
				const contentType = response.headers.get("content-type") || "";
				if (contentType.includes("application/json")) {
					data = await response.json();
				} else {
					const text = await response.text();
					logger.warn(
						`Dione API returned non-JSON (${contentType || "unknown"}).`,
					);
					try {
						data = JSON.parse(text);
					} catch {
						data = [];
					}
				}
			} catch (e: any) {
				logger.error(
					`Failed to parse explore scripts response: ${e?.message || e}`,
				);
				data = [];
			}

			if (data.status === 404) {
				return "Not found any apps";
			}

			const scripts = data.map((script: any) => ({
				...script,
				logo_url: script.logo_url || "no-logo",
			}));

			return scripts;
		} catch (error: any) {
			logger.error(`Critical error: ${error.message}`);
			return "An unexpected error occurred";
		}
	}

	logger.ai("Getting latest apps...");
	const result = await getData(1, 5);
	logger.ai(`Latest apps: ${result.length}`);
	return result;
}

export async function get_app_by_name(io: any, name: string) {
	io.emit("ollama:using-tool", { name: "get_app_by_name", message: "Reading about an app" });
	const response = await fetch(
		`https://api.getdione.app/v1/scripts?q=${name}&limit=1`,
		{
			headers: {
				...(process.env.API_KEY
					? {
						Authorization: `Bearer ${process.env.API_KEY || import.meta.env.MAIN_VITE_API_KEY}`,
					}
					: {}),
			},
		},
	);
	const data = await response.json();
	logger.ai(`Found app: ${data.length}`);
	return data;
}

export async function navigate_to_app(io: any, name: string, action: "navigate" | "start" | "install") {
	io.emit("ollama:using-tool", { name: "navigate_to_app", message: "Navigating to an app" });
	logger.ai(`Navigating to app: ${name} with action ${action}`);
	const app = await get_app_by_name(io, name);
	if (!app) {
		return "App not found";
	}
	const id = app[0].id;
	io.emit("ollama:navigate-to-app", { id, action });
	return `Navigated to app: ${name} with id ${id} and action ${action}`;
}