import fs from "node:fs";
import path from "node:path";
import type { Server } from "socket.io";
import { executeCommands } from "./process";
import logger from "../utils/logger";

async function readConfig(pathname: string) {
	const config = await fs.promises.readFile(pathname, "utf8");
	return JSON.parse(config);
}
export default async function executeInstallation(
	pathname: string,
	io: Server,
) {
	const config = await readConfig(pathname);
	const configDir = path.dirname(pathname);
	const installation = config.installation || [];

	io.emit("installUpdate", {
		type: "log",
		content: `INFO: Found ${installation.length} installation steps to execute`,
	});

	// process installation steps sequentially
	try {
		for (const step of installation) {
			io.emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step "${step.name}"`,
			});
			io.emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});

			if (step.commands && step.commands.length > 0) {
				const commandsArray: string[] = Array.isArray(step.commands)
					? step.commands
					: [step.commands.toString()];

				// if exists env property, create virtual environment and execute commands inside it
				if (step.env) {
					const envName = step.env.toString();
					io.emit("installUpdate", {
						type: "log",
						content: `INFO: Creating/using virtual environment: ${envName}`,
					});

					// create virtual environment and execute commands inside it
					const envCommands = createVirtualEnvCommands(
						envName,
						commandsArray,
						configDir,
					);
					await executeCommands(envCommands, configDir, io);
				} else {
					// execute commands normally
					await executeCommands(commandsArray, configDir, io);
				}

				io.emit("installUpdate", {
					type: "log",
					content: `INFO: Completed step "${step.name}"`,
				});
				io.emit("installUpdate", {
					type: "status",
					status: "success",
					content: `${step.name}`,
				});
			}
		}
		// emit log to reload frontend after all actions are executed
		io.emit("installUpdate", {
			type: "status",
			status: "success",
			content: "Actions executed",
		});
	} catch (error) {
		logger.error(`Failed in step: ${error}`);
	}
}

export async function executeStartup(pathname: string, io: Server) {
	const config = await readConfig(path.join(pathname, "dione.json"));
	const configDir = pathname;
	const start = config.start || [];

	io.emit("installUpdate", {
		type: "log",
		content: `INFO: Found ${start.length} start steps to execute`,
	});

	// process start steps sequentially
	try {
		let response;
		for (const step of start) {
			io.emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step "${step.name}"`,
			});
			io.emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});

			if (step.commands && step.commands.length > 0) {
				const commandsArray: string[] = Array.isArray(step.commands)
					? step.commands
					: [step.commands.toString()];

				if (step.catch) {
					io.emit("installUpdate", { type: "catch", content: step.catch });
					io.emit("installUpdate", {
						type: "log",
						content: `Watching port ${step.catch}`,
					});
				}

				// if exists env property, create virtual environment and execute commands inside it
				if (step.env) {
					const envName = step.env.toString();
					io.emit("installUpdate", {
						type: "log",
						content: `INFO: Creating/using virtual environment: ${envName}`,
					});

					// create virtual environment and execute commands inside it
					const envCommands = createVirtualEnvCommands(
						envName,
						commandsArray,
						configDir,
					);
					response = await executeCommands(envCommands, configDir, io);
				} else {
					// execute commands normally
					response = await executeCommands(commandsArray, configDir, io);
				}

				if (response.error) {
					io.emit("installUpdate", {
						type: "log",
						content: `ERROR: Failed in step "${step.name}": ${response.error}`,
					});
					io.emit("installUpdate", {
						type: "status",
						status: "error",
						content: "Error detected",
					});
					throw new Error(response.error);
				}

				io.emit("installUpdate", {
					type: "log",
					content: `INFO: Completed step "${step.name}"`,
				});
				io.emit("installUpdate", {
					type: "status",
					status: "success",
					content: `${step.name}`,
				});
			}
		}
		// emit log to reload frontend after all actions are executed
		io.emit("installUpdate", {
			type: "status",
			status: "success",
			content: "Actions executed",
		});
	} catch (error) {
		io.emit("installUpdate", {
			type: "log",
			content: `ERROR: Failed in step: ${error}`,
		});
		io.emit("installUpdate", {
			type: "status",
			status: "error",
			content: "Error detected",
		});
		throw error;
	}
}

// commands to create virtual environment
function createVirtualEnvCommands(
	envName: string,
	commands: string[],
	baseDir: string,
): string[] {
	const isWindows = process.platform === "win32";
	const envPath = path.join(baseDir, envName);

	if (isWindows) {
		// Windows
		const activateScript = path.join(envPath, "Scripts", "activate");
		return [
			`if not exist "${envPath}" (uv venv ${envName})`,
			`call "${activateScript}" && ${commands.join(" && ")} && deactivate`,
		];
	}
	// Linux/macOS
	const activateScript = path.join(envPath, "bin", "activate");
	return [
		`if [ ! -d "${envPath}" ]; then uv venv ${envName}; fi`,
		`source "${activateScript}" && ${commands.join(" && ")} && deactivate`,
	];
}
