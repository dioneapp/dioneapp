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
import type { Server } from "socket.io";
import { useGit } from "../utils/use-git";

export const log = (io: Server, id: string, content: string, type?: string) => {
	if (!type) {
		type = "installUpdate";
	}
	io.to(id).emit(type, {
		type: "log",
		content: `${content}\r\n`,
	});
};

const activeProcesses = new Set<any>();
const activePIDs = new Set<number>();
const processesByApp = new Map<string, Set<number>>();
const processesDimensions = new Map<string, { cols: number; rows: number }>();

export const resizeTerminal = (id: string, cols: number, rows: number) => {
	processesDimensions.set(id, { cols, rows });
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

	const dims = processesDimensions.get(appId);
	if (dims) {
		activeProcesses.forEach((proc) => {
			if (proc?.pid === pid && typeof proc.resize === "function") {
				try {
					proc.resize(dims.cols, dims.rows);
				} catch (e) {
					logger.warn(`Failed to resize process ${pid} on register: ${e}`);
				}
			}
		});
	}
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
		activeProcesses.forEach((proc) => {
			if (proc?.pid === pid) {
				try {
					proc.write("\x03");
					setTimeout(() => proc.kill(), 50);
				} catch (e) {
					logger.warn(`Failed to kill process ${pid}: ${e}`);
				}
				activeProcesses.delete(proc);
			}
		});
		unregisterProcess(id!, pid);
	} else if (id) {
		const pids = processesByApp.get(id);
		logger.info(`Process managed by ${id}: ${pids}`);
		if (!pids || pids.size === 0) return;
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

export const stopActiveProcess = async (
	io: Server,
	id: string,
	pid?: number,
) => {
	processWasCancelled = true;

	if (pid) {
		log(io, id, `Killing process with id ${pid}`);
		logger.info(`Killing process with id ${pid}`);
	} else {
		log(io, id, `Killing all processes for app ${id}`);
		logger.info(`Killing all processes for app ${id}`);
	}

	await dropProcesses(id, pid);
	return true;
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

	try {
		const currentPlatform = getPlatform();
		const isWindows = currentPlatform === "win32";
		const dims = processesDimensions.get(id) ?? { cols: 120, rows: 40 };

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
			cols: dims.cols,
			rows: dims.rows,
			cwd: workingDir,
			env: enhancedEnv as Record<string, string>,
		});

		const pid = ptyProcess.pid;

		if (isWindows) {
			ptyProcess.write(
				`@echo off\r\nchcp 65001 >nul\r\necho ${START_TOKEN}\r\n${command}\r\nexit %ERRORLEVEL%\r\n`,
			);
		} else {
			ptyProcess.write(`echo "${START_TOKEN}"; ${command}; exit $?\n`);
		}

		logger.info(
			`Executing: ${command.length > 300 ? command.substring(0, 300) + "..." : command}`,
		);

		if (pid) {
			activeProcesses.add(ptyProcess);
			registerProcess(id, pid);
		}

		const cleanTerminal = (data: string): string => {
			let cleaned = data;
			cleaned = cleaned.replace(/\x1B\][^\x07]*\x07/g, "");
			cleaned = cleaned.replace(
				/\x1B\[2J|\x1B\[H|\x1B\?25[hl]|\x1B\?9001[hl]|\x1B\?1004[hl]/g,
				"",
			);
			cleaned = cleaned.replace(/[\r\n]{4,}/g, "");

			return cleaned;
		};

		ptyProcess.onData((data: string) => {
			if (data.includes(START_TOKEN)) return;
			if (data.includes("Microsoft Windows")) return;
			if (data.includes("exit")) return;
			if (data.includes("echo")) return;
			if (data.includes("chcp")) return;

			const cleanData = cleanTerminal(data);

			outputData += cleanData;
			options?.onOutput?.(cleanData);
			io.to(id).emit(logs, {
				type: "log",
				content: cleanData,
			});
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
					if (exitCode !== 0) {
						io.to(id).emit(logs, {
							type: "status",
							status: "error",
							content: "Error detected",
						});
						log(
							io,
							id,
							`ERROR: Process finished with exit code ${exitCode || 0}, please try again.`,
						);
						resolve({ code: exitCode || 0, stdout: outputData, stderr: "" });
					} else {
						io.to(id).emit(logs, {
							type: "status",
							status: "success",
							content: "Process finished successfully",
						});
						resolve({ code: exitCode || 0, stdout: outputData, stderr: "" });
					}
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
	processWasCancelled = false;
	let currentWorkingDir = workingDir;
	const currentPlatform = getPlatform();
	const { gpu: currentGpu } = await getSystemInfo();

	const totalCommands = commands.length;
	let completedCommands = 0;

	for (const cmd of commands) {
		if (processWasCancelled) {
			logger.info(
				`Process with id ${id} cancelled - stopping remaining commands`,
			);
			log(
				io,
				id,
				`INFO: Process with id ${id} cancelled - stopping remaining commands`,
			);
			return { cancelled: true, id };
		}

		let command: string;

		if (typeof cmd === "string") {
			command = cmd;
		} else if (typeof cmd === "object" && cmd !== null) {
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

				if (cmdPlatform !== normalizedPlatform) {
					logger.info(
						`Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}`,
					);
					log(
						io,
						id,
						`INFO: Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}`,
					);
					continue;
				}
			}

			if ("gpus" in cmd) {
				const allowedGpus = Array.isArray(cmd.gpus)
					? cmd.gpus.map((g: string) => g.toLowerCase())
					: [cmd.gpus.toLowerCase()];

				if (!allowedGpus.includes(currentGpu.toLowerCase())) {
					logger.info(
						`Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
					);
					log(
						io,
						id,
						`INFO: Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
					);
					continue;
				}
			}

			if ("command" in cmd) {
				command = cmd.command;
			} else {
				logger.error(`Invalid command object: ${JSON.stringify(cmd)}`);
				log(io, id, `ERROR: Invalid command object: ${JSON.stringify(cmd)}`);
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
				log(
					io,
					id,
					`ERROR: Directory does not exist: ${sanitizePathForLog(newWorkingDir)}`,
				);
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
			log(io, id, `INFO: Changed working directory to: ${sanitized}`);

			command = command.replace(cdRegex, "").trim();
			command = command
				.replace(/&&\s*&&/g, "&&")
				.replace(/^&&\s*/, "")
				.replace(/\s*&&$/, "")
				.trim();
		}

		if (command.length > 0) {
			let commandProgress = 0;
			let outputLines = 0;
			const startTime = Date.now();
			let lastProgressEmit = 0;
			let installingPackages = 0;
			let totalPackages = 0;

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

						const pipInstallMatch = text.match(/Collecting\s+(\S+)/i);
						const pipInstalledMatch = text.match(
							/Successfully\s+installed\s+(.+)/i,
						);
						const uvInstalledMatch = text.match(/Installed\s+(\d+)\s+package/i);
						const uvResolvingMatch = text.match(/Resolved\s+(\d+)\s+package/i);

						if (pipInstallMatch) {
							totalPackages++;
						}
						if (pipInstalledMatch) {
							const packages = pipInstalledMatch[1]
								.split(/\s+/)
								.filter((p) => p.trim());
							installingPackages = packages.length;
						}
						if (uvInstalledMatch) {
							installingPackages = Number.parseInt(uvInstalledMatch[1]);
						}
						if (uvResolvingMatch) {
							totalPackages = Number.parseInt(uvResolvingMatch[1]);
						}

						let packageProgress = 0;
						if (totalPackages > 0 && installingPackages > 0) {
							packageProgress = Math.min(
								0.95,
								installingPackages / totalPackages,
							);
						}

						const timeProgress = Math.min(
							0.85,
							Math.log(elapsed + 1000) / Math.log(300000),
						);

						const outputProgress = Math.min(0.85, Math.sqrt(outputLines / 100));

						if (packageProgress > 0) {
							commandProgress = Math.max(commandProgress, packageProgress);
						} else {
							commandProgress = Math.max(
								commandProgress,
								Math.max(timeProgress, outputProgress),
							);
						}

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
					log(io, id, "INFO: Process was manually cancelled");
					return { cancelled: true };
				}
				await dropProcesses(id);
				processWasCancelled = true;
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

	const baseEnv = {
		...ENVIRONMENT,
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
		GRADIO_SERVER_NAME: "0.0.0.0",
		...(process.platform === "win32" && {
			PROCESSOR_ARCHITECTURE:
				process.env.PROCESSOR_ARCHITECTURE ||
				(arch() === "x64" ? "AMD64" : arch() === "ia32" ? "x86" : "AMD64"),
			PROCESSOR_ARCHITEW6432: process.env.PROCESSOR_ARCHITEW6432 || "AMD64",
		}),
		CUDA_HOME:
			process.env.CUDA_HOME ||
			(() => {
				if (process.platform === "win32") {
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
				return undefined;
			})(),
		DS_BUILD_OPS: "0",
		DS_SKIP_CUDA_CHECK: "1",
	};

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
