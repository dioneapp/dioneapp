import { spawn } from "node:child_process";
import fs from "node:fs";
import { platform as getPlatform } from "node:os";
import path from "node:path";
import pidtree from "pidtree";
import type { Server } from "socket.io";
import logger from "../utils/logger";

let activeProcess: any = null;
let activePID: number | null = null;

// kill process and its children
export const killProcess = async (pid: number, io: Server, id: string) => {
	try {
		const currentPlatform = getPlatform();
		if (currentPlatform === "win32") {
			const taskkill = spawn("taskkill", ["/PID", pid.toString(), "/T", "/F"]);
			taskkill.on("close", (code) => {
				if (code === 0) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: "Script killed successfully",
					});
					logger.info("Script killed successfully");
				} else {
					logger.error(`Script exited with code ${code}`);
				}
			});
		} else {
			// macos / linux
			const childPids = await pidtree(pid, { root: true });
			for (const childPid of childPids) {
				process.kill(childPid, "SIGKILL");
			}
			process.kill(pid, "SIGKILL");
		}
		io.to(id).emit("installUpdate", {
			type: "log",
			content: "Script killed successfully",
		});
		logger.info("Script killed successfully");
		return true;
	} catch (error) {
		logger.error(`Can't kill process with PID ${pid}: ${error}`);
		return false;
	}
};

// is active process running?
export const stopActiveProcess = async (io: Server, id: string) => {
	if (!activeProcess || !activePID) {
		return true;
	}

	logger.warn(`Stopping process ${activePID} and its children`);

	try {
		const killSuccess = await killProcess(activePID, io, id);

		// ait active process finish
		await Promise.race([
			new Promise((resolve, reject) => {
				activeProcess.on("exit", resolve);
				activeProcess.on("error", reject);
			}),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Process kill timeout")), 3000),
			),
		]);

		return killSuccess;
	} catch (error) {
		logger.error(`Error stopping process: ${error}`);
		return false;
	} finally {
		activeProcess = null;
		activePID = null;
	}
};

// execute command
export const executeCommand = async (
	command: string,
	io: Server,
	workingDir: string,
	id: string,
	logsType?: string,
): Promise<{ code: number; stdout: string; stderr: string }> => {
	let stdoutData = "";
	let stderrData = "";
	const logs = logsType || "installUpdate";
	try {
		// // if active process exists, kill it (disabled for multiple apps)
		// await stopActiveProcess(io, id);

		const currentPlatform = getPlatform();
		const isWindows = currentPlatform === "win32";

		// split command into executable and arguments
		const [executable, ...args] = command.split(/\s+/);

		// command options
		const spawnOptions = {
			cwd: workingDir,
			shell: isWindows,
			windowsHide: true,
			detached: false,
			env: {
				...process.env,
				PYTHONUNBUFFERED: "1",
				NODE_NO_BUFFERING: "1",
				FORCE_UNBUFFERED_OUTPUT: "1",
				PYTHONIOENCODING: "UTF-8",
				FORCE_COLOR: "1",
			},
		};

		// handle bat files
		if (
			isWindows &&
			(executable.endsWith(".bat") || executable.endsWith(".cmd"))
		) {
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

		activePID = activeProcess.pid;
		logger.info(`Started process (PID: ${activePID}): ${command}`);
		io.to(id).emit(logs, {
			type: "log",
			content: `Executing: ${command}`,
		});

		activeProcess.stdout.on("data", (data: Buffer) => {
			const text = data.toString("utf8").trim();
			if (text) {
				stdoutData += `${text}\n`;
				io.to(id).emit(logs, { type: "log", content: text });
				logger.info(`[stdout] ${text}`);
			}
		});
		activeProcess.stderr.on("data", (data: Buffer) => {
			const text = data.toString("utf8").trim();
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
) => {
	let currentWorkingDir = workingDir;
	const currentPlatform = getPlatform(); // "win32", "linux", "darwin"

	for (const cmd of commands) {
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

		// handle cd command
		if (command.startsWith("cd ")) {
			const targetDir = command.slice(3).trim();
			currentWorkingDir = path.join(currentWorkingDir, targetDir);
			if (!fs.existsSync(currentWorkingDir)) {
				logger.error(`Directory does not exist: ${currentWorkingDir}`);
				io.to(id).emit("installUpdate", {
					type: "log",
					content: `ERROR: Directory does not exist: ${currentWorkingDir}`,
				});
				io.to(id).emit("installUpdate", {
					type: "status",
					status: "error",
					content: "Error detected",
				});
				continue;
			}
			logger.info(`Changed working directory to: ${currentWorkingDir}`);
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `INFO: Changed working directory to: ${currentWorkingDir}`,
			});
		} else {
			const response = await executeCommand(command, io, currentWorkingDir, id);
			if (response.stderr) {
				throw new Error(response.stderr);
			}
		}
	}
};
