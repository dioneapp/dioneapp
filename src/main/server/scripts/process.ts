import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import { arch, platform as getPlatform, platform } from "node:os";
import path from "node:path";
import {
	getAllValues,
	initDefaultEnv,
} from "@/server/scripts/dependencies/environment";
import BuildToolsManager from "@/server/scripts/dependencies/utils/build-tools-manager";
import logger from "@/server/utils/logger";
import { useGit } from "@/server/utils/useGit";
import pidtree from "pidtree";
import type { Server } from "socket.io";

import pty from "@homebridge/node-pty-prebuilt-multiarch";

const activeProcesses = new Set<any>();
const activePIDs = new Set<number>();
const ptyProcesses = new Set<any>();
let processWasCancelled = false;

// kill process and its children
// currently, this function is only used during the installation of dependencies,
// as this is a process that must be controlled.
// it will not work if used in processes that generate non-child threads.
// in such cases, it is recommended to use the killByPort (l-53) function.
export const killProcess = async (pid: number, io: Server, id: string) => {
	try {
		processWasCancelled = true;
		ptyProcesses.forEach((ptyProcess) => {
			if (ptyProcess.pid === pid) {
				logger.info(`Killing PTY process ${pid}`);
				ptyProcess.kill();
			}
		});
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
			"No valid port provided for killByPort. Attempting to kill active processes...",
		);
		if (activePIDs.size > 0) {
			const results = await Promise.all(
				Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
			);
			return results.every(Boolean);
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

					if (activePIDs.size === 0) {
						return resolve(true); // no active process to stop
					}
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No port active found, stopping active processes...\n`,
					});
					const results = await Promise.all(
						Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
					);
					return resolve(results.every(Boolean));
				}
				const pids = stdout.split(/\r?\n/).filter(Boolean).map(Number);
				if (pids.length === 0) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `No processes found on port ${port}\n`,
					});
					if (activePIDs.size === 0) {
						return resolve(true); // no active process to stop
					}
					const results = await Promise.all(
						Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
					);
					return resolve(results.every(Boolean));
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
					if (activePIDs.size > 0) {
						await Promise.all(
							Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
						);
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
				if (activePIDs.size === 0) {
					return resolve(true); // no active process to stop
				}
				logger.info(
					`Killing active processes with PIDs ${Array.from(activePIDs).join(", ")}`,
				);
				const results = await Promise.all(
					Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
				);
				return resolve(results.every(Boolean));
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
				if (activePIDs.size > 0) {
					await Promise.all(
						Array.from(activePIDs).map((pid) => killProcess(pid, io, id)),
					);
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
	activeProcesses.clear();
	activePIDs.clear();
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

		const processInstance = spawn(command, spawnOptions);
		const pid = processInstance.pid;

		if (pid) {
			activeProcesses.add(processInstance);
			activePIDs.add(pid);
			logger.info(`Started process (PID: ${pid}): ${command}`);
		}

		logger.info(`Executing: ${command}`);

		processInstance.stdout.on("data", (data: Buffer) => {
			const text = data.toString("utf8");
			if (text) {
				stdoutData += text;
				io.to(id).emit(logs, { type: "log", content: text });
				options?.onOutput?.(text);
				logger.info(`[stdout] ${text}`);
			}
		});
		processInstance.stderr.on("data", (data: Buffer) => {
			const text = data.toString("utf8");
			if (text) {
				stderrData += text;
				if (text.match(/error|fatal|unexpected/i)) {
					io.to(id).emit(logs, { type: "log", content: text });
					// logger.error(`[stderr-error] ${text}`);
					// killProcess(processInstance, io, id);
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
				processInstance.on("exit", (code: number) => {
					if (pid) {
						activeProcesses.delete(processInstance);
						activePIDs.delete(pid);
						logger.info(
							`Process (PID: ${pid}) finished with exit code ${code}`,
						);
					}
					resolve({ code, stdout: stdoutData, stderr: stderrData });
				});

				processInstance.on("error", (error) => {
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
					if (pid) {
						activeProcesses.delete(processInstance);
						activePIDs.delete(pid);
					}
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

export const getEnhancedEnv = async (needsBuildTools: boolean) => {
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
): Promise<{ cancelled: boolean; id?: string; error?: string }> => {
	const enhancedEnv = await getEnhancedEnv(needsBuildTools || false);
	const shell = platform() === "win32" ? "cmd.exe" : "bash";
	const args = platform() === "win32" ? ["/Q"] : [];
	const terminal = pty.spawn(shell, args, {
		name: "dione-terminal",
		cols: 80,
		rows: 30,
		cwd: workingDir,
		env: enhancedEnv,
	});

	ptyProcesses.add(terminal);
	activePIDs.add(terminal.pid);
	io.to(id).emit("installUpdate", {
		type: "log",
		content: `Started process with id ${terminal.pid}\n`,
	});

	let stdoutBuffer = "";

	return new Promise((resolve) => {
		terminal.onData((data: string) => {
			let content = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

			if (platform() === "win32") {
				// filter windows cmd stuff
				content = content
					.replace(/Microsoft Windows \[[\s\S]*?\](\s|:.*?)*\n?/g, "")
					.replace(/\(c\) Microsoft Corporation[\s\S]*?erved\.\s*/g, "")
					.replace(/\(c\) Microsoft Corporation[\s\S]*?ados\.\s*/g, "")
					.replace(/:\\[\w\\]+\\cmd\.exe/g, "");
			}

			io.to(id).emit("installUpdate", {
				type: "log",
				content: content,
			});

			stdoutBuffer += content;

			let index;
			while ((index = stdoutBuffer.indexOf("\n")) !== -1) {
				const line = stdoutBuffer.slice(0, index);
				stdoutBuffer = stdoutBuffer.slice(index + 1);
				if (options?.onOutput) {
					options.onOutput(line);
				}
				logger.info(`[stdout] ${line}`);
			}
		});

		terminal.onExit(({ exitCode }) => {
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `Process exited with code ${exitCode}\n`,
			});
			logger.info(`Process exited with code ${exitCode}`);
			ptyProcesses.delete(terminal);
			activePIDs.delete(terminal.pid);

			if (exitCode !== 0 && !processWasCancelled) {
				resolve({ cancelled: false, id, error: `Exit code ${exitCode}` });
			} else {
				resolve({ cancelled: processWasCancelled, id });
			}
		});

		const send = (cmd: string) => {
			terminal.write(cmd + (platform() === "win32" ? "\r\n" : "\n"));
			logger.info(`[stdin] ${cmd}`);
		};

		if (platform() === "win32") {
			send("@echo off");
			send("cls");
		}

		// send cmds
		for (const cmd of commands) {
			const cdRegex = /\bcd\s+([^\s;]+)/;
			const cdMatch = cmd.match(cdRegex);

			if (cdMatch) {
				const newDir = cdMatch[1];
				send(`cd "${newDir}"`);
				logger.info(`Changed directory to ${newDir}`);
				continue;
			}

			send(cmd);
		}

		// close shell when cmds are done
		send("exit");
	});
};
