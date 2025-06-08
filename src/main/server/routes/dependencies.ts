import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import type { Server } from "socket.io";
import { readConfig } from "../../config";
import acceptedDependencies from "../scripts/acceptedDependencies.json";
import {
	inUseDependencies,
	uninstallDependency,
} from "../scripts/dependencies";
import { killProcess } from "../scripts/process";
import logger from "../utils/logger";

export const createDependenciesRouter = (io: Server) => {
	const router = express.Router();
	router.use(express.json());

	// router.get("/check", async (req, res) => {
	// 	try {
	// 		const dependencies = req.headers.dependencies;
	// 		logger.info(`Checking dependencies: ${dependencies.join(", ")}`);
	// 		const response = await checkDependencies(dependencies);
	// 		res.send(response).status(200);
	// 		logger.info(`Dependencies status: ${JSON.stringify(response)}`);
	// 	} catch (error) {
	// 		res.status(400).send({ error: "Failed to check dependencies" });
	// 	}
	// });

	router.post("/install", async (req, res) => {
		const getOS = (): "windows" | "macos" | "linux" | null => {
			switch (process.platform) {
				case "win32":
					return "windows";
				case "darwin":
					return "macos";
				case "linux":
					return "linux";
				default:
					return null;
			}
		};

		const executeCommand = (
			command: string,
			name: string,
			workingDir: string,
		): Promise<void> => {
			return new Promise((resolve, reject) => {
				// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
				let installProcess;
				let stdoutData = "";
				let stderrData = "";
				const osType = getOS();
				// command options
				const spawnOptions = {
					cwd: workingDir,
					shell: osType === "windows",
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

				if (osType === "windows") {
					installProcess = spawn("cmd.exe", ["/S", "/C", command], {
						...spawnOptions,
						stdio: ["pipe", "pipe", "pipe"],
					});
				} else {
					installProcess = spawn("sh", ["-c", "-s", command], {
						...spawnOptions,
						stdio: ["pipe", "pipe", "pipe"],
					});
				}

				installProcess.stdout.on("data", (data: Buffer) => {
					const text = data.toString("utf8").trim();
					if (text) {
						stdoutData += `${text}\n`;
						io.emit("installDep", { name, output: text });
						logger.info(`[stdout] ${text}`);
					}
				});
				installProcess.stderr.on("data", (data: Buffer) => {
					const text = data.toString("utf8").trim();
					if (text) {
						stderrData += `${text}\n`;
						if (text.match(/error|fatal|unexpected/i)) {
							io.emit("installDep", { name, error: text });
							logger.error(`[stderr-error] ${text}`);
							killProcess(installProcess, io);
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
							io.emit("installDep", { name, output: `WARN: ${text}` });
							logger.warn(`[stderr-warn] ${text}`);
						} else {
							io.emit("installDep", { name, output: `OUT: ${text}` });
							logger.info(`[stderr-info] ${text}`);
						}
					}
				});

				installProcess.on("close", (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(`Installation failed with exit code ${code}`);
					}
				});
			});
		};

		try {
			const dependencies = Array.isArray(req.body?.dependencies)
				? req.body.dependencies
				: [];
			if (!dependencies) {
				return res
					.status(400)
					.send({ error: "Dependencies to install not provided" });
			}
			const nameFolder = req.body?.nameFolder;
			if (!nameFolder) {
				return res.status(400).send({ error: "Name folder not provided" });
			}
			const root = process.cwd();
			const config = readConfig();
			const workingDir = path.join(
				config?.defaultInstallFolder || root,
				"apps",
				nameFolder,
			);

			const osType = getOS();
			if (!osType) {
				return res.status(400).send({ error: "Unsupported OS" });
			}

			res.setHeader("Content-Type", "text/plain");
			res.setHeader("Transfer-Encoding", "chunked");

			for (const dep of dependencies) {
				if (typeof dep !== "string") {
					console.error(`❌ Invalid dependency format: ${JSON.stringify(dep)}`);
					io.emit("installDep", {
						name: "unknown",
						output: `❌ Invalid dependency format: ${JSON.stringify(dep)}`,
					});
					continue;
				}

				const installCommand =
					acceptedDependencies[dep]?.installCommand?.[osType];
				if (!installCommand) {
					res.write(`No installation command found for ${dep}\n`);
					io.emit("installDep", {
						name: dep,
						output: `❌ No installation command found for ${dep}`,
					});
				}

				await executeCommand(installCommand, dep, workingDir);
			}

			fs.rm(workingDir, { recursive: true }, (err) => {
				if (err) {
					console.error(`Error deleting directory: ${err}`);
					io.emit("installUpdate", {
						type: "log",
						content: `Error deleting directory: ${err}`,
					});
					io.emit("installUpdate", {
						type: "status",
						status: "error",
						content: "Error detected",
					});
				}
				res.end("\nInstallation completed successfully.\n");
				io.emit("installDep", {
					name: "all",
					output: "🎉 Installation completed successfully!",
				});
			});
		} catch (error) {
			console.error("Server error:", error);
			res.write(`❌ Server error: ${(error as Error).message}\n`);
			io.emit("installDep", {
				name: "all",
				output: `❌ Server error: ${(error as Error).message}`,
			});
			res.end();
		}
	});

	// async function checkDependencies(dependencies: string[]) {
	// 	const isWindows = os.platform() === "win32";
	// 	const checkCommand = isWindows ? "where" : "which";

	// 	const results = await Promise.all(
	// 		dependencies.map(async (dep) => {
	// 			try {
	// 				await execPromise(`${checkCommand} ${dep}`);
	// 				return { name: dep, installed: true };
	// 			} catch {
	// 				return { name: dep, installed: false };
	// 			}
	// 		}),
	// 	);

	// 	const allInstalled = results.every((dep) => dep.installed);

	// 	return {
	// 		success: allInstalled,
	// 		dependencies: results,
	// 	};
	// }

	router.post("/uninstall", async (req, res) => {
		const root = process.cwd();
		const sanitizedName = req.body.dioneFile.replace(/\s+/g, "-");
		const settings = readConfig();
		const dioneFile = `${path.join(settings?.defaultInstallFolder || root, "apps", sanitizedName, "dione.json")}`;
		const result = await uninstallDependency(dioneFile, io);
		if (result.success) {
			res.json({ success: true });
		} else {
			res.json({ success: false, reasons: result.reasons });
		}
	});

	router.post("/in-use", async (req, res) => {
		const root = process.cwd();
		const sanitizedName = req.body.dioneFile.replace(/\s+/g, "-");
		const settings = readConfig();
		const dioneFile = `${path.join(settings?.defaultInstallFolder || root, "apps", sanitizedName, "dione.json")}`;
		const result = await inUseDependencies(dioneFile);
		res.json({ result: result });
	});

	return router;
};
