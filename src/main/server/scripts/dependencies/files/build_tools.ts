import { execFile, execSync, spawn } from "child_process";
import fs from "fs";
import * as fsRemove from "fs/promises";

import https from "https";
import path from "path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import { addValue, getAllValues, removeValue } from "../environment";
import { getArch, getOS } from "../utils/system";

const depName = "build_tools";
const ENVIRONMENT = getAllValues();

export async function isInstalled(
	binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
	const depFolder = path.join(binFolder, depName);
	const ENVIRONMENT = getAllValues();

	if (!fs.existsSync(depFolder) || fs.readdirSync(depFolder).length === 0) {
		return { installed: false, reason: `not-installed` };
	}

	try {
		await new Promise<string>((resolve, reject) => {
			execFile(
				"msbuild",
				["-version"],
				{ env: ENVIRONMENT },
				(error, stdout) => {
					if (error) {
						reject(error);
					} else {
						resolve(stdout);
					}
				},
			);
		});
		return { installed: true, reason: `installed` };
	} catch (error: any) {
		return { installed: false, reason: `error` };
	}
}

export async function install(
	binFolder: string,
	id: string,
	io: Server,
): Promise<{ success: boolean }> {
	const depFolder = path.join(binFolder, depName);
	const tempDir = path.join(binFolder, "temp");

	const platform = getOS(); // window, linux, macos
	const arch = getArch(); // amd64, arm64, x86

	if (!fs.existsSync(depFolder)) {
		fs.mkdirSync(depFolder, { recursive: true });
	}

	const urls: Record<string, Record<string, string>> = {
		windows: {
			amd64: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
			arm64: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
			x86: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
		},
	};

	const url = urls[platform]?.[arch];
	if (!fs.existsSync(tempDir)) {
		// if temp dir does not exist, create it
		fs.mkdirSync(tempDir, { recursive: true });
	}
	const installerFile = fs.createWriteStream(
		path.join(tempDir, `build_tools.exe`),
	);

	if (url) {
		// 1. url method: install the dependency using official installer url
		io.to(id).emit("installDep", {
			type: "log",
			content: `Downloading ${depName} for ${platform} (${arch}) using URL method...`,
		});

		const options = {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			},
		};

		await new Promise<void>((resolve, reject) => {
			https
				.get(url, options, (response) => {
					if ([301, 302].includes(response.statusCode ?? 0)) {
						const redirectUrl = response.headers.location;
						if (redirectUrl) {
							https
								.get(redirectUrl, (redirectResponse) => {
									redirectResponse.pipe(installerFile);
									installerFile.on("close", resolve);
									installerFile.on("error", reject);
								})
								.on("error", reject);
						} else {
							reject(new Error("Redirect URL not found"));
						}
					} else if (response.statusCode === 200) {
						io.to(id).emit("installDep", {
							type: "log",
							content: `${depName} installer downloaded successfully`,
						});
						response.pipe(installerFile);
						installerFile.on("close", resolve);
						installerFile.on("error", reject);
					} else {
						reject(new Error(`HTTP ${response.statusCode}`));
					}
				})
				.on("error", reject);
		});
	} else {
		io.to(id).emit("installDep", {
			type: "error",
			content: `No download URL found for ${depName} on ${platform} (${arch})`,
		});

		return { success: false };
	}

	io.to(id).emit("installDep", {
		type: "log",
		content: `Running installer for ${depName}...`,
	});

	const exe = path.join(tempDir, `build_tools.exe`);
	const commands: Record<string, { file: string; args: string[] }> = {
		windows: {
			file: exe,
			args: [
				`--installPath ${depFolder}`,
				"--quiet",
				"--wait",
				"--norestart",
				"--includeRecommended",
				"--nocache",
			],
		},
	};

	// 2. run the installer/ command line method
	const command = commands[platform];
	if (!command) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Unsupported platform: ${platform}`,
		});
		return { success: false };
	}

	io.to(id).emit("installDep", {
		type: "log",
		content: `Running command: ${command.file} ${command.args.join(" ")}`,
	});

	const spawnOptions = {
		cwd: depFolder,
		shell: platform === "windows",
		windowsHide: true,
		detached: false,
		env: {
			...ENVIRONMENT,
			PYTHONUNBUFFERED: "1",
			NODE_NO_BUFFERING: "1",
			FORCE_UNBUFFERED_OUTPUT: "1",
			PYTHONIOENCODING: "UTF-8",
		},
	};

	try {
		await new Promise<void>((resolve, reject) => {
			const child = spawn(command.file, command.args, spawnOptions);

			child.stdout.on("data", (data) => {
				io.to(id).emit("installDep", { type: "log", content: data.toString() });
			});

			child.stderr.on("data", (data) => {
				io.to(id).emit("installDep", {
					type: "error",
					content: data.toString(),
				});
				logger.error(
					`Error during installation of ${depName}: ${data.toString()}`,
				);
			});

			child.on("close", (code) => {
				console.log(`Installer exited with code ${code}`);
				if (code === 0) {
					io.to(id).emit("installDep", {
						type: "log",
						content: `${depName} installed successfully`,
					});

					// update environment variables
					addValue("PATH", path.join(depFolder, "MSBuild", "Current", "Bin"));

					resolve();
				} else {
					reject(new Error(`Installer exited with code ${code}`));
				}
			});
		});
	} catch (error) {
		logger.error(`Error running installer for ${depName}:`, error);
		io.to(id).emit("installDep", {
			type: "error",
			content: `Error running installer for ${depName}: ${error}`,
		});
		return { success: false };
	}

	return { success: true };
}

export async function uninstall(binFolder: string): Promise<void> {
	const depFolder = path.join(binFolder, depName);

	if (fs.existsSync(depFolder)) {
		logger.info(`Removing ${depName} folder in ${depFolder}...`);
		try {
			await new Promise<void>((resolve, reject) => {
				const child = spawn("powershell", [
					"-Command",
					`Start-Process -FilePath "C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vs_installer.exe" -ArgumentList "uninstall","--installPath","${depFolder}","--quiet","--nocache" -Verb RunAs -Wait`,
				]);

				child.stdout.on("data", (data) => {
					logger.info(data.toString());
				});

				child.stderr.on("data", (data) => {
					logger.error(`Error during uninstallation: ${data.toString()}`);
				});

				child.on("close", (code) => {
					console.log(`Installer exited with code ${code}`);
					if (code === 0) {
						resolve();
					} else {
						reject(new Error(`Installer exited with code ${code}`));
					}
				});
			});
		} catch (error) {
			logger.error(`Error running installer for ${depName}:`, error);
		}
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(path.join(depFolder, "MSBuild", "Current", "Bin"), "PATH");

		logger.info(`${depName} uninstalled successfully`);
	} else {
		throw new Error(`Dependency ${depName} is not installed`);
	}
}
