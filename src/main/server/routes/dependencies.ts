import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import express from "express";
import os from "node:os";
import logger from "../utils/logger";
import acceptedDependencies from "../scripts/acceptedDependencies.json";
import type { Server } from "socket.io";

export const createDependenciesRouter = (io: Server) => {
	const execPromise = promisify(exec);
	const router = express.Router();
	router.use(express.json());

	router.get("/check", async (req, res) => {
		try {
			const dependencies = req.headers.dependencies;
			logger.info(`Checking dependencies: ${dependencies.join(", ")}`);
			const response = await checkDependencies(dependencies);
			res.send(response).status(200);
			logger.info(`Dependencies status: ${JSON.stringify(response)}`);
		} catch (error) {
			res.status(400).send({ error: "Failed to check dependencies" });
		}
	});

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

		const executeCommand = (command: string, name: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				let installProcess;
				const osType = getOS();

				if (osType === "windows") {
					installProcess = spawn(
						"powershell",
						["-ExecutionPolicy", "ByPass", "-Command", command],
						{ stdio: ["inherit", "pipe", "pipe"] },
					);
				} else {
					installProcess = spawn("sh", ["-c", command], {
						stdio: ["inherit", "pipe", "pipe"],
					});
				}

				installProcess.stdout.on("data", (data) => {
					const message = data.toString();
					logger.info(`${message}`);
					io.emit("installDep", { name, output: message });
				});

				installProcess.stderr.on("data", (data) => {
					const errorMessage = data.toString();
					console.error(`[ERROR] ${errorMessage}`);
					io.emit("installDep", { name, error: errorMessage });
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

				await executeCommand(installCommand, dep);
			}

			res.end("\nInstallation completed successfully.\n");
			io.emit("installDep", {
				name: "all",
				output: "🎉 Installation completed successfully!",
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

	async function checkDependencies(dependencies: string[]) {
		const isWindows = os.platform() === "win32";
		const checkCommand = isWindows ? "where" : "which";

		const results = await Promise.all(
			dependencies.map(async (dep) => {
				try {
					await execPromise(`${checkCommand} ${dep}`);
					return { name: dep, installed: true };
				} catch {
					return { name: dep, installed: false };
				}
			}),
		);

		const allInstalled = results.every((dep) => dep.installed);

		return {
			success: allInstalled,
			dependencies: results,
		};
	}

	return router;
};
