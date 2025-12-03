import fs from "node:fs";
import path from "node:path";
import { readConfig as userConfig } from "@/config";
import { checkDependencies } from "@/server/scripts/dependencies/dependencies";
import {
	addValue,
	getAllValues,
} from "@/server/scripts/dependencies/environment";
import { getArch, getOS } from "@/server/scripts/dependencies/utils/system";
import { executeCommands } from "@/server/scripts/process";
import { getSystemInfo } from "@/server/scripts/system";
import logger from "@/server/utils/logger";
import {
	emitRunProgress,
	generateRunId,
} from "@/server/utils/progress-emitter";
import { app } from "electron";
import type { Server } from "socket.io";

async function readConfig(pathname: string) {
	const config = await fs.promises.readFile(pathname, "utf8");
	return JSON.parse(config);
}

async function patchNetworkAccess(configDir: string) {
	try {
		const files = await fs.promises.readdir(configDir, { withFileTypes: true });
		const pyFiles = files.filter((f) => f.isFile() && f.name.endsWith(".py"));

		for (const file of pyFiles) {
			const filePath = path.join(configDir, file.name);

			try {
				const content = await fs.promises.readFile(filePath, "utf8");
				const modified =
					content.includes("server_name='127.0.0.1'") ||
					content.includes('server_name="127.0.0.1"');

				if (modified) {
					const patchedContent = content.replace(
						/server_name=('|")127\.0\.0\.1('|")/g,
						"$10.0.0.0$2",
					);
					await fs.promises.writeFile(filePath, patchedContent, "utf8");
					logger.info(`Patched network access in: ${file.name}`);
				}
			} catch (error) {
				logger.error(`Could not patch ${file.name}: ${error}`);
			}
		}
	} catch (error) {
		logger.error("Error patching network access:", error);
	}
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
		content: `INFO: Found ${installation.length} installation steps to execute\n`,
	});

	// initialize structured progress for installation run
	const runId = generateRunId(`${id}:install`);
	if (installation.length > 0) {
		const stepsDef = installation.map((s: any, idx: number) => ({
			id: `step-${idx + 1}`,
			label: s.name || `Step ${idx + 1}`,
			weight: 1 / installation.length,
		}));
		emitRunProgress(io, id, {
			type: "run_started",
			runId,
			totalSteps: stepsDef.length,
			steps: stepsDef,
		});
	}

	// process installation steps sequentially
	try {
		for (let i = 0; i < installation.length; i++) {
			const step = installation[i];
			const stepId = `step-${i + 1}`;

			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step "${step.name}"\n`,
			});
			io.to(id).emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});
			if (installation.length > 0) {
				emitRunProgress(io, id, { type: "step_started", runId, id: stepId });
			}

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
						content: `INFO: Creating/using virtual environment: ${envName} with ${envType}${pythonVersion ? ` (Python ${pythonVersion})` : ""}\n`,
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
						{
							onProgress: (progress: number) => {
								emitRunProgress(io, id, {
									type: "step_progress",
									runId,
									id: stepId,
									progress,
								});
							},
						},
					);
					if (resp?.cancelled) {
						io.to(id).emit("installUpdate", {
							type: "log",
							content: `INFO: Installation cancelled with run id ${runId} - stopping remaining steps`,
						});
						emitRunProgress(io, id, {
							type: "run_finished",
							runId,
							success: false,
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
						{
							onProgress: (progress: number) => {
								emitRunProgress(io, id, {
									type: "step_progress",
									runId,
									id: stepId,
									progress,
								});
							},
						},
					);
					if (resp?.cancelled) {
						io.to(id).emit("installUpdate", {
							type: "log",
							content:
								"INFO: Installation cancelled - stopping remaining steps",
						});
						emitRunProgress(io, id, {
							type: "run_finished",
							runId,
							success: false,
						});
						return;
					}
				}
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `INFO: Completed step "${step.name}"\n`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "success",
					content: `${step.name}`,
				});
				if (installation.length > 0) {
					emitRunProgress(io, id, { type: "step_finished", runId, id: stepId });
				}
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
		if (installation.length > 0) {
			emitRunProgress(io, id, { type: "run_finished", runId, success: true });
		}
	} catch (error) {
		logger.error(`Failed in step: ${error}`);
		emitRunProgress(io, id, { type: "run_finished", runId, success: false });
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

	// Patch Gradio/Streamlit files to allow network access
	await patchNetworkAccess(configDir);

	// download finished, now checking dependencies
	const result = await checkDependencies(path.join(pathname, "dione.json"));
	logger.info(`RESULT: ${JSON.stringify(result)}`);
	if (result.success) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: "All required dependencies are installed.\n",
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
				"We have not been able to read the configuration file due to an error, check that Dione.json is well formulated as JSON.\n",
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
			content: `Installing dependencies: ${depsList}\n`,
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
				content: "INFO: No start options found\n",
			});
			return;
		}
	}

	// io.to(id).emit("installUpdate", {
	//     type: "log",
	//     content: `INFO: Executing start: "${selectedStart.name}"\n`,
	// });

	// structured progress setup for start run
	const startStepsRaw = selectedStart.steps
		? selectedStart.steps
		: selectedStart.commands
			? [{ name: selectedStart.name, commands: selectedStart.commands }]
			: [];
	const hasWaitPort = Boolean(selectedStart.catch);
	const runId = generateRunId(`${id}:start`);
	const stepsDef = [
		...startStepsRaw.map((s: any, idx: number) => ({
			id: `step-${idx + 1}`,
			label: s.name || `Step ${idx + 1}`,
			weight: hasWaitPort
				? 0.8 / startStepsRaw.length
				: 1 / startStepsRaw.length,
		})),
		...(hasWaitPort
			? [{ id: "wait-port", label: "Wait for service", weight: 0.2 }]
			: []),
	];
	emitRunProgress(io, id, {
		type: "run_started",
		runId,
		totalSteps: stepsDef.length,
		steps: stepsDef,
	});

	try {
		// convert selected start commands to steps
		const steps = startStepsRaw;

		let response:
			| { cancelled?: boolean; id?: string; error?: string }
			| undefined;
		let haveMarkedServiceReady = false;

		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];
			const stepId = `step-${i + 1}`;

			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Starting step ${step.name}\n`,
			});
			io.to(id).emit("installUpdate", {
				type: "status",
				status: "pending",
				content: `${step.name}`,
			});

			emitRunProgress(io, id, { type: "step_started", runId, id: stepId });

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
						content: `INFO: Replacing command "${commandStr}" with "${replaceCommands[commandStr]}"\n`,
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
					type: "info",
					content: `Watching port ${selectedStart.catch}\n`,
				});
			}

			const outputHandler = (text: string) => {
				if (haveMarkedServiceReady) return;
				const plain = text.replace(/\x1b\[[0-9;]*m/g, "");
				if (
					/running on|serving at|server running|localhost|127\.0\.0\.1|0\.0\.0\.0|http:\/\/|https:\/\//i.test(
						plain,
					)
				) {
					if (hasWaitPort) {
						emitRunProgress(io, id, {
							type: "step_finished",
							runId,
							id: "wait-port",
						});
						emitRunProgress(io, id, {
							type: "run_finished",
							runId,
							success: true,
						});
						haveMarkedServiceReady = true;
					}
				}
			};

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
					content: `INFO: Using virtual environment: ${envName} with ${envType}${pythonVersion ? ` (Python ${pythonVersion})` : ""
						}\n`,
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
					{
						onOutput: outputHandler,
						onProgress: (progress: number) => {
							emitRunProgress(io, id, {
								type: "step_progress",
								runId,
								id: stepId,
								progress,
							});
						},
					},
				);
			} else {
				response = await executeCommands(
					commandsArray,
					configDir,
					io,
					id,
					needsBuildTools,
					{
						onOutput: outputHandler,
						onProgress: (progress: number) => {
							emitRunProgress(io, id, {
								type: "step_progress",
								runId,
								id: stepId,
								progress,
							});
						},
					},
				);
			}
			if (response?.cancelled) {
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `INFO: Startup cancelled with run id ${response.id || "no id"} - stopping remaining steps\n`,
				});
				emitRunProgress(io, id, {
					type: "run_finished",
					runId,
					success: false,
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
				emitRunProgress(io, id, {
					type: "run_finished",
					runId,
					success: false,
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

			emitRunProgress(io, id, { type: "step_finished", runId, id: stepId });
		}

		// if we have a wait-port step and it wasn't already marked, start it now
		if (hasWaitPort && !haveMarkedServiceReady) {
			emitRunProgress(io, id, { type: "step_started", runId, id: "wait-port" });
			// run_finished will be emitted by outputHandler when the service is ready
		} else if (!hasWaitPort) {
			// finish run when there is no wait port
			emitRunProgress(io, id, { type: "run_finished", runId, success: true });
		}
	} catch (error) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `ERROR: Failed in default startup: ${error}\n`,
		});
		io.to(id).emit("installUpdate", {
			type: "status",
			status: "error",
			content: "Error detected",
		});
		emitRunProgress(io, id, { type: "run_finished", runId, success: false });
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
	const middle =
		commandStrings.length > 1
			? commandStrings.join(" && ")
			: commandStrings[0] || "";

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
				`if not exist "${envPath}" (call "${condaW}" tos accept --channel main & call "${condaW}" create -p "${envPath}" ${pythonArg} -y)`,
				`call "${condaW}" activate "${envPath}"${between}call "${condaW}" deactivate`,
			];
		}
		// for linux and mac
		{
			const between = middle ? ` && ${middle} && ` : " && ";
			return [
				`if [ ! -d "${envPath}" ]; then "${condaUC}" create -p "${envPath}" ${pythonArg} -y; fi`,
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
	const arch = getArch();
	const platform = getOS();
	const uvFolder =
		platform === "linux"
			? arch === "amd64"
				? "uv-x86_64-unknown-linux-gnu"
				: "uv-aarch64-unknown-linux-gnu"
			: platform === "macos"
				? arch === "amd64"
					? "uv-x86_64-apple-darwin"
					: "uv-aarch64-apple-darwin"
				: "";

	const uvPath = path.join(
		config?.defaultBinFolder || path.join(app.getPath("userData")),
		"bin",
		"uv",
		uvFolder,
		process.platform === "win32" ? "uv.exe" : "uv",
	);

	if (!existsEnv) {
		{
			const between = middle ? ` ${middle} && ` : " && ";
			return [
				// create new env
				`"${uvPath}" venv ${pythonFlag} "${envPath}"`,
				// use it
				`. "${activateScript}"${between}deactivate`,
			];
		}
	}
	const between = middle ? ` ${middle} && ` : " && ";
	return [
		// use existing env
		`. "${activateScript}"${between}deactivate`,
	];
}
