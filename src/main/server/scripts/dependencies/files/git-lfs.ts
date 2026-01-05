import { execFile, spawn } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";
import { closeFile } from "@/server/scripts/delete";
import {
	addValue,
	getAllValues,
	removeValue,
} from "@/server/scripts/dependencies/environment";
import { getArch, getOS } from "@/server/scripts/dependencies/utils/system";
import logger from "@/server/utils/logger";
import type { Server } from "socket.io";

const depName = "git_lfs";
const ENVIRONMENT = getAllValues();

export async function isInstalled(
	binFolder: string,
): Promise<{ installed: boolean; reason: string; version?: string }> {
	const depFolder = path.join(binFolder, depName);
	const env = getAllValues();

	if (process.platform === "linux" || process.platform === "darwin") {
		try {
			const stdout = await new Promise<string>((resolve, reject) => {
				execFile("git-lfs", ["--version"], { env }, (error, stdout) => {
					if (error) reject(error);
					else resolve(stdout);
				});
			});
			const versionMatch = stdout.match(/git-lfs[\/ ]?([\d.]+)/i);
			const version = versionMatch ? versionMatch[1] : "system";
			return { installed: true, reason: "installed", version };
		} catch {
			return { installed: false, reason: "not-installed" };
		}
	}

	if (!fs.existsSync(depFolder) || fs.readdirSync(depFolder).length === 0) {
		return { installed: false, reason: "not-installed" };
	}

	try {
		const stdout = await new Promise<string>((resolve, reject) => {
			execFile(
				path.join(depFolder, "git-lfs.exe"),
				["--version"],
				{ env, cwd: depFolder },
				(error, stdout) => {
					if (error) reject(error);
					else resolve(stdout);
				},
			);
		});
		const versionMatch = stdout.match(/git-lfs[\/ ]?([\d.]+)/i);
		const version = versionMatch ? versionMatch[1] : "unknown";
		return { installed: true, reason: "installed", version };
	} catch {
		return { installed: false, reason: "error" };
	}
}

export async function install(
	binFolder: string,
	id: string,
	io: Server,
): Promise<{ success: boolean }> {
	const depFolder = path.join(binFolder, depName);
	const tempDir = path.join(binFolder, "temp");

	const platform = getOS();
	const arch = getArch();

	if (!fs.existsSync(depFolder)) fs.mkdirSync(depFolder, { recursive: true });
	if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

	const version = "3.7.1";

	const urls: Record<string, Record<string, string>> = {
		linux: {
			amd64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-linux-amd64-v${version}.tar.gz`,
			arm64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-linux-arm64-v${version}.tar.gz`,
		},
		macos: {
			amd64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-darwin-amd64-v${version}.zip`,
			arm64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-darwin-arm64-v${version}.zip`,
		},
		windows: {
			amd64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-windows-amd64-v${version}.zip`,
			arm64: `https://github.com/git-lfs/git-lfs/releases/download/v${version}/git-lfs-windows-arm64-v${version}.zip`,
			x86: `https://github.com/git-lfs/git-lfs/releases/download	v${version}/git-lfs-windows-386-v${version}.zip`,
		},
	};

	const url = urls[platform]?.[arch];

	if (!url) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `No download URL found for ${depName} on ${platform} (${arch})`,
		});
		return { success: false };
	}

	const installerExt =
		platform === "windows" || platform === "macos" ? "zip" : "tar.gz";
	const installerPath = path.join(
		tempDir,
		`git-lfs-${platform}-${arch}.${installerExt}`,
	);
	const installerFile = fs.createWriteStream(installerPath);

	io.to(id).emit("installDep", {
		type: "log",
		content: `Downloading ${depName} for ${platform} (${arch})...`,
	});

	try {
		await new Promise<void>((resolve, reject) => {
			https
				.get(url, (response) => {
					if ([301, 302].includes(response.statusCode ?? 0)) {
						const redirectUrl = response.headers.location;
						if (!redirectUrl) {
							reject(new Error("Redirect URL not found"));
							return;
						}
						https
							.get(redirectUrl, (redirectResponse) => {
								redirectResponse.pipe(installerFile);
								installerFile.on("close", resolve);
								installerFile.on("error", reject);
							})
							.on("error", reject);
					} else if (response.statusCode === 200) {
						response.pipe(installerFile);
						installerFile.on("close", resolve);
						installerFile.on("error", reject);
					} else {
						reject(new Error(`HTTP ${response.statusCode}`));
					}
				})
				.on("error", reject);
		});
	} catch (error) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Download failed for ${depName}: ${String(error)}`,
		});
		return { success: false };
	}

	const commands: Record<string, { file: string; args: string[] }> = {
		linux: {
			file: "bash",
			args: [
				"-c",
				`
cd "${tempDir}" && \
tar -xzf "${installerPath}" && \
find . -type f -name "git-lfs" -exec cp {} "${depFolder}/git-lfs" \\; && \
chmod +x "${depFolder}/git-lfs"
`,
			],
		},
		macos: {
			file: "bash",
			args: [
				"-c",
				`
cd "${tempDir}" && \
unzip -o "${installerPath}" -d "${tempDir}/git-lfs-extract" >/dev/null 2>&1 && \
find "./git-lfs-extract" -type f -name "git-lfs" -exec cp {} "${depFolder}/git-lfs" \\; && \
chmod +x "${depFolder}/git-lfs"
`,
			],
		},
		windows: {
			file: "tar",
			args: ["-xf", installerPath, "-C", tempDir],
		},
	};

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
		content: `Running installer for ${depName}...`,
	});

	const spawnOptions = {
		cwd: tempDir,
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
				io.to(id).emit("installDep", {
					type: "log",
					content: data.toString(),
				});
			});

			child.stderr.on("data", (data) => {
				io.to(id).emit("installDep", {
					type: "error",
					content: data.toString(),
				});
			});

			child.on("close", (code) => {
				if (code === 0) resolve();
				else reject(new Error(`Extractor exited with code ${code}`));
			});

			child.on("error", (err) => {
				reject(err);
			});
		});
	} catch (error) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Error running extractor for ${depName}: ${String(error)}`,
		});
		return { success: false };
	}

	let binaryPath = "";
	const searchPattern = platform === "windows" ? "git-lfs.exe" : "git-lfs";

	const stack: string[] = [tempDir];
	while (stack.length) {
		const current = stack.pop()!;
		const entries = fs.readdirSync(current, { withFileTypes: true });
		for (const entry of entries) {
			const full = path.join(current, entry.name);
			if (entry.isDirectory()) stack.push(full);
			else if (entry.isFile() && entry.name === searchPattern) {
				binaryPath = full;
				break;
			}
		}
		if (binaryPath) break;
	}

	if (!binaryPath) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `${searchPattern} not found after extraction`,
		});
		return { success: false };
	}

	try {
		const targetPath = path.join(
			depFolder,
			platform === "windows" ? "git-lfs.exe" : "git-lfs",
		);
		fs.copyFileSync(binaryPath, targetPath);
		fs.chmodSync(targetPath, 0o755);
	} catch (error) {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Error copying binary for ${depName}: ${String(error)}`,
		});
		return { success: false };
	}

	try {
		if (fs.existsSync(installerPath)) {
			fs.rmSync(installerPath, { force: true });
		}
	} catch {}

	addValue("PATH", depFolder);

	io.to(id).emit("installDep", {
		type: "log",
		content: `${depName} installed successfully`,
	});

	return { success: true };
}

export async function uninstall(binFolder: string): Promise<void> {
	const depFolder = path.join(binFolder, depName);
	if (fs.existsSync(depFolder)) {
		logger.info(`Removing ${depName} folder in ${depFolder}...`);
		await closeFile(depFolder);
		fs.rmSync(depFolder, { recursive: true, force: true });
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(depFolder, "PATH");
		logger.info(`${depName} uninstalled successfully`);
	} else {
		throw new Error(`Dependency ${depName} is not installed`);
	}
}
