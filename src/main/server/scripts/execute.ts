import fs from "node:fs";
import path from "node:path";
import type { Server } from "socket.io";
import logger from "../utils/logger";
import { executeCommands } from "./process";

async function readConfig(pathname: string) {
	const config = await fs.promises.readFile(pathname, "utf8");
	return JSON.parse(config);
}
export default async function executeInstallation(
	pathname: string,
	io: Server,
	id: string,
) {
	const config = await readConfig(pathname);
	const configDir = path.dirname(pathname);
	const installation = config.installation || [];

	io.to(id).emit("installUpdate", {
		type: "log",
		content: `INFO: Found ${installation.length} installation steps to execute`,
	});

	// process installation steps sequentially
	try {
		for (const step of installation) {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step "${step.name}"`,
			});
			io.to(id).emit("installUpdate", {
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
					const envName =
						typeof step.env === "string" ? step.env : step.env.name;
					const pythonVersion =
						typeof step.env === "object" && "version" in step.env
							? step.env.version
							: "";
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Creating/using virtual environment: ${envName}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					});
					logger.info(
						`Creating/using virtual environment: ${envName}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					);

					// create virtual environment and execute commands inside it
					const envCommands = createVirtualEnvCommands(
						envName,
						commandsArray,
						configDir,
						pythonVersion,
					);
					await executeCommands(envCommands, configDir, io, id);
				} else {
					// execute commands normally
					await executeCommands(commandsArray, configDir, io, id);
				}

				io.to(id).emit("installUpdate", {
					type: "log",
					content: `INFO: Completed step "${step.name}"`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "success",
					content: `${step.name}`,
				});
			}
		}
		// emit log to reload frontend after all actions are executed
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "success",
			content: "Actions executed",
		});
	} catch (error) {
		logger.error(`Failed in step: ${error}`);
	}
}

export async function executeStartup(pathname: string, io: Server, id: string) {
	const config = await readConfig(path.join(pathname, "dione.json"));
	const configDir = pathname;
	const start = config.start || [];

	io.to(id).emit("installUpdate", {
		type: "log",
		content: `INFO: Found ${start.length} start steps to execute`,
	});

	// process start steps sequentially
	try {
		let response;
		for (const step of start) {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step "${step.name}"`,
			});
			io.to(id).emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});

			if (step.commands && step.commands.length > 0) {
				const commandsArray: string[] = Array.isArray(step.commands)
					? step.commands
					: [step.commands.toString()];

				if (step.catch) {
					io.to(id).emit("installUpdate", {
						type: "catch",
						content: step.catch,
					});
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `Watching port ${step.catch}`,
					});
				}

				// if exists env property, create virtual environment and execute commands inside it
				if (step.env) {
					const envName =
						typeof step.env === "string" ? step.env : step.env.name;
					const pythonVersion =
						typeof step.env === "object" && "version" in step.env
							? step.env.version
							: "";
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Creating/using virtual environment: ${envName}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					});

					logger.info(
						`Creating/using virtual environment: ${envName}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					);

					// create virtual environment and execute commands inside it
					const envCommands = createVirtualEnvCommands(
						envName,
						commandsArray,
						configDir,
						pythonVersion,
					);
					response = await executeCommands(envCommands, configDir, io, id);
				} else {
					// execute commands normally
					response = await executeCommands(commandsArray, configDir, io, id);
				}

				if (response.error) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `ERROR: Failed in step "${step.name}": ${response.error}`,
					});
					io.to(id).emit("installUpdate", {
						type: "status",
						status: "error",
						content: "Error detected",
					});
					throw new Error(response.error);
				}

				io.to(id).emit("installUpdate", {
					type: "log",
					content: `INFO: Completed step "${step.name}"`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "success",
					content: `${step.name}`,
				});
			}
		}
		// emit log to reload frontend after all actions are executed
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "success",
			content: "Actions executed",
		});
	} catch (error) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `ERROR: Failed in step: ${error}`,
		});
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "error",
			content: "Error detected",
		});
		throw error;
	}
}

// commands to create virtual environment
function createVirtualEnvCommands(envName, commands, baseDir, pythonVersion) {
	const isWindows = process.platform === "win32";
	const envPath = path.join(baseDir, envName);

	// ensure commands is an array of strings without empty strings
	const commandStrings = Array.isArray(commands)
		? commands.flatMap((cmd) => {
				if (typeof cmd === "string" && cmd.trim()) {
					return [cmd.trim()];
				}
				if (
					cmd &&
					typeof cmd === "object" &&
					typeof cmd.command === "string" &&
					cmd.command.trim()
				) {
					return [cmd.command.trim()];
				}
				return [];
			})
		: [];

	// add python version flag if specified
	const pythonFlag = pythonVersion ? `--python ${pythonVersion}` : "";

	if (isWindows) {
		const activateScript = path.join(envPath, "Scripts", "activate");
		// add && only if there are commands to execute
		const middle = commandStrings.length
			? `&& ${commandStrings.join(" && ")}`
			: "";
		return [
			`if not exist "${envPath}" (uv venv ${pythonFlag} ${envName})`,
			`call "${activateScript}" ${middle}`,
			`${envPath}\\Scripts\\deactivate.bat`,
		];
	}

	// for linux and mac
	const activateScript = path.join(envPath, "bin", "activate");
	const middle = commandStrings.length
		? `&& ${commandStrings.join(" && ")}`
		: "";
	return [
		`if [ ! -d "${envPath}" ]; then uv venv ${pythonFlag} ${envName}; fi`,
		`source "${activateScript}" ${middle}`,
		`${envPath}\\Scripts\\deactivate.bat`,
	];
}
