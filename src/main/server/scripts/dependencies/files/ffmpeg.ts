import { execFile, spawn } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";
import {
	addValue,
	getAllValues,
	removeValue,
} from "@/server/scripts/dependencies/environment";
import { getArch, getOS } from "@/server/scripts/dependencies/utils/system";
import logger from "@/server/utils/logger";
import type { Server } from "socket.io";

const depName = "ffmpeg";
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
			execFile(depName, ["-version"], { env: ENVIRONMENT }, (error, stdout) => {
				if (error) {
					reject(error);
				} else {
					resolve(stdout);
				}
			});
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
	required_v?: string,
	signal?: AbortSignal,
): Promise<{ success: boolean }> {
	const depFolder = path.join(binFolder, depName);
	const tempDir = path.join(binFolder, "temp");

	if (signal?.aborted) return { success: false };

	const platform = getOS(); // window, linux, macos
	const arch = getArch(); // amd64, arm64, x86

	if (!fs.existsSync(depFolder)) {
		fs.mkdirSync(depFolder, { recursive: true });
	}

	const urls: Record<string, Record<string, string>> = {
		linux: {
			amd64:
				"https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz",
			arm64:
				"https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linuxarm64-gpl.tar.xz",
		},
		macos: {
			amd64: "https://evermeet.cx/ffmpeg/ffmpeg-7.1.1.zip",
			arm64: "https://evermeet.cx/ffmpeg/ffmpeg-7.1.1.zip",
		},
		windows: {
			amd64:
				"https://github.com/GyanD/codexffmpeg/releases/download/7.1.1/ffmpeg-7.1.1-full_build.zip",
			arm64:
				"https://github.com/GyanD/codexffmpeg/releases/download/7.1.1/ffmpeg-7.1.1-full_build.zip",
			x86: "https://github.com/GyanD/codexffmpeg/releases/download/7.1.1/ffmpeg-7.1.1-full_build.zip",
		},
	};

	const url = urls[platform]?.[arch];
	if (!fs.existsSync(tempDir)) {
		// if temp dir does not exist, create it
		fs.mkdirSync(tempDir, { recursive: true });
	}

	const installerExt =
		platform === "macos" ? "zip" : platform === "linux" ? "tar.xz" : "zip";
	const installerFile = fs.createWriteStream(
		path.join(tempDir, `${depName}-${platform}-${arch}.${installerExt}`),
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
			signal,
		};

		try {
			await new Promise<void>((resolve, reject) => {
				if (signal?.aborted) return reject(new Error("Aborted"));
				const req = https
					.get(url, options, (response) => {
						if ([301, 302].includes(response.statusCode ?? 0)) {
							const redirectUrl = response.headers.location;
							if (redirectUrl) {
								https
									.get(redirectUrl, { ...options }, (redirectResponse) => {
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

				signal?.addEventListener("abort", () => {
					req.destroy();
					installerFile.destroy();
					reject(new Error("Aborted"));
				});
			});
		} catch (e: any) {
			if (
				signal?.aborted ||
				e.name === "AbortError" ||
				e.message === "Aborted"
			) {
				return { success: false };
			}
			logger.error(`Error downloading ${depName}:`, e);
			io.to(id).emit("installDep", {
				type: "error",
				content: `Error downloading ${depName}: ${e}`,
			});
			return { success: false };
		}
	} else {
		io.to(id).emit("installDep", {
			type: "error",
			content: `No download URL found for ${depName} on ${platform} (${arch})`,
		});

		return { success: false };
	}

	if (signal?.aborted) return { success: false };

	io.to(id).emit("installDep", {
		type: "log",
		content: `Running installer for ${depName}...`,
	});

	const exe = path.join(
		tempDir,
		`${depName}-${platform}-${arch}.${installerExt}`,
	);
	const commands: Record<string, { file: string; args: string[] }> = {
		linux: {
			file: "tar",
			args: ["-xvzf", exe, "-C", depFolder],
		},
		macos: {
			file: "tar",
			args: ["-xvzf", exe, "-C", depFolder],
		},
		windows: {
			file: `tar`,
			args: ["-xf", exe, "-C", depFolder],
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
		signal,
	};

	try {
		await new Promise<void>((resolve, reject) => {
			if (signal?.aborted) return reject(new Error("Aborted"));
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
				if (signal?.aborted) return reject(new Error("Aborted"));
				console.log(`Installer exited with code ${code}`);
				if (code === 0) {
					io.to(id).emit("installDep", {
						type: "log",
						content: `${depName} installed successfully`,
					});

					if (getOS() === "windows") {
						try {
							// move from ffmpeg-7.1.1-full_build to binFolder
							io.to(id).emit("installDep", {
								type: "log",
								content: `Moving FFmpeg files to ${binFolder}/${depName}...`,
							});
							const tempFolder = path.join(
								binFolder,
								depName,
								"ffmpeg-7.1.1-full_build",
							);
							fs.cpSync(tempFolder, path.join(binFolder, depName), {
								recursive: true,
								force: true,
							});
							fs.rmSync(tempFolder, { recursive: true, force: true });
						} catch (error) {
							logger.error(`Error moving FFmpeg files:`, error);
							io.to(id).emit("installDep", {
								type: "error",
								content: `Error moving FFmpeg files: ${error}`,
							});
							reject(error);
						}
					}

					// update environment variables
					addValue("PATH", path.join(depFolder));
					addValue("PATH", path.join(depFolder, "bin"));

					resolve();
				} else {
					reject(new Error(`Installer exited with code ${code}`));
				}
			});

			child.on("error", (err) => {
				if (signal?.aborted) return reject(new Error("Aborted"));
				reject(err);
			});
		});
	} catch (error: any) {
		if (
			signal?.aborted ||
			error.message === "Aborted" ||
			error.name === "AbortError"
		) {
			return { success: false };
		}
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
		fs.rmSync(depFolder, { recursive: true, force: true });
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(path.join(depFolder), "PATH");
		removeValue(path.join(depFolder, "bin"), "PATH");

		logger.info(`${depName} uninstalled successfully`);
	}
}
