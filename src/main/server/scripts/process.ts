import {
	getAllValues,
	initDefaultEnv,
} from "@/server/scripts/dependencies/environment";
import BuildToolsManager from "@/server/scripts/dependencies/utils/build-tools-manager";
import { getSystemInfo } from "@/server/scripts/system";
import logger from "@/server/utils/logger";
import { useGit } from "@/server/utils/useGit";
import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import { arch, platform as getPlatform } from "node:os";
import path from "node:path";
import pidtree from "pidtree";
import type { Server } from "socket.io";

let activeProcess: any = null;
let activePID: number | null = null;
let processWasCancelled = false;

// kill process and its children
// currently, this function is only used during the installation of dependencies,
// as this is a process that must be controlled.
// it will not work if used in processes that generate non-child threads.
// in such cases, it is recommended to use the killByPort (l-53) function.
export const killProcess = async (pid: number, io: Server, id: string) => {
	try {
		processWasCancelled = true;
		const currentPlatform = getPlatform();
		if (currentPlatform === "win32") {
			return new Promise<boolean>((resolve) => {
				const taskkill = spawn("taskkill", [
					// cspell:disable-line
					"/PID",
					pid.toString(),
					"/T",
					"/F",
				]);
				taskkill.on("close", (code) => {
					if (code === 0) {
						io.to(id).emit("installUpdate", {
							type: "log",
							content: "Script killed successfully\n",
						});
						logger.info("Script killed successfully");
						resolve(true);
					} else {
						logger.error(`Script exited with code ${code}`);
						resolve(false);
					}
				});

				taskkill.on("error", (error) => {
					logger.error(`Error killing process: ${error.message}`);
					resolve(false);
				});
			});
		}

		// macos / linux
		const childPids = await pidtree(pid, { root: true });
		for (const childPid of childPids) {
			process.kill(childPid, "SIGKILL");
		}
		process.kill(pid, "SIGKILL");

		io.to(id).emit("installUpdate", {
			type: "log",
			content: "Script killed successfully",
		});
		logger.info("Script killed successfully");
		return true;
	} catch (error: unknown) {
		logger.error(`Can't kill process with PID ${pid}: ${error}`);
		return false;
	}
};
async function killByPort(
	port: number,
	io: Server,
	id: string,
): Promise<boolean> {
	processWasCancelled = true;

	if (!port || isNaN(port)) {
		logger.warn(
			"No valid port provided for killByPort. Attempting to kill active process...",
		);
		if (activePID) {
			const success = await killProcess(activePID, io, id);
			return success;
		}
		io.to(id).emit("installUpdate", {
			type: "log",
			content: "No valid port or active process to kill.\n",
		});
		return true;
	}

	const currentPlatform = getPlatform();
	if (currentPlatform !== "win32") {
		// linux/macos
		const cmd = `lsof -t -i :${port}`;
		return new Promise((resolve) => {
			exec(cmd, async (err, stdout, stderr) => {
				if (err) {
					logger.error(`Error listing port ${port}: ${stderr}`);
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `ERROR listing port ${port}: ${stderr}\n`,
					});

					if (!activePID) {
						return resolve(true); // no active process to stop
					}
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No port active found, stopping active process...\n`,
					});
					const success = await killProcess(activePID, io, id);
					return resolve(success);
				}
				const pids = stdout.split(/\r?\n/).filter(Boolean).map(Number);
				if (pids.length === 0) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No processes found on port ${port}\n`,
					});
					if (!activePID) {
						return resolve(true); // no active process to stop
					}
					const success = await killProcess(activePID, io, id);
					return resolve(success);
				}
				Promise.all(
					pids.map((pid) => {
						return new Promise<void>((res) => {
							try {
								process.kill(pid, "SIGKILL");
								logger.info(`Killed PID ${pid} on Linux/macOS`);
							} catch (e: unknown) {
								logger.warn(`Failed to kill PID ${pid}: ${e}`);
							}
							res();
						});
					}),
				).then(async () => {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `Killed processes: ${pids.join(", ")}\n`,
					});
					if (activePID) {
						await killProcess(activePID, io, id);
					}
					resolve(true);
				});
			});
		});
	}

	// win
	return new Promise((resolve) => {
		exec("netstat -ano -p tcp", async (err, stdout, stderr) => {
			if (err) {
				logger.error(`Error netstat: ${stderr}`);
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `ERROR netstat: ${stderr}\n`,
				});
				return resolve(false);
			}
			const lines = stdout.split(/\r?\n/);
			const matches = lines
				.map((line) => {
					const parts = line.trim().split(/\s+/);
					// format
					if (parts[1]?.endsWith(`:${port}`) && parts[3] === "LISTENING") {
						return Number(parts[4]);
					}
					return null;
				})
				.filter((pid): pid is number => pid !== null);

			if (matches.length === 0) {
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `No processes found on port ${port}\n`,
				});
				if (!activePID) {
					return resolve(true); // no active process to stop
				}
				logger.info(`Killing active process with PID ${activePID}`);
				const success = await killProcess(activePID, io, id);
				return resolve(success);
			}

			// kill each PID
			logger.info(`Killing processes on port ${port}: ${matches.join(", ")}`);
			Promise.all(
				matches.map((pid) => {
					return new Promise<void>((res) => {
						exec(`taskkill /PID ${pid} /T /F`, (killErr, killStderr) => {
							// cspell:disable-line
							if (killErr) {
								logger.warn(`Error killing PID ${pid}: ${killStderr}`);
								io.to(id).emit("installUpdate", {
									type: "log",
									content: `ERROR killing PID ${pid}: ${killStderr}\n`,
								});
							} else {
								logger.info(`PID ${pid} killed successfully`);
								io.to(id).emit("installUpdate", {
									type: "log",
									content: `PID ${pid} killed successfully\n`,
								});
							}
							res();
						});
					});
				}),
			).then(async () => {
				if (activePID) {
					await killProcess(activePID, io, id);
				}

				resolve(true);
			});
		});
	});
}

// is active process running?
export const stopActiveProcess = async (
	io: Server,
	id: string,
	port: number,
) => {
	logger.warn(`Stopping any process on port ${port}...`);
	processWasCancelled = true;
	const success = await killByPort(port, io, id);
	activeProcess = null;
	activePID = null;
	return success;
};

// execute command
export const executeCommand = async (
	command: string,
	io: Server,
	workingDir: string,
	id: string,
	needsBuildTools?: boolean,
	logsType?: string,
	options?: { onOutput?: (text: string) => void },
): Promise<{ code: number; stdout: string; stderr: string }> => {
	let stdoutData = "";
	let stderrData = "";
	let enhancedEnv = {};
	const logs = logsType || "installUpdate";
	const ENVIRONMENT = getAllValues();

	if (ENVIRONMENT === null) {
		initDefaultEnv();
	}

	// command options with enhanced environment for build tools
	const baseEnv = {
		...ENVIRONMENT,
		PYTHONUNBUFFERED: "1",
		NODE_NO_BUFFERING: "1",
		FORCE_UNBUFFERED_OUTPUT: "1",
		PYTHONIOENCODING: "UTF-8",
		FORCE_COLOR: "1",
		GRADIO_SERVER_NAME: "0.0.0.0", // Allow Gradio to accept connections from network
		// fix for py-cpuinfo not detecting Intel Core Ultra CPUs and other newer x86_64 processors
		...(process.platform === "win32" && {
			PROCESSOR_ARCHITECTURE:
				process.env.PROCESSOR_ARCHITECTURE ||
				(arch() === "x64" ? "AMD64" : arch() === "ia32" ? "x86" : "AMD64"),
			PROCESSOR_ARCHITEW6432: process.env.PROCESSOR_ARCHITEW6432 || "AMD64",
		}),
		// cross-platform CUDA detection for deepspeed compatibility
		// set CUDA_HOME if not already set and try to detect it automatically
		CUDA_HOME:
			process.env.CUDA_HOME ||
			(() => {
				if (process.platform === "win32") {
					// windows - check standard NVIDIA GPU Computing Toolkit installation
					const cudaBasePath =
						"C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA";
					const versions = [
						"v13.0",
						"v12.9",
						"v12.8",
						"v12.7",
						"v12.6",
						"v12.5",
						"v12.4",
						"v12.3",
						"v12.2",
						"v12.1",
						"v12.0",
						"v11.8",
						"v11.7",
					];
					for (const version of versions) {
						const cudaPath = path.join(cudaBasePath, version);
						if (fs.existsSync(path.join(cudaPath, "bin", "nvcc.exe"))) {
							return cudaPath;
						}
					}
				} else if (process.platform === "linux") {
					// linux - check common CUDA installation paths
					const commonPaths = [
						"/usr/local/cuda",
						"/opt/cuda",
						"/usr/local/cuda-13.0",
						"/usr/local/cuda-12.9",
						"/usr/local/cuda-12.8",
						"/usr/local/cuda-12.7",
						"/usr/local/cuda-12.6",
						"/usr/local/cuda-12.5",
						"/usr/local/cuda-12.4",
						"/usr/local/cuda-12.3",
						"/usr/local/cuda-12.2",
						"/usr/local/cuda-12.1",
						"/usr/local/cuda-12.0",
						"/usr/local/cuda-11.8",
						"/usr/local/cuda-11.7",
					];
					for (const cudaPath of commonPaths) {
						if (fs.existsSync(path.join(cudaPath, "bin", "nvcc"))) {
							return cudaPath;
						}
					}
				}
				// macos is not included as Apple dropped CUDA support after macOS Mojave (10.14)
				return undefined;
			})(),
		// set to "1" to skip CUDA check
		DS_BUILD_OPS: "0",
		DS_SKIP_CUDA_CHECK: "1",
	};

	// if (needsBuildTools) {
	// 	logger.info(`This script requires build tools. Initializing...`);
	// 	const buildTools = BuildToolsManager.getInstance();
	// 	const buildToolsReady = await buildTools.initialize();
	// 	if (!buildToolsReady) {
	// 		logger.warn("Build tools initialization failed. Compilation may fail.");
	// 		io.to(id).emit(logs, {
	// 			type: "log",
	// 			content:
	// 				"WARNING: Build tools initialization failed. Compilation may fail.\n",
	// 		});
	// 		enhancedEnv = baseEnv;
	// 	} else {
	// 		enhancedEnv = buildTools.getEnhancedEnvironment(ENVIRONMENT);
	// 		logger.info("Build tools ready for native compilation");
	// 		io.to(id).emit(logs, {
	// 			type: "log",
	// 			content: "Build tools initialized for native module compilation\n",
	// 		});
	// 	}
	// } else {
	// 	enhancedEnv = baseEnv;
	// }

	// avoid re-initializing using cache
	const _cacheKey = "__buildToolsEnv";
	const _fnAny = executeCommand as unknown as Record<string, any>;

	const initializeBuildTools = async () => {
		logger.info(`This script requires build tools. Initializing...`);
		const buildTools = BuildToolsManager.getInstance();
		const buildToolsReady = await buildTools.initialize();

		if (!buildToolsReady) {
			logger.warn("Build tools initialization failed. Compilation may fail.");
			io.to(id).emit(logs, {
				type: "log",
				content:
					"WARNING: Build tools initialization failed. Compilation may fail.\n",
			});
			return baseEnv;
		}

		logger.info("Build tools ready for native compilation");
		io.to(id).emit(logs, {
			type: "log",
			content: "Build tools initialized for native module compilation\n",
		});
		return buildTools.getEnhancedEnvironment(ENVIRONMENT);
	};

	if (needsBuildTools) {
		// initialize once per process and reuse the enhanced env for subsequent commands
		if (!_fnAny[_cacheKey]) {
			_fnAny[_cacheKey] = await initializeBuildTools();
		} else {
			logger.info("Reusing cached build tools environment");
		}
		enhancedEnv = _fnAny[_cacheKey];
	} else {
		enhancedEnv = baseEnv;
	}

	try {
		// // if active process exists, kill it (disabled for multiple apps)
		// await stopActiveProcess(io, id);

		const currentPlatform = getPlatform();
		const isWindows = currentPlatform === "win32";

		// io.to(id).emit(logs, {
		//     type: "log",
		//     content: `Working on directory: ${workingDir}\n`,
		// });
		logger.info(`Working on directory: ${workingDir}`);
		const spawnOptions = {
			cwd: workingDir,
			shell: true,
			windowsHide: true,
			detached: false,
			env: enhancedEnv,
		};

		// handle git commands
		if (!isWindows && command.startsWith("git ")) {
			const result = await useGit(command, workingDir, io, id);
			if (result) {
				return { code: 0, stdout: "", stderr: "" };
			}
		}

		activeProcess = spawn(command, spawnOptions);
		activePID = activeProcess.pid;
		logger.info(`Started process (PID: ${activePID}): ${command}`);
		// io.to(id).emit(logs, {
		//     type: "log",
		//     content: `Executing: ${command}\n`,
		// });
		logger.info(`Executing: ${command}`);

		activeProcess.stdout.on("data", (data: Buffer) => {
			const text = data.toString("utf8");
			if (text) {
				stdoutData += text;
				io.to(id).emit(logs, { type: "log", content: text });
				options?.onOutput?.(text);
				logger.info(`[stdout] ${text}`);
			}
		});
		activeProcess.stderr.on("data", (data: Buffer) => {
			const text = data.toString("utf8");
			if (text) {
				stderrData += text;
				if (text.match(/error|fatal|unexpected/i)) {
					io.to(id).emit(logs, { type: "log", content: text });
					// logger.error(`[stderr-error] ${text}`);
					// killProcess(activeProcess, io, id);
					io.to(id).emit(logs, {
						type: "log",
						content: `"${command}": ${text}`,
					});
					// io.to(id).emit(logs, {
					//     type: "status",
					//     status: "error",
					//     content: "Error detected",
					// });
					// return;
				}
				if (text.match(/warning|warn|deprecated/i)) {
					io.to(id).emit(logs, { type: "log", content: `WARN: ${text}` });
					logger.warn(`[stderr-warn] ${text}`);
				} else {
					io.to(id).emit(logs, { type: "log", content: `OUT: ${text}` });
					logger.info(`[stderr-info] ${text}`);
				}
				options?.onOutput?.(text);
			}
		});

		return new Promise<{ code: number; stdout: string; stderr: string }>(
			(resolve) => {
				activeProcess.on("exit", (code: number) => {
					const oldPid = activePID;
					activeProcess = null;
					activePID = null;

					logger.info(
						`Process (PID: ${oldPid}) finished with exit code ${code}`,
					);
					resolve({ code, stdout: stdoutData, stderr: stderrData });
				});

				activeProcess.on("error", (error) => {
					const errorMsg = `Failed to start command: ${error.message}`;
					logger.error(errorMsg);
					io.to(id).emit(logs, {
						type: "log",
						content: `ERROR: ${errorMsg}\n`,
					});
					io.to(id).emit(logs, {
						type: "status",
						status: "error",
						content: "Failed to start process",
					});
					activeProcess = null;
					activePID = null;
					resolve({ code: -1, stdout: "", stderr: errorMsg });
				});
			},
		);
	} catch (error: any) {
		const errorMsg = `Exception executing command: ${error.message}`;
		logger.error(errorMsg);
		io.to(id).emit(logs, {
			type: "status",
			status: "error",
			content: "Error detected",
		});
		io.to(id).emit(logs, {
			type: "log",
			content: `ERROR: ${errorMsg}\n`,
		});
		return { code: -1, stdout: "", stderr: errorMsg };
	}
};

export const executeCommands = async (
	commands: any[],
	workingDir: string,
	io: Server,
	id: string,
	needsBuildTools?: boolean,
	options?: { onOutput?: (text: string) => void; onProgress?: (progress: number) => void },
): Promise<{ cancelled: boolean }> => {
	// reset cancellation state for a new command batch
	processWasCancelled = false;
	let currentWorkingDir = workingDir;
	const currentPlatform = getPlatform(); // "win32", "linux", "darwin"
	const { gpu: currentGpu } = await getSystemInfo();

	// track progress across commands
	const totalCommands = commands.length;
	let completedCommands = 0;

	for (const cmd of commands) {
		// if user requested cancellation, stop processing further commands
		if (processWasCancelled) {
			logger.info("Process cancelled - stopping remaining commands");
			io.to(id).emit("installUpdate", {
				type: "log",
				content: "INFO: Process cancelled - stopping remaining commands\n",
			});
			return { cancelled: true };
		}

		let command: string;

		// if string use it
		if (typeof cmd === "string") {
			command = cmd;
		} else if (typeof cmd === "object" && cmd !== null) {
			// if object includes platform, check if it matches current platform
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
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}\n`,
					});
					continue;
				}
			}

			// if object includes gpus, check if it matches current gpu vendor
			if ("gpus" in cmd) {
				const allowedGpus = Array.isArray(cmd.gpus)
					? cmd.gpus.map((g: string) => g.toLowerCase())
					: [cmd.gpus.toLowerCase()];

				if (!allowedGpus.includes(currentGpu.toLowerCase())) {
					logger.info(
						`Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
					);
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `INFO: Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU\n`,
					});
					continue; // skip command
				}
			}

			// if object includes command, use it
			if ("command" in cmd) {
				command = cmd.command;
			} else {
				logger.error(`Invalid command object: ${JSON.stringify(cmd)}`);
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `ERROR: Invalid command object: ${JSON.stringify(cmd)}\n`,
				});
				continue;
			}
		} else {
			logger.error(`Invalid command type: ${typeof cmd}`);
			continue;
		}

		command = command.trim();

		const cdRegex = /\bcd\s+([^\s;]+)/;
		const cdMatch = command.match(cdRegex);

		if (cdMatch) {
			const targetDir = cdMatch[1].trim();
			const newWorkingDir = path.isAbsolute(targetDir)
				? targetDir
				: path.join(currentWorkingDir, targetDir);

			if (!fs.existsSync(newWorkingDir)) {
				logger.error(`Directory does not exist: ${newWorkingDir}`);
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `ERROR: Directory does not exist: ${newWorkingDir}\n`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "error",
					content: "Error detected",
				});
				continue;
			}

			currentWorkingDir = newWorkingDir;
			logger.info(`Changed working directory to: ${currentWorkingDir}`);
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Changed working directory to: ${currentWorkingDir}\n`,
			});

			// remove the cd command
			command = command.replace(cdRegex, "").trim();
		}

		if (command.length > 0) {
			// track progress within this command
			let commandProgress = 0;
			let outputLines = 0;
			const startTime = Date.now();
			let lastProgressEmit = 0;
			
			// emit initial progress for this command starting
			if (options?.onProgress) {
				const baseProgress = completedCommands / totalCommands;
				options.onProgress(baseProgress);
			}

			const response = await executeCommand(
				command,
				io,
				currentWorkingDir,
				id,
				needsBuildTools,
				undefined,
				{
					...options,
					onOutput: (text: string) => {
						options?.onOutput?.(text);
						
						outputLines++;
						const elapsed = Date.now() - startTime;
						
						const timeProgress = Math.min(0.92, Math.log(elapsed + 1000) / Math.log(120000));
						const outputProgress = Math.min(0.92, Math.sqrt(outputLines / 50));
						
						commandProgress = Math.max(
							commandProgress,
							0.4 * timeProgress + 0.6 * outputProgress,
							outputLines > 0 ? 0.05 : 0
						);
						
						const overallProgress = (completedCommands + commandProgress) / totalCommands;
						
						const now = Date.now();
						if (now - lastProgressEmit > 300 && options?.onProgress) {
							options.onProgress(overallProgress);
							lastProgressEmit = now;
						}
					},
				},
			);

			if (response.code !== 0) {
				if (processWasCancelled) {
					logger.info("Process was manually cancelled");
					io.to(id).emit("installUpdate", {
						type: "log",
						content: "INFO: Process was manually cancelled\n",
					});
					return { cancelled: true };
				}
				throw new Error(
					response.stderr || `Command failed with exit code ${response.code}`,
				);
			}

			completedCommands++;
			if (options?.onProgress) {
				options.onProgress(completedCommands / totalCommands);
			}
		}
	}
	return { cancelled: false };
};
