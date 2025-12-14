import { execFile, execSync, spawn } from "child_process";
import fs from "fs";
import * as fsRemove from "fs/promises";

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

const depName = "conda";
const ENVIRONMENT = getAllValues();

export async function isInstalled(
	binFolder: string,
): Promise<{ installed: boolean; reason: string; version?: string }> {
	const depFolder = path.join(binFolder, depName);
	const ENVIRONMENT = getAllValues();

	if (!fs.existsSync(depFolder) || fs.readdirSync(depFolder).length === 0) {
		return { installed: false, reason: `not-installed` };
	}

	try {
		const versionOutput = await new Promise<string>((resolve, reject) => {
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

		const match = versionOutput.match(/conda\s+(\d+\.\d+\.\d+)/);
		if (match && match[1]) {
			return { installed: true, reason: `installed`, version: match[1] };
		} else {
			logger.warn(`Could not parse conda version from output: ${versionOutput}`);
			return { installed: true, reason: `installed` };
		}
	} catch (error: any) {
		return { installed: false, reason: `error` };
	}
}

export async function install(
	binFolder: string,
	id: string,
	io: Server,
	requiredVersion?: string,
): Promise<{ success: boolean }> {
	const depFolder = path.join(binFolder, depName);
	const tempDir = path.join(binFolder, "temp");

	const checkIfInstalled = await isInstalled(binFolder);
	logger.info(`Checking if ${depName} is installed: ${JSON.stringify(checkIfInstalled)}`);
	if (checkIfInstalled.installed) {
		if (requiredVersion && requiredVersion !== "latest" && checkIfInstalled.version !== requiredVersion) {
			const result = await update(binFolder, id, io, requiredVersion);
			return { success: result.success };
		}
		logger.info(`No update needed for ${depName} ${requiredVersion}`);
		return { success: true };
	}

	const platform = getOS(); // window, linux, macos
	const arch = getArch(); // amd64, arm64, x86

	if (!fs.existsSync(depFolder)) {
		fs.mkdirSync(depFolder, { recursive: true });
	}

	const urls: Record<string, Record<string, string>> = {
		linux: {
			amd64:
				"https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh",
			arm64:
				"https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh",
		},
		macos: {
			amd64:
				"https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh",
			arm64:
				"https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh",
		},
		windows: {
			amd64:
				"https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe",
			x86: "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86.exe",
		},
	};

	const url = urls[platform]?.[arch];
	if (!fs.existsSync(tempDir)) {
		// if temp dir does not exist, create it
		fs.mkdirSync(tempDir, { recursive: true });
	}
	const installerExt = platform === "windows" ? "exe" : "sh";
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
			file: "sh",
			args: ["-c", `chmod +x ${exe} && ${exe} -b -u -p ${depFolder}`],
		},
		macos: {
			file: "sh",
			args: ["-c", `chmod +x ${exe} && ${exe} -b -u -p ${depFolder}`],
		},
		windows: {
			file: exe,
			args: [
				"/InstallationType=JustMe",
				"/RegisterPython=0",
				"/NOSHORTCUTS",
				"/S",
				"/D=" + depFolder,
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
					const cacheDir = path.join(binFolder, "cache", depName);
					addValue("CONDA_PKGS_DIRS", cacheDir);
					addValue("CONDA_ENVS_PATH", cacheDir);
					addValue(
						"CONDA_EXE",
						platform === "windows"
							? path.join(depFolder, "Scripts", "conda.exe")
							: path.join(depFolder, "bin", "conda"),
					);
					if (platform === "windows") {
						addValue("PATH", path.join(depFolder));
						addValue("PATH", path.join(depFolder, "Scripts"));
					} else {
						addValue("PATH", path.join(depFolder, "bin", "conda"));
						addValue("PATH", path.join(depFolder));
						addValue("PATH", path.join(depFolder, "bin"));
					}
					addValue("CONDA_ROOT", path.join(depFolder));
					addValue("CONDARC", path.join(depFolder, ".condarc"));
					addValue("CONDA_NO_USER_CONFIG", "1");
					addValue("PIP_CACHE_DIR", path.join(binFolder, "cache", "pip"));

					try {
						// execute conda init
						const condaW = path.join(
							binFolder,
							"conda",
							"condabin",
							"conda.bat",
						);
						const condaU = path.join(binFolder, "conda", "bin", "conda");

						io.to(id).emit("installDep", {
							type: "log",
							content: `Initializing conda...`,
						});
						try {
							if (platform === "windows") {
								execSync(
									`${condaW} tos accept --channel main && ${condaW} init --all`,
									{ cwd: depFolder, env: ENVIRONMENT },
								);
							} else {
								execSync(
									`${condaU} tos accept --channel main && ${condaU} init --all`,
									{ cwd: depFolder, env: ENVIRONMENT },
								);
							}

							io.to(id).emit("installDep", {
								type: "log",
								content: `Conda initialized successfully`,
							});

							resolve();
						} catch (error) {
							logger.error(`Error running conda init: ${error}`);
							throw new Error(`Error running conda init: ${error}`);
						}
					} catch (error) {
						logger.error(`Error running conda init: ${error}`);
						io.to(id).emit("installDep", {
							type: "error",
							content: `Error running conda init: ${error}`,
						});
						reject(new Error(`Error running conda init: ${error}`));
					}
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

export async function update(
	binFolder: string,
	id: string,
	io: Server,
	requiredVersion?: string,
): Promise<{ success: boolean }> {
	const depFolder = path.join(binFolder, depName);
	const ENVIRONMENT = getAllValues();

	if (!fs.existsSync(depFolder) || fs.readdirSync(depFolder).length === 0) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `${depName} is not installed. Please install it first.`,
		});
		return { success: false };
	}

	io.to(id).emit("installDep", {
		type: "log",
		content: `Attempting to update ${depName}...`,
	});

	try {
		await new Promise<string>((resolve, reject) => {
			execFile(
				depName,
				["install", "-y", `conda=${requiredVersion}`],
				{ env: ENVIRONMENT, cwd: depFolder },
				(error, stdout, stderr) => {
					if (error) {
						logger.error(`Error updating ${depName}: ${error.message}`);
						logger.error(`stderr: ${stderr}`);
						reject(new Error(`Failed to update ${depName}: ${stderr || error.message}`));
					} else {
						io.to(id).emit("installDep", {
							type: "log",
							content: `Update output: ${stdout}`,
						});
						resolve(stdout);
					}
				},
			);
		});

		io.to(id).emit("installDep", {
			type: "log",
			content: `${depName} updated successfully.`,
		});

		return { success: true };
	} catch (error: any) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Error updating ${depName}: ${error.message}`,
		});
		logger.error(`Error during ${depName} update:`, error);
		return { success: false };
	}
}

export async function uninstall(binFolder: string): Promise<void> {
	const depFolder = path.join(binFolder, depName);
	const cacheDir = path.join(binFolder, "cache", depName);

	if (fs.existsSync(depFolder)) {
		logger.info(`Removing cache in ${cacheDir}...`);
		fsRemove.rm(cacheDir, { recursive: true, force: true });
		logger.info(`Removing ${depName} folder in ${depFolder}...`);
		fsRemove.rm(depFolder, { recursive: true, force: true });
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(path.join(depFolder), "PATH");
		removeValue(path.join(depFolder, "Scripts"), "PATH");
		removeValue(path.join(depFolder, "Library", "bin"), "PATH");
		removeValue("CONDA_PKGS_DIRS", path.join(binFolder, "cache"));
		removeValue("CONDA_EXE", path.join(depFolder, "Scripts", "conda.exe"));
		removeValue("CONDA_ROOT", depFolder);
		removeValue("CONDA_ENVS_PATH", path.join(binFolder, "cache", depName));
		removeValue("CONDA_NO_USER_CONFIG", "1");
		removeValue("CONDARC", path.join(depFolder, ".condarc"));

		logger.info(`${depName} uninstalled successfully`);
	} else {
		throw new Error(`Dependency ${depName} is not installed`);
	}
}
