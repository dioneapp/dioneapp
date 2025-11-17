import { execFile, spawn } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import { addValue, getAllValues, removeKey, removeValue } from "../environment";
import { getArch, getOS } from "../utils/system";

const depName = "uv";

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
				depName,
				["--version"],
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
		linux: {
			amd64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-x86_64-unknown-linux-gnu.tar.gz",
			arm64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-aarch64-unknown-linux-gnu.tar.gz",
		},
		macos: {
			amd64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-x86_64-apple-darwin.tar.gz",
			arm64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-aarch64-apple-darwin.tar.gz",
		},
		windows: {
			amd64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-x86_64-pc-windows-msvc.zip",
			arm64:
				"https://github.com/astral-sh/uv/releases/download/0.8.3/uv-aarch64-pc-windows-msvc.zip",
			x86: "https://github.com/astral-sh/uv/releases/download/0.8.3/uv-i686-pc-windows-msvc.zip",
		},
	};

	const url = urls[platform]?.[arch];
	if (!fs.existsSync(tempDir)) {
		// if temp dir does not exist, create it
		fs.mkdirSync(tempDir, { recursive: true });
	}
	const installerExt = platform === "windows" ? "zip" : "sh";
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

	const ENVIRONMENT = getAllValues();
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
					const cacheDir = path.join(binFolder, "cache", depName);
					addValue("PATH", path.join(depFolder));
					if (platform === "linux") {
						if (arch === "amd64") {
							addValue(
								"PATH",
								path.join(depFolder, "uv-x86_64-unknown-linux-gnu"),
							);
						} else {
							addValue(
								"PATH",
								path.join(depFolder, "uv-aarch64-unknown-linux-gnu"),
							);
						}
					} else if (platform === "macos") {
						if (arch === "amd64") {
							addValue("PATH", path.join(depFolder, "uv-x86_64-apple-darwin"));
						} else {
							addValue("PATH", path.join(depFolder, "uv-aarch64-apple-darwin"));
						}
					}
					addValue("UV_PYTHON_INSTALL_DIR", path.join(cacheDir));
					addValue("UV_CACHE_DIR", cacheDir);
					addValue("PIP_CACHE_DIR", path.join(binFolder, "cache", "pip"));
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
	const cacheDir = path.join(binFolder, "cache", depName);

	if (fs.existsSync(depFolder)) {
		logger.info(`Removing cache in ${cacheDir}...`);
		fs.rmSync(cacheDir, { recursive: true, force: true });
		logger.info(`Removing ${depName} folder in ${depFolder}...`);
		fs.rmSync(depFolder, { recursive: true, force: true });
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(path.join(depFolder), "PATH");
		removeKey("UV_CACHE_DIR");

		logger.info(`${depName} uninstalled successfully`);
	}
}
