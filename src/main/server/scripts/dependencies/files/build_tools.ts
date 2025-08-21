import { execFile, execSync, spawn } from "child_process";
import fs from "fs";
import https from "https";
import path from "path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import { addValue, getAllValues, removeValue } from "../environment";
import { getArch, getOS } from "../utils/system";

const depName = "build_tools";
const ENVIRONMENT = getAllValues();

// Common VS installation paths
const VS_PATHS = [
	"C:\\Program Files\\Microsoft Visual Studio\\2022\\BuildTools",
	"C:\\Program Files\\Microsoft Visual Studio\\2022\\Community",
	"C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional",
	"C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Community",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Professional",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Enterprise",
	"C:\\Program Files\\Microsoft Visual Studio\\2019\\BuildTools",
	"C:\\Program Files\\Microsoft Visual Studio\\2019\\Community",
	"C:\\Program Files\\Microsoft Visual Studio\\2019\\Professional",
	"C:\\Program Files\\Microsoft Visual Studio\\2019\\Enterprise",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional",
	"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise",
];

function findMSVCVersion(vsPath: string): string | null {
	const msvcPath = path.join(vsPath, "VC", "Tools", "MSVC");
	if (fs.existsSync(msvcPath)) {
		const versions = fs.readdirSync(msvcPath).filter(dir => 
			fs.statSync(path.join(msvcPath, dir)).isDirectory() && 
			/^\d+\.\d+\.\d+/.test(dir)
		);
		if (versions.length > 0) {
			// Return the latest version
			return versions.sort().reverse()[0];
		}
	}
	return null;
}

function findVSInstallation(): { path: string; msvcVersion: string } | null {
	// First check if VS is in the PATH or environment
	const vsInstallDir = process.env.VSINSTALLDIR;
	if (vsInstallDir && fs.existsSync(vsInstallDir)) {
		const msvcVersion = findMSVCVersion(vsInstallDir);
		if (msvcVersion) {
			logger.info(`Found VS installation from environment: ${vsInstallDir} with MSVC ${msvcVersion}`);
			return { path: vsInstallDir, msvcVersion };
		}
	}

	// Check common installation paths
	for (const vsPath of VS_PATHS) {
		if (fs.existsSync(vsPath)) {
			const msvcVersion = findMSVCVersion(vsPath);
			if (msvcVersion) {
				logger.info(`Found VS installation at: ${vsPath} with MSVC ${msvcVersion}`);
				return { path: vsPath, msvcVersion };
			}
		}
	}

	// Try using vswhere to find VS installations
	try {
		const vswhereExe = "C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe";
		if (fs.existsSync(vswhereExe)) {
			const output = execSync(`"${vswhereExe}" -latest -property installationPath`, { encoding: 'utf8' }).trim();
			if (output && fs.existsSync(output)) {
				const msvcVersion = findMSVCVersion(output);
				if (msvcVersion) {
					logger.info(`Found VS installation via vswhere: ${output} with MSVC ${msvcVersion}`);
					return { path: output, msvcVersion };
				}
			}
		}
	} catch (error) {
		logger.debug("vswhere not found or failed", error);
	}

	return null;
}

export async function isInstalled(
	binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
	const depFolder = path.join(binFolder, depName);
	const env = getAllValues();

	// First check if custom installation exists
	if (fs.existsSync(depFolder) && fs.readdirSync(depFolder).length > 0) {
		const msbuild = path.join(depFolder, "MSBuild", "Current", "Bin", "MSBuild.exe");
		if (fs.existsSync(msbuild)) {
			try {
				await new Promise<string>((resolve, reject) => {
					execFile(
						msbuild,
						["-version"],
						{ env: env },
						(error, stdout) => {
							if (error) {
								reject(error);
							} else {
								resolve(stdout);
							}
						},
					);
				});
				logger.info("Build tools found in custom location");
				return { installed: true, reason: `installed-custom` };
			} catch (error: any) {
				logger.debug('Custom MSBuild check failed', error);
			}
		}
	}

	// Check for system-wide VS installation
	const vsInstall = findVSInstallation();
	if (vsInstall) {
		const msbuildPaths = [
			path.join(vsInstall.path, "MSBuild", "Current", "Bin", "MSBuild.exe"),
			path.join(vsInstall.path, "MSBuild", "15.0", "Bin", "MSBuild.exe"),
			path.join(vsInstall.path, "MSBuild", "14.0", "Bin", "MSBuild.exe"),
		];

		for (const msbuildPath of msbuildPaths) {
			if (fs.existsSync(msbuildPath)) {
				try {
					await new Promise<string>((resolve, reject) => {
						execFile(
							msbuildPath,
							["-version"],
							{ env: env },
							(error, stdout) => {
								if (error) {
									reject(error);
								} else {
									resolve(stdout);
								}
							},
						);
					});
					logger.info(`Build tools found at system location: ${vsInstall.path}`);
					
					// Update environment with the found installation
					updateEnvironmentForVS(vsInstall.path, vsInstall.msvcVersion);
					
					return { installed: true, reason: `installed-system` };
				} catch (error: any) {
					logger.debug(`MSBuild check failed for ${msbuildPath}`, error);
				}
			}
		}
	}

	// Check if node-gyp can find build tools
	try {
		const nodeGypOutput = execSync("npm config get msbuild_path", { encoding: 'utf8' }).trim();
		if (nodeGypOutput && fs.existsSync(nodeGypOutput)) {
			logger.info(`Build tools found via npm config: ${nodeGypOutput}`);
			return { installed: true, reason: `installed-npm-config` };
		}
	} catch (error) {
		logger.debug("npm config check failed", error);
	}

	// Try to detect using node-gyp directly
	try {
		execSync("node-gyp --version", { env: env });
		// If node-gyp is available, try to configure it
		try {
			execSync("node-gyp configure --msvs_version=2022", { env: env, stdio: 'pipe' });
			logger.info("Build tools detected via node-gyp");
			return { installed: true, reason: `installed-node-gyp` };
		} catch (configError) {
			try {
				execSync("node-gyp configure --msvs_version=2019", { env: env, stdio: 'pipe' });
				logger.info("Build tools detected via node-gyp (2019)");
				return { installed: true, reason: `installed-node-gyp-2019` };
			} catch (config2019Error) {
				logger.debug("node-gyp configure failed", config2019Error);
			}
		}
	} catch (error) {
		logger.debug("node-gyp check failed", error);
	}

	logger.info('Build tools not found');
	return { installed: false, reason: `not-installed` };
}

function updateEnvironmentForVS(vsPath: string, msvcVersion: string) {
	// Add MSBuild to PATH
	const msbuildPath = path.join(vsPath, "MSBuild", "Current", "Bin");
	if (fs.existsSync(msbuildPath)) {
		addValue("PATH", msbuildPath);
	}

	// Add CMake to PATH
	const cmakePath = path.join(vsPath, "Common7", "IDE", "CommonExtensions", "Microsoft", "CMake", "CMake", "bin");
	if (fs.existsSync(cmakePath)) {
		addValue("PATH", cmakePath);
		addValue("CMAKE_PREFIX_PATH", path.dirname(cmakePath));
	}

	// Add MSVC compiler to PATH
	const msvcBinPath = path.join(vsPath, "VC", "Tools", "MSVC", msvcVersion, "bin", "Hostx64", "x64");
	if (fs.existsSync(msvcBinPath)) {
		addValue("PATH", msvcBinPath);
		const clPath = path.join(msvcBinPath, "cl.exe");
		if (fs.existsSync(clPath)) {
			addValue("CMAKE_C_COMPILER", clPath);
			addValue("CMAKE_CXX_COMPILER", clPath);
		}
	}

	// Run vcvars64.bat to get all environment variables
	const vcvarsPath = path.join(vsPath, "VC", "Auxiliary", "Build", "vcvars64.bat");
	if (fs.existsSync(vcvarsPath)) {
		try {
			const vcvarsOutput = execSync(
				`"${vcvarsPath}" && set`,
				{ shell: "cmd.exe", env: getAllValues() },
			).toString();

			vcvarsOutput.split(/\r?\n/).forEach(line => {
				const m = line.match(/^([^=]+)=(.*)$/);
				if (m) {
					const key = m[1];
					const value = m[2];
					if (["INCLUDE", "LIB", "LIBPATH", "WindowsSdkDir", "WindowsSDKVersion", "UCRTVersion", "VCToolsInstallDir", "VCToolsVersion"].includes(key)) {
						logger.info(`Setting environment variable ${key}`);
						addValue(key, value);
					}
				}
			});
		} catch (err) {
			logger.error(`Error setting environment variables from vcvars64.bat:`, err);
		}
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

	// First check if already installed system-wide
	const vsInstall = findVSInstallation();
	if (vsInstall) {
		io.to(id).emit("installDep", {
			type: "log",
			content: `Build tools already installed at ${vsInstall.path}`,
		});
		updateEnvironmentForVS(vsInstall.path, vsInstall.msvcVersion);
		return { success: true };
	}

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
	
	// Try multiple installation approaches like Pinokio
	const installAttempts = [
		{
			name: "Standard installation",
			args: [
				`--installPath`, depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart",
				"--includeRecommended",
				"--add", "Microsoft.VisualStudio.Workload.VCTools",
				"--add", "Microsoft.VisualStudio.Component.VC.CMake.Project",
				"--add", "Microsoft.VisualStudio.Component.Windows10SDK.19041",
				"--add", "Microsoft.VisualStudio.Component.VC.Tools.x86.x64"
			],
		},
		{
			name: "Modify existing installation",
			args: [
				"modify",
				`--installPath`, depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart",
				"--add", "Microsoft.VisualStudio.Workload.VCTools",
				"--add", "Microsoft.VisualStudio.Component.VC.CMake.Project"
			],
		},
		{
			name: "Repair installation",
			args: [
				"repair",
				`--installPath`, depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart"
			],
		}
	];

	for (const attempt of installAttempts) {
		io.to(id).emit("installDep", {
			type: "log",
			content: `Attempting: ${attempt.name}`,
		});

		try {
			await new Promise<void>((resolve, reject) => {
				const child = spawn(exe, attempt.args, {
					cwd: depFolder,
					shell: true,
					windowsHide: true,
					detached: false,
					env: {
						...ENVIRONMENT,
						PYTHONUNBUFFERED: "1",
						NODE_NO_BUFFERING: "1",
						FORCE_UNBUFFERED_OUTPUT: "1",
						PYTHONIOENCODING: "UTF-8",
					},
				});

				let hasOutput = false;
				child.stdout.on("data", (data) => {
					hasOutput = true;
					io.to(id).emit("installDep", { type: "log", content: data.toString() });
				});

				child.stderr.on("data", (data) => {
					hasOutput = true;
					io.to(id).emit("installDep", {
						type: "log",
						content: data.toString(),
					});
				});

				child.on("close", async (code) => {
					console.log(`Installer exited with code ${code}`);
					
					// Check if installation was successful
					const checkResult = await isInstalled(binFolder);
					if (checkResult.installed) {
						io.to(id).emit("installDep", {
							type: "log",
							content: `${depName} installed successfully via ${attempt.name}`,
						});
						resolve();
					} else if (code === 0 || code === 3010) {
						// Exit code 3010 means reboot required but installation succeeded
						io.to(id).emit("installDep", {
							type: "log",
							content: `Installer completed with code ${code}, checking installation...`,
						});
						
						// Try to find and configure the installation
						const msvcVersion = findMSVCVersion(depFolder);
						if (msvcVersion) {
							updateEnvironmentForVS(depFolder, msvcVersion);
							resolve();
						} else {
							reject(new Error(`Installation completed but MSVC not found`));
						}
					} else {
						reject(new Error(`Installer exited with code ${code}`));
					}
				});
			});

			// If we got here, installation succeeded
			return { success: true };
		} catch (error) {
			logger.error(`${attempt.name} failed:`, error);
			io.to(id).emit("installDep", {
				type: "log",
				content: `${attempt.name} failed, trying next approach...`,
			});
			// Continue to next attempt
		}
	}

	// If all attempts failed, try one more time to detect system installation
	const finalCheck = await isInstalled(binFolder);
	if (finalCheck.installed) {
		io.to(id).emit("installDep", {
			type: "log",
			content: `${depName} detected after installation attempts`,
		});
		return { success: true };
	}

	io.to(id).emit("installDep", {
		type: "error",
		content: `Failed to install ${depName} after all attempts`,
	});
	return { success: false };
}

export async function uninstall(binFolder: string): Promise<void> {
	const depFolder = path.join(binFolder, depName);

	if (fs.existsSync(depFolder)) {
		logger.info(`Removing ${depName} folder in ${depFolder}...`);
		try {
			// First try to uninstall properly
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
					console.log(`Uninstaller exited with code ${code}`);
					if (code === 0) {
						resolve();
					} else {
						// Even if uninstaller fails, we'll clean up manually
						resolve();
					}
				});
			});

			// Clean up the folder
			if (fs.existsSync(depFolder)) {
				fs.rmSync(depFolder, { recursive: true, force: true });
			}
		} catch (error) {
			logger.error(`Error during uninstallation:`, error);
			// Force remove the folder
			if (fs.existsSync(depFolder)) {
				fs.rmSync(depFolder, { recursive: true, force: true });
			}
		}
		
		logger.info(`Removing ${depName} from environment variables...`);
		removeValue(path.join(depFolder, "MSBuild", "Current", "Bin"), "PATH");
		removeValue(path.join(depFolder, "Common7", "IDE", "CommonExtensions", "Microsoft", "CMake", "CMake", "bin"), "PATH");
		logger.info(`${depName} uninstalled successfully`);
	} else {
		throw new Error(`Dependency ${depName} is not installed`);
	}
}