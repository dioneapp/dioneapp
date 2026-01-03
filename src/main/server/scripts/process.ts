import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import { arch, platform as getPlatform } from "node:os";
import path from "node:path";
import {
	getAllValues,
	initDefaultEnv,
} from "@/server/scripts/dependencies/environment";
import BuildToolsManager from "@/server/scripts/dependencies/utils/build-tools-manager";
import { getSystemInfo } from "@/server/scripts/system";
import logger from "@/server/utils/logger";
import pty from "@lydell/node-pty";
import pidtree from "pidtree";
import type { Server } from "socket.io";
import { useGit } from "../utils/use-git";

const activeProcesses = new Set<any>();
const activePIDs = new Set<number>();
const processesByApp = new Map<string, Set<number>>();

export const resizeTerminal = (id: string, cols: number, rows: number) => {
	const pids = getTrackedPIDs(id);
	pids.forEach((pid) => {
		activeProcesses.forEach((proc) => {
			if (proc?.pid === pid && typeof proc.resize === "function") {
				try {
					proc.resize(cols, rows);
				} catch (e) {
					logger.warn(`Failed to resize process ${pid}: ${e}`);
				}
			}
		});
	});
};

const registerProcess = (appId: string, pid: number) => {
	if (!appId || !pid) return;
	activePIDs.add(pid);
	const set = processesByApp.get(appId) ?? new Set<number>();
	set.add(pid);
	processesByApp.set(appId, set);
};

const sanitizePathForLog = (p?: string) => {
	if (!p) return "";
	try {
		return path.basename(p) || p;
	} catch (e) {
		return p;
	}
};

const unregisterProcess = (appId: string, pid: number) => {
	if (pid) {
		activePIDs.delete(pid);
	}
	if (!appId || !processesByApp.has(appId)) return;
	const set = processesByApp.get(appId);
	set?.delete(pid);
	if (set && set.size === 0) {
		processesByApp.delete(appId);
	}
};

const getTrackedPIDs = (appId?: string): number[] => {
	if (appId && processesByApp.has(appId)) {
		return Array.from(processesByApp.get(appId) ?? []);
	}
	return Array.from(activePIDs);
};

const dropProcesses = async (id?: string, pid?: number) => {
	if (pid) {
		// kill single process
		activeProcesses.forEach((proc) => {
			if (proc?.pid === pid) {
				try {
					proc.write("\x03"); // SIGINT
					setTimeout(() => proc.kill(), 50);
				} catch (e) {
					logger.warn(`Failed to kill process ${pid}: ${e}`);
				}
				activeProcesses.delete(proc);
			}
		});
		unregisterProcess(id!, pid);
	} else if (id) {
		// kill all processes associated with this app id
		const pids = processesByApp.get(id);
		logger.info(`Process managed by ${id}: ${pids}`);
		if (pids) {
			for (const trackedPID of pids) {
				activeProcesses.forEach((proc) => {
					if (proc?.pid === trackedPID) {
						try {
							proc.write("\x03");
							setTimeout(() => proc.kill(), 50);
							logger.info(`Killed process ${trackedPID}`);
						} catch (e) {
							logger.warn(`Failed to kill process ${trackedPID}: ${e}`);
							throw e;
						}
						activeProcesses.delete(proc);
					}
				});
				activePIDs.delete(trackedPID);
			}
			processesByApp.delete(id);
		}
	}
};
let processWasCancelled = false;

// is active process running?
export const stopActiveProcess = async (
	io: Server,
	id: string,
	pid?: number,
) => {
	processWasCancelled = true;

	if (pid) {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `Killing process with id ${pid}\n`,
		});
		logger.info(`Killing process with id ${pid}`);
	} else {
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `Killing all processes for app ${id}\n`,
		});
		logger.info(`Killing all processes for app ${id}`);
	}

	await dropProcesses(id, pid);
	return true;
};

// execute command using PTY for proper terminal emulation
const stripAnsi = (str: string) => {
	return str
		.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "")
		.replace(/\x1b\][0-9;]*(?:[a-zA-Z]|[^\x07]*\x07)/g, "")
		.replace(/\x1b[PX^_].*?\x1b\\/g, "");
};

export const executeCommand = async (
	command: string,
	io: Server,
	workingDir: string,
	id: string,
	needsBuildTools?: boolean,
	logsType?: string,
	options?: { onOutput?: (text: string) => void },
): Promise<{ code: number; stdout: string; stderr: string }> => {
	let outputData = "";
	const enhancedEnv = await getEnhancedEnv(needsBuildTools || false);
	const logs = logsType || "installUpdate";
	const START_TOKEN = `:::LOG_START_${Date.now()}:::`;
	let isLogStarted = false;

	try {
		const currentPlatform = getPlatform();
		const isWindows = currentPlatform === "win32";

		logger.info(`Working on directory: ${sanitizePathForLog(workingDir)}`);

		// handle git commands on non-Windows
		if (!isWindows && command.startsWith("git ")) {
			const result = await useGit(command, workingDir, io, id);
			if (result) {
				return { code: 0, stdout: "", stderr: "" };
			}
		}

		const shell = isWindows
			? process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe"
			: process.env.SHELL || "/bin/bash";

		const shellArgs = isWindows ? ["/Q"] : [];

		const ptyProcess = pty.spawn(shell, shellArgs, {
			name: "xterm-256color",
			cols: 80,
			rows: 25,
			cwd: workingDir,
			env: enhancedEnv as Record<string, string>,
		});

		const pid = ptyProcess.pid;

		if (isWindows) {
			ptyProcess.write(
				`@echo off\r\nchcp 65001 >nul\r\necho ${START_TOKEN}\r\n${command}\r\nexit\r\n`,
			);
		} else {
			ptyProcess.write(`echo "${START_TOKEN}"; ${command}; exit\n`);
		}

		logger.info(
			`Executing: ${command.length > 300 ? command.substring(0, 300) + "..." : command}`,
		);

		if (pid) {
			activeProcesses.add(ptyProcess);
			registerProcess(id, pid);
		}

		let buffer = "";
		ptyProcess.onData((data: string) => {
			buffer += data;

			let index;
			while ((index = buffer.indexOf("\n")) !== -1) {
				const rawLine = buffer.slice(0, index + 1);
				buffer = buffer.slice(index + 1);

				const cleanLine = stripAnsi(rawLine).trim();

				if (!isLogStarted) {
					if (cleanLine.includes(START_TOKEN)) {
						isLogStarted = true;
					}
					continue;
				}

				if (!cleanLine) continue;
				if (cleanLine.includes(START_TOKEN)) continue;
				if (command && cleanLine.includes(command)) continue;
				if (cleanLine.includes("Microsoft Windows")) continue;
				if (cleanLine.endsWith("exit")) continue;
				if (rawLine.includes("]0;") || rawLine.includes("Is a directory"))
					continue;

				outputData += rawLine;
				options?.onOutput?.(rawLine);
				io.to(id).emit(logs, {
					type: "log",
					content: rawLine,
				});
			}
		});

		return new Promise<{ code: number; stdout: string; stderr: string }>(
			(resolve) => {
				ptyProcess.onExit(({ exitCode }) => {
					if (pid) {
						activeProcesses.delete(ptyProcess);
						unregisterProcess(id, pid);
						logger.info(
							`PTY Process (PID: ${pid}) finished with exit code ${exitCode || 0}`,
						);
					}
					resolve({ code: exitCode || 0, stdout: outputData, stderr: "" });
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
	options?: {
		onOutput?: (text: string) => void;
		onProgress?: (progress: number) => void;
	},
): Promise<{ cancelled: boolean; id?: string }> => {
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
			logger.info(
				`Process with id ${id} cancelled - stopping remaining commands`,
			);
			io.to(id).emit("installUpdate", {
				type: "log",
				content: "INFO: Process cancelled - stopping remaining commands\n",
			});
			return { cancelled: true, id };
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
				logger.error(
					`Directory does not exist: ${sanitizePathForLog(newWorkingDir)}`,
				);
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `ERROR: Directory does not exist: ${sanitizePathForLog(newWorkingDir)}\n`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "error",
					content: "Error detected",
				});
				continue;
			}

			currentWorkingDir = newWorkingDir;
			const sanitized = sanitizePathForLog(currentWorkingDir);
			logger.info(`Changed working directory to: ${sanitized}`);
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Changed working directory to: ${sanitized}\n`,
			});

			// remove the cd command
			command = command.replace(cdRegex, "").trim();
			// clean && to avoid errors
			command = command
				.replace(/&&\s*&&/g, "&&")
				.replace(/^&&\s*/, "")
				.replace(/\s*&&$/, "")
				.trim();
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

						const timeProgress = Math.min(
							0.92,
							Math.log(elapsed + 1000) / Math.log(120000),
						);
						const outputProgress = Math.min(0.92, Math.sqrt(outputLines / 50));
						commandProgress = Math.max(
							commandProgress,
							Math.max(timeProgress, outputProgress),
						);

						const overallProgress =
							(completedCommands + commandProgress) / totalCommands;

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

export const getEnhancedEnv = async (needsBuildTools: boolean) => {
	const ENVIRONMENT = getAllValues();

	if (ENVIRONMENT === null) {
		initDefaultEnv();
	}

	// command options with enhanced environment for build tools
	const baseEnv = {
		...ENVIRONMENT,
		// Essential Windows system variables needed for PTY and system tools
		...(process.platform === "win32" && {
			ComSpec: process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe",
			SystemRoot: process.env.SystemRoot || "C:\\Windows",
			SystemDrive: process.env.SystemDrive || "C:",
			windir: process.env.windir || "C:\\Windows",
			USERPROFILE: process.env.USERPROFILE,
			APPDATA: process.env.APPDATA,
			LOCALAPPDATA: process.env.LOCALAPPDATA,
			PROGRAMFILES: process.env.PROGRAMFILES,
			"PROGRAMFILES(X86)": process.env["PROGRAMFILES(X86)"],
			HOMEDRIVE: process.env.HOMEDRIVE,
			HOMEPATH: process.env.HOMEPATH,
		}),
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

	// avoid re-initializing using cache
	const _cacheKey = "__buildToolsEnv";
	const _fnAny = executeCommand as unknown as Record<string, any>;

	const initializeBuildTools = async () => {
		logger.info(`This script requires build tools. Initializing...`);
		const buildTools = BuildToolsManager.getInstance();
		const buildToolsReady = await buildTools.initialize();

		if (!buildToolsReady) {
			logger.warn("Build tools initialization failed. Compilation may fail.");
			return baseEnv;
		}

		logger.info("Build tools ready for native compilation");
		return buildTools.getEnhancedEnvironment(ENVIRONMENT);
	};

	if (needsBuildTools) {
		// initialize once per process and reuse the enhanced env for subsequent commands
		if (!_fnAny[_cacheKey]) {
			_fnAny[_cacheKey] = await initializeBuildTools();
		} else {
			logger.info("Reusing cached build tools environment");
		}
		return _fnAny[_cacheKey];
	} else {
		return baseEnv;
	}
};
