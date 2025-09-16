import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import { platform as getPlatform } from "node:os";
import path from "node:path";
import pidtree from "pidtree";
import type { Server } from "socket.io";
import logger from "../utils/logger";
import { useGit } from "../utils/useGit";
import { getAllValues, initDefaultEnv } from "./dependencies/environment";
import BuildToolsManager from "./dependencies/utils/build-tools-manager";
import { getSystemInfo } from "./system";

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
							content: "Script killed successfully",
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
			content: "No valid port or active process to kill.",
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
						content: `ERROR listing port ${port}: ${stderr}`,
					});

					if (!activePID) {
						return resolve(true); // no active process to stop
					}
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No port active found, stopping active process...`,
					});
					const success = await killProcess(activePID, io, id);
					return resolve(success);
				}
				const pids = stdout.split(/\r?\n/).filter(Boolean).map(Number);
				if (pids.length === 0) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No processes found on port ${port}`,
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
						content: `Killed processes: ${pids.join(", ")}`,
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
					content: `ERROR netstat: ${stderr}`,
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
					content: `No processes found on port ${port}`,
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
									content: `ERROR killing PID ${pid}: ${killStderr}`,
								});
							} else {
								logger.info(`PID ${pid} killed successfully`);
								io.to(id).emit("installUpdate", {
									type: "log",
									content: `PID ${pid} killed successfully`,
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
	};

	if (needsBuildTools) {
		logger.info(`This script requires build tools. Initializing...`);
		const buildTools = BuildToolsManager.getInstance();
		const buildToolsReady = await buildTools.initialize();
		if (!buildToolsReady) {
			logger.warn("Build tools initialization failed. Compilation may fail.");
			io.to(id).emit(logs, {
				type: "log",
				content:
					"WARNING: Build tools initialization failed. Compilation may fail.",
			});
			enhancedEnv = baseEnv;
		} else {
			enhancedEnv = buildTools.getEnhancedEnvironment(ENVIRONMENT);
			logger.info("Build tools ready for native compilation");
			io.to(id).emit(logs, {
				type: "log",
				content: "Build tools initialized for native module compilation",
			});
		}
	} else {
		enhancedEnv = baseEnv;
	}

	try {
		// // if active process exists, kill it (disabled for multiple apps)
		// await stopActiveProcess(io, id);

		const currentPlatform = getPlatform();
		const isWindows = currentPlatform === "win32";

		// split command into executable and arguments
		const [executable, ...args] = command.split(/\s+/);

		const isBatFile =
			executable.endsWith(".bat") || executable.endsWith(".cmd");

		const isGitCommand = command.includes("git");

		io.to(id).emit(logs, {
			type: "log",
			content: `Working on directory: ${workingDir}`,
		});
		const spawnOptions = {
			cwd: workingDir,
			shell: isWindows ? !isBatFile : true,
			windowsHide: true,
			detached: false,
			env: enhancedEnv,
		};

		// handle bat files
		if (isWindows) {
			if (executable.endsWith(".bat") || executable.endsWith(".cmd")) {
				activeProcess = spawn("cmd.exe", ["/S", "/C", command], {
					...spawnOptions,
					stdio: ["pipe", "pipe", "pipe"],
				});
			} else {
				activeProcess = spawn(executable, args, {
					...spawnOptions,
					stdio: ["pipe", "pipe", "pipe"],
				});
			}
		} else {
			if (isGitCommand) {
				// handle git commands on linux/macos
				const result = await useGit(command, workingDir, io, id);
				if (result) {
					return { code: 0, stdout: "", stderr: "" };
				}
			} else {
				// handle sh files
				if (executable.endsWith(".sh")) {
					activeProcess = spawn("bash", [executable, ...args], {
						...spawnOptions,
						stdio: ["pipe", "pipe", "pipe"],
					});
				} else {
					activeProcess = spawn(executable, args, {
						...spawnOptions,
						stdio: ["pipe", "pipe", "pipe"],
					});
				}
			}
		}

		activePID = activeProcess.pid;
		logger.info(`Started process (PID: ${activePID}): ${command}`);
		io.to(id).emit(logs, {
			type: "log",
			content: `Executing: ${command}`,
		});

		activeProcess.stdout.on("data", (data: Buffer) => {
			const text = data.toString("utf8").replace(/\r?\n$/, "");
			if (text) {
				stdoutData += `${text}\n`;
				io.to(id).emit(logs, { type: "log", content: text });
				logger.info(`[stdout] ${text}`);
			}
		});
		activeProcess.stderr.on("data", (data: Buffer) => {
			const text = data.toString("utf8").replace(/\r?\n$/, "");
			if (text) {
				stderrData += `${text}\n`;
				if (text.match(/error|fatal|unexpected/i)) {
					io.to(id).emit(logs, { type: "log", content: text });
					// logger.error(`[stderr-error] ${text}`);
					// killProcess(activeProcess, io, id);
					io.to(id).emit(logs, {
						type: "log",
						content: `"${command}": ${text}`,
					});
					// io.to(id).emit(logs, {
					// 	type: "status",
					// 	status: "error",
					// 	content: "Error detected",
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
						content: `ERROR: ${errorMsg}`,
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
			content: `ERROR: ${errorMsg}`,
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
): Promise<{ cancelled: boolean }> => {
	// reset cancellation state for a new command batch
	processWasCancelled = false;
	let currentWorkingDir = workingDir;
	const currentPlatform = getPlatform(); // "win32", "linux", "darwin"
	const { gpu: currentGpu } = await getSystemInfo();

	for (const cmd of commands) {
		// if user requested cancellation, stop processing further commands
		if (processWasCancelled) {
			logger.info("Process cancelled - stopping remaining commands");
			io.to(id).emit("installUpdate", {
				type: "log",
				content: "INFO: Process cancelled - stopping remaining commands",
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
						content: `INFO: Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}`,
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
						content: `INFO: Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
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
					content: `ERROR: Invalid command object: ${JSON.stringify(cmd)}`,
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
					content: `ERROR: Directory does not exist: ${newWorkingDir}`,
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
				content: `INFO: Changed working directory to: ${currentWorkingDir}`,
			});
		
			// remove the cd command
			command = command.replace(cdRegex, "").trim();
		}

		if (command.length > 0) {
			const response = await executeCommand(
				command,
				io,
				currentWorkingDir,
				id,
				needsBuildTools,
			);
		
			if (response.code !== 0) {
				if (processWasCancelled) {
					logger.info("Process was manually cancelled");
					io.to(id).emit("installUpdate", {
						type: "log",
						content: "INFO: Process was manually cancelled",
					});
					return { cancelled: true };
				}
				throw new Error(
					response.stderr || `Command failed with exit code ${response.code}`,
				);
			}
			}
	}
	return { cancelled: false };
};
