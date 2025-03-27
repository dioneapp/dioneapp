import type { Server } from "socket.io";
import logger from "../utils/logger";
import { spawn } from "node:child_process";
import { platform } from "node:os";
import pidtree from "pidtree";
import path from "node:path";
import fs from "node:fs";

let activeProcess: any = null;
let activePID: number | null = null;

// kill process and its children
const killProcess = async (pid: number, io: Server) => {
	try {
		const currentPlatform = platform();

		if (currentPlatform === "win32") {
			const taskkill = spawn("taskkill", ["/PID", pid.toString(), "/T", "/F"]);
			taskkill.on("close", (code) => {
				if (code === 0) {
					io.emit("installUpdate", {
						type: "log",
						content: "Script killed successfully",
					});
					logger.info("Script killed successfully");
				} else {
					logger.error(`Script exited with code ${code}`);
				}
			});
		} else {
			// macos/linux
			const childPids = await pidtree(pid, { root: true });
			for (const childPid of childPids) {
				process.kill(childPid, "SIGKILL");
			}
			process.kill(pid, "SIGKILL");
		}
		io.emit("installUpdate", {
			type: "log",
			content: "Script killed successfully",
		});
		return true;
	} catch (error) {
		logger.error(`Cant killing process with PID ${pid}: ${error}`);
		return false;
	}
};
// is active process running?
export const stopActiveProcess = async (io: Server) => {
	if (!activeProcess || !activePID) {
		return true;
	}

	logger.warn(`Stopping process ${activePID} and its children`);

	try {
		const killSuccess = await killProcess(activePID, io);

		// wait active process finish
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
// execute command - rewritten from scratch
export const executeCommand = async (
	command: string,
	io: Server,
	workingDir: string,
	logs = "installUpdate",
): Promise<string> => {
	let stdoutData = "";
	let stderrData = "";
	try {
		// if active process exists, kill it
		await stopActiveProcess(io);

		const currentPlatform = platform();
		const isWindows = currentPlatform === "win32";

		// separate command into executable and arguments
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
		io.emit(logs, {
			type: "log",
			content: `Executing: ${command}`,
		});

		// exit
		// activeProcess.stdout.setEncoding("utf8");
		activeProcess.stdout.on("data", (data: Buffer) => {
			const text = data.toString("utf8").trim();
			if (text) {
				stdoutData += `${text}\n`;
				io.emit(logs, { type: "log", content: text });
				logger.info(`[stdout] ${text}`);
			}
		});
		// activeProcess.stderr.setEncoding("utf8");
		activeProcess.stderr.on("data", (data: Buffer) => {
			const text = data.toString("utf8").trim();
			if (text) {
				stderrData += `${text}\n`;
				// for some reason, stderr sometimes contains info messages
				if (text.match(/error|fatal|unexpected/i)) {
					io.emit(logs, { type: "log", content: `ERROR: ${text}` });
					logger.error(`[stderr-error] ${text}`);
					// if error, stop execution
					killProcess(activeProcess, io);
					io.emit("installUpdate", {
						type: "log",
						content: `"${command}": ${text}`,
					});
					io.emit("installUpdate", {
						type: "status",
						status: "error",
						content: "Error detected",
					});
					return;
				}
				if (text.match(/warning|warn|deprecated/i)) {
					io.emit(logs, { type: "log", content: `WARN: ${text}` });
					logger.warn(`[stderr-warn] ${text}`);
				} else {
					io.emit(logs, { type: "log", content: `OUT: ${text}` });
					logger.info(`[stderr-info] ${text}`);
				}
			}
		});

		return new Promise<string>((resolve) => {
			activeProcess.on("exit", (code: number) => {
				// cleanup
				const oldPid = activePID;
				activeProcess = null;
				activePID = null;

				if (code === 0) {
					logger.info(`Process (PID: ${oldPid}) completed successfully`);
					resolve(stdoutData);
				} else {
					const errorMsg = `Process (PID: ${oldPid}) failed with exit code ${code}`;
					logger.error(errorMsg);
					io.emit(logs, {
						type: "status",
						status: "error",
						content: "Error detected",
					});
					io.emit("installUpdate", {
						type: "log",
						content: `ERROR: ${errorMsg}`,
					});
					logger.error(errorMsg);
					resolve(`ERROR: ${errorMsg}\n${stderrData}`);
				}
			});

			activeProcess.on("error", (error) => {
				const errorMsg = `Failed to start command: ${error.message}`;
				logger.error(errorMsg);
				io.emit(logs, {
					type: "log",
					content: `ERROR: ${errorMsg}`,
				});
				io.emit(logs, {
					type: "status",
					status: "error",
					content: "Failed to start process",
				});

				// cleanup
				activeProcess = null;
				activePID = null;
				logger.error(errorMsg);
				resolve(`ERROR: ${errorMsg}`);
			});
		});
	} catch (error: any) {
		const errorMsg = `Exception executing command: ${error.message}`;
		logger.error(errorMsg);
		io.emit(logs, {
			type: "status",
			status: "error",
			content: "Error detected",
		});
		io.emit(logs, {
			type: "log",
			content: `ERROR: ${errorMsg}`,
		});

		return `ERROR: ${errorMsg}`;
	}
};
// execute various commands
export const executeCommands = async (
	commands: string[],
	workingDir: string,
	io: Server,
) => {
	let currentWorkingDir = workingDir;

	for (const command of commands) {
		// is cd command?
		if (command.trim().startsWith("cd ")) {
			const targetDir = command.trim().substring(3).trim();
			currentWorkingDir = path.join(currentWorkingDir, targetDir);
			if (!fs.existsSync(currentWorkingDir)) {
				logger.error(`Directory does not exist: ${currentWorkingDir}`);
				io.emit("installUpdate", {
					type: "log",
					content: `ERROR: Directory does not exist: ${currentWorkingDir}`,
				});
				io.emit("installUpdate", {
					type: "status",
					status: "error",
					content: "Error detected",
				});
			}

			logger.info(`Changed working directory to: ${currentWorkingDir}`);
			io.emit("installUpdate", {
				type: "log",
				content: `INFO: Changed working directory to: ${currentWorkingDir}`,
			});
		} else {
			// execute command
			const reponse = await executeCommand(command, io, currentWorkingDir);
			if (reponse.toLowerCase().includes("error")) {
				throw new Error(reponse);
			}
		}
	}
};
