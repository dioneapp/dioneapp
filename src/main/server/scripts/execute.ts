import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import type { Server } from "socket.io";
import { readConfig as userConfig } from "../../config";
import logger from "../utils/logger";
import { checkDependencies } from "./dependencies/dependencies";
import { addValue, getAllValues } from "./dependencies/environment";
import { executeCommands } from "./process";
import { getSystemInfo } from "./system";

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
	const dependenciesObj = config.dependencies || {};
	const dependencies = Object.keys(dependenciesObj);
	const needsBuildTools = dependencies.includes("build_tools");

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
					const envType =
						typeof step.env === "object" && "type" in step.env
							? step.env.type
							: "uv";
					const pythonVersion =
						typeof step.env === "object" && "version" in step.env
							? step.env.version
							: "";
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Creating/using virtual environment: ${envName} with ${envType}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					});
					logger.info(
						`Creating/using virtual environment: ${envName} with ${envType}${pythonVersion ? ` (Python ${pythonVersion})` : ""}`,
					);

					// create virtual environment and execute commands inside it
					const envCommands = await createVirtualEnvCommands(
						envName,
						commandsArray,
						configDir,
						pythonVersion,
						envType,
					);
					const resp = await executeCommands(
						envCommands,
						configDir,
						io,
						id,
						needsBuildTools,
					);
					if (resp?.cancelled) {
						io.to(id).emit("installUpdate", {
							type: "log",
							content:
								"INFO: Installation cancelled - stopping remaining steps",
						});
						return;
					}
				} else {
					// execute commands normally
					const resp = await executeCommands(
						commandsArray,
						configDir,
						io,
						id,
						needsBuildTools,
					);
					if (resp?.cancelled) {
						io.to(id).emit("installUpdate", {
							type: "log",
							content:
								"INFO: Installation cancelled - stopping remaining steps",
						});
						return;
					}
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
		io.to(id).emit("installUpdate", {
			type: "installFinished",
			content: "true",
		});
	} catch (error) {
		logger.error(`Failed in step: ${error}`);
	}
}

export async function executeStartup(
	pathname: string,
	io: Server,
	id: string,
	startName?: string,
	replaceCommands?: Record<string, string>,
) {
	const config = await readConfig(path.join(pathname, "dione.json"));
	const configDir = pathname;
	const dependenciesObj = config.dependencies || {};
	const dependencies = Object.keys(dependenciesObj);
	const needsBuildTools = dependencies.includes("build_tools");

	// download finished, now checking dependencies
	const result = await checkDependencies(path.join(pathname, "dione.json"));
	logger.info(`RESULT: ${JSON.stringify(result)}`);
	if (result.success) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: "All required dependencies are installed.",
		});
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "success",
			content: "Dependencies installed",
		});
	} else if (result.error) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content:
				"We have not been able to read the configuration file due to an error, check that Dione.json is well formulated as JSON.",
		});
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "error",
			content: "Error detected",
		});

		return;
	} else {
		io.to(id).emit("missingDeps", result.missing);
		const depsList = result.missing.map((dep) => dep.name).join(", ");
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `Installing dependencies: ${depsList}`,
		});
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "pending",
			content: "Installing dependencies...",
		});

		return;
	}

	let selectedStart;
	if (startName) {
		selectedStart = config.start?.find(
			(s: any) => s.name.toLowerCase() === startName.toLowerCase(),
		);
		if (!selectedStart) {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `ERROR: Start option "${startName}" not found`,
			});
			return;
		}
	} else {
		// if not specified, use the default start (first element)
		selectedStart =
			config.start && config.start.length > 0 ? config.start[0] : null;
		if (!selectedStart) {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: "INFO: No start options found",
			});
			return;
		}
	}

	io.to(id).emit("installUpdate", {
		type: "log",
		content: `INFO: Executing start: "${selectedStart.name}"`,
	});

	try {
		// convert selected start commands to steps
		const steps = selectedStart.steps
			? selectedStart.steps
			: selectedStart.commands
				? [{ name: selectedStart.name, commands: selectedStart.commands }]
				: [];

		let response: { cancelled?: boolean; error?: string } | undefined;

		for (const step of steps) {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step ${step.name}`,
			});
			io.to(id).emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});

			const commandsArray: string[] = step.commands.map((cmd: any) => {
				let commandStr: string;

				if (typeof cmd === "object") {
					commandStr = cmd.command;
				} else {
					commandStr = cmd.toString();
				}
				if (replaceCommands && commandStr in replaceCommands) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Replacing command "${commandStr}" with "${replaceCommands[commandStr]}"`,
					});
					return replaceCommands[commandStr];
				}

				return commandStr;
			});

			if (selectedStart.catch) {
				io.to(id).emit("installUpdate", {
					type: "catch",
					content: selectedStart.catch,
				});
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `Watching port ${selectedStart.catch}`,
				});
			}

			if (selectedStart.env) {
				const envName =
					typeof selectedStart.env === "string"
						? selectedStart.env
						: selectedStart.env.name;
				const envType =
					typeof selectedStart.env === "object" && "type" in selectedStart.env
						? selectedStart.env.type
						: "uv";
				const pythonVersion =
					typeof selectedStart.env === "object" &&
					"version" in selectedStart.env
						? selectedStart.env.version
						: "";

				io.to(id).emit("installUpdate", {
					type: "log",
					content: `INFO: Using virtual environment: ${envName} with ${envType}${
						pythonVersion ? ` (Python ${pythonVersion})` : ""
					}`,
				});

				const envCommands = await createVirtualEnvCommands(
					envName,
					commandsArray,
					configDir,
					pythonVersion,
					envType,
				);
				response = await executeCommands(
					envCommands,
					configDir,
					io,
					id,
					needsBuildTools,
				);
			} else {
				response = await executeCommands(
					commandsArray,
					configDir,
					io,
					id,
					needsBuildTools,
				);
			}

			if (response?.cancelled) {
				io.to(id).emit("installUpdate", {
					type: "log",
					content: "INFO: Startup cancelled - stopping remaining steps",
				});
				return;
			}

			if (response?.error) {
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
	} catch (error) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `ERROR: Failed in default startup: ${error}`,
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
async function createVirtualEnvCommands(
	envName: string,
	commands: string[] | any[],
	baseDir: string,
	pythonVersion: string,
	envType = "uv",
) {
	const isWindows = process.platform === "win32";
	const currentPlatform = process.platform;
	const { gpu: currentGpu } = await getSystemInfo();
	const envPath = path.join(baseDir, envName);

	// filter and ensure commands is an array of strings without empty strings
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
					// Apply platform filtering
					if ("platform" in cmd) {
						const cmdPlatform = cmd.platform.toLowerCase();
						const normalizedPlatform =
							currentPlatform === "win32"
								? "windows"
								: currentPlatform === "darwin"
									? "mac"
									: currentPlatform === "linux"
										? "linux"
										: currentPlatform;

						// if platform does not match current platform, skip
						if (cmdPlatform !== normalizedPlatform) {
							logger.info(
								`Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}`,
							);
							return [];
						}
					}

					// Apply GPU filtering
					if ("gpus" in cmd) {
						const allowedGpus = Array.isArray(cmd.gpus)
							? cmd.gpus.map((g: string) => g.toLowerCase())
							: [cmd.gpus.toLowerCase()];

						if (!allowedGpus.includes(currentGpu.toLowerCase())) {
							logger.info(
								`Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
							);
							return [];
						}
					}

					return [cmd.command.trim()];
				}
				return [];
			})
		: [];

	// add python version flag if specified
	const pythonFlag = pythonVersion ? `--python ${pythonVersion}` : "";
	// join commands without leading/trailing separators; add separators conditionally where used
	const middle = commandStrings.join(" && ");

	// variables
	const variables = getAllValues();
	const config = userConfig();

	if (envType === "conda") {
		const pythonArg = pythonVersion ? `python=${pythonVersion}` : "";
		const condaW = path.join(
			config?.defaultBinFolder || path.join(app.getPath("userData")),
			"bin",
			"conda",
			"condabin",
			"conda.bat",
		);
		const condaU = path.join(
			config?.defaultBinFolder || path.join(app.getPath("userData")),
			"bin",
			"conda",
			"bin",
			"activate",
		);
		const condaUC = path.join(
			config?.defaultBinFolder || path.join(app.getPath("userData")),
			"bin",
			"conda",
			"bin",
			"conda",
		);
		if (isWindows) {
			const between = middle ? ` && ${middle} && ` : " && ";
			return [
				`if not exist "${envPath}" (${condaW} tos accept --channel main && ${condaW} create -p "${envPath}" ${pythonArg} -y)`,
				`call ${condaW} activate "${envPath}"${between}call ${condaW} deactivate`,
			];
		}
		// for linux and mac
		{
			const between = middle ? ` && ${middle} && ` : " && ";
			return [
				`if [ ! -d "${envPath}" ]; then ${condaUC} create -p "${envPath}" ${pythonArg} -y; fi`,
				`. "${condaU}" "${envPath}"${between}conda deactivate`,
			];
		}
	}

	// default uv env
	if (isWindows && envType !== "conda") {
		const activateScript = path.join(envPath, "Scripts", "activate");
		const deactivateScript = path.join(envPath, "Scripts", "deactivate.bat");
		if (!variables.PATH.includes(path.join(envPath, "Scripts"))) {
			addValue("PATH", path.join(envPath, "Scripts"));
		}
		{
			const between = middle ? ` ${middle} && ` : " && ";
			return [
				`if not exist "${envPath}" (uv venv ${pythonFlag} "${envName}")`,
				`call "${activateScript}"${between}call "${deactivateScript}"`,
			];
		}
	}

	// for linux and mac
	const activateScript = path.join(envPath, "bin", "activate");
	if (!variables.PATH.includes(path.join(envPath, "Scripts"))) {
		addValue("PATH", path.join(envPath, "Scripts"));
	}

	const existsEnv = fs.existsSync(envPath);
	if (!existsEnv) {
		{
			const between = middle ? ` ${middle} && ` : " && ";
			return [
				// create new env
				`uv venv ${pythonFlag} "${envPath}"`,
				// use it
				`. "${activateScript}"${between}deactivate`,
			];
		}
	} else {
		const between = middle ? ` ${middle} && ` : " && ";
		return [
			// use existing env
			`. "${activateScript}"${between}deactivate`,
		];
	}
}
