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

// Cache for drive detection to avoid repeated file system calls
let cachedDrives: string[] | null = null;
let drivesCacheTime = 0;
const DRIVES_CACHE_TTL = 60000; // 1 minute cache

// Get all available drive letters on Windows
function getWindowsDrives(): string[] {
	const now = Date.now();

	// Return cached result if still valid
	if (cachedDrives && (now - drivesCacheTime) < DRIVES_CACHE_TTL) {
		return cachedDrives;
	}

	const drives: string[] = [];
	// Check drives A-Z, but prioritize common drives first
	const priorityDrives = ['C:', 'D:', 'E:', 'F:'];
	const allDrives = [...priorityDrives];

	// Add remaining drives
	for (let i = 65; i <= 90; i++) {
		const drive = String.fromCharCode(i) + ":";
		if (!priorityDrives.includes(drive)) {
			allDrives.push(drive);
		}
	}

	for (const drive of allDrives) {
		try {
			if (fs.existsSync(drive + "\\")) {
				drives.push(drive);
			}
		} catch {
			// Drive doesn't exist or not accessible
		}
	}

	// Cache the result
	cachedDrives = drives;
	drivesCacheTime = now;

	return drives;
}

// Generate VS installation paths for all drives with priority ordering
function generateVSPaths(): string[] {
	const paths: string[] = [];
	const drives = getWindowsDrives();

	// Prioritize newer versions and more common editions
	const relativePaths = [
		"\\Program Files\\Microsoft Visual Studio\\2022\\BuildTools",
		"\\Program Files\\Microsoft Visual Studio\\2022\\Community",
		"\\Program Files\\Microsoft Visual Studio\\2022\\Professional",
		"\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Community",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Professional",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Enterprise",
		"\\Program Files\\Microsoft Visual Studio\\2019\\BuildTools",
		"\\Program Files\\Microsoft Visual Studio\\2019\\Community",
		"\\Program Files\\Microsoft Visual Studio\\2019\\Professional",
		"\\Program Files\\Microsoft Visual Studio\\2019\\Enterprise",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional",
		"\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise",
	];

	// Generate paths with drive priority (C: first, then others)
	for (const drive of drives) {
		for (const relativePath of relativePaths) {
			paths.push(drive + relativePath);
		}
	}

	return paths;
}

function findMSVCVersion(vsPath: string): string | null {
	// Input validation
	if (!vsPath || typeof vsPath !== 'string') {
		logger.warn('Invalid VS path provided to findMSVCVersion');
		return null;
	}

	if (!fs.existsSync(vsPath)) {
		logger.debug(`VS path does not exist: ${vsPath}`);
		return null;
	}

	const msvcPath = path.join(vsPath, "VC", "Tools", "MSVC");
	if (fs.existsSync(msvcPath)) {
		try {
			const versions = fs
				.readdirSync(msvcPath)
				.filter(
					(dir) =>
						fs.statSync(path.join(msvcPath, dir)).isDirectory() &&
						/^\d+\.\d+\.\d+/.test(dir),
				);
			if (versions.length > 0) {
				// Return the latest version
				return versions.sort().reverse()[0];
			}
		} catch (error) {
			logger.error(`Error reading MSVC versions from ${msvcPath}:`, error);
		}
	}
	return null;
}

// Cache for VS installation detection
let cachedVSInstallation: { path: string; msvcVersion: string } | null = null;
let vsInstallationCacheTime = 0;
const VS_INSTALLATION_CACHE_TTL = 300000; // 5 minutes cache

function findVSInstallation(): { path: string; msvcVersion: string } | null {
	const now = Date.now();

	// Return cached result if still valid
	if (cachedVSInstallation && (now - vsInstallationCacheTime) < VS_INSTALLATION_CACHE_TTL) {
		return cachedVSInstallation;
	}

	let result: { path: string; msvcVersion: string } | null = null;

	// First check if VS is in the PATH or environment
	const vsInstallDir = process.env.VSINSTALLDIR;
	if (vsInstallDir && fs.existsSync(vsInstallDir)) {
		const msvcVersion = findMSVCVersion(vsInstallDir);
		if (msvcVersion) {
			logger.info(
				`Found VS installation from environment: ${vsInstallDir} with MSVC ${msvcVersion}`,
			);
			result = { path: vsInstallDir, msvcVersion };
		}
	}

	// If not found in environment, check common installation paths
	if (!result) {
		const vsPaths = generateVSPaths();
		for (const vsPath of vsPaths) {
			if (fs.existsSync(vsPath)) {
				const msvcVersion = findMSVCVersion(vsPath);
				if (msvcVersion) {
					logger.info(
						`Found VS installation at: ${vsPath} with MSVC ${msvcVersion}`,
					);
					result = { path: vsPath, msvcVersion };
					break; // Early exit on first valid installation
				}
			}
		}
	}

	// If still not found, try using vswhere
	if (!result) {
		const drives = getWindowsDrives();
		for (const drive of drives) {
			try {
				const vswhereExe = path.join(
					drive,
					"\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe",
				);
				if (fs.existsSync(vswhereExe)) {
					const output = execSync(
						`"${vswhereExe}" -latest -property installationPath`,
						{ encoding: "utf8", timeout: 10000 }, // 10 second timeout
					).trim();
					if (output && fs.existsSync(output)) {
						const msvcVersion = findMSVCVersion(output);
						if (msvcVersion) {
							logger.info(
								`Found VS installation via vswhere: ${output} with MSVC ${msvcVersion}`,
							);
							result = { path: output, msvcVersion };
							break; // Early exit on first valid installation
						}
					}
				}
			} catch (error) {
				logger.debug(`vswhere check failed on drive ${drive}:`, error);
			}
		}
	}

	// Cache the result (even if null)
	cachedVSInstallation = result;
	vsInstallationCacheTime = now;

	return result;
}

function addWindowsSDKToPath(): void {
	// Add Windows SDK bin directory for rc.exe
	// Try to find Windows SDK version on all drives
	const drives = getWindowsDrives();
	for (const drive of drives) {
		const windowsKitsPath = path.join(drive, "\\Program Files (x86)\\Windows Kits\\10");
		if (fs.existsSync(windowsKitsPath)) {
			const binPath = path.join(windowsKitsPath, "bin");
			if (fs.existsSync(binPath)) {
				try {
					// Find the SDK version directories
					const versions = fs.readdirSync(binPath).filter(dir =>
						fs.statSync(path.join(binPath, dir)).isDirectory() &&
						/^\d+\.\d+\.\d+\.\d+$/.test(dir)
					);
					if (versions.length > 0) {
						// Use the latest version
						const latestVersion = versions.sort().reverse()[0];
						const rcPath = path.join(binPath, latestVersion, "x64");
						if (fs.existsSync(path.join(rcPath, "rc.exe"))) {
							logger.info(`Adding Windows SDK bin path for rc.exe: ${rcPath}`);
							addValue("PATH", rcPath);
						}
						// Also add x86 path as fallback
						const rcPathX86 = path.join(binPath, latestVersion, "x86");
						if (fs.existsSync(path.join(rcPathX86, "rc.exe"))) {
							logger.info(`Adding Windows SDK x86 bin path for rc.exe: ${rcPathX86}`);
							addValue("PATH", rcPathX86);
						}
						break; // Found SDK, no need to check other drives
					}
				} catch (error) {
					logger.debug(`Error reading Windows SDK versions from ${binPath}:`, error);
				}
			}
		}
	}
}

function setupVCVarsEnvironment(vsPath: string, msvcVersion: string): void {
	// Run vcvars64.bat to get all environment variables
	const vcvarsPath = path.join(vsPath, "VC", "Auxiliary", "Build", "vcvars64.bat");
	if (fs.existsSync(vcvarsPath)) {
		let tempBatFile: string | null = null;
		try {
			// Use a more robust approach to get environment variables
			// Create temp file in system temp directory instead of VS directory
			const os = require('os');
			const tempDir = os.tmpdir();
			tempBatFile = path.join(tempDir, `dione_vcvars_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.bat`);

			const batContent = `@echo off
call "${vcvarsPath}" >nul 2>&1
echo INCLUDE=%INCLUDE%
echo LIB=%LIB%
echo LIBPATH=%LIBPATH%
echo WindowsSdkDir=%WindowsSdkDir%
echo WindowsSDKVersion=%WindowsSDKVersion%
echo UCRTVersion=%UCRTVersion%
echo VCToolsInstallDir=%VCToolsInstallDir%
echo VCToolsVersion=%VCToolsVersion%
echo VSINSTALLDIR=%VSINSTALLDIR%
echo VCToolsRedistDir=%VCToolsRedistDir%`;

			fs.writeFileSync(tempBatFile, batContent);

			const vcvarsOutput = execSync(`"${tempBatFile}"`, {
				encoding: 'utf8',
				shell: 'cmd.exe',
				windowsHide: true,
				timeout: 30000, // 30 second timeout
			});

			vcvarsOutput.split(/\r?\n/).forEach((line) => {
				const m = line.match(/^([^=]+)=(.*)$/);
				if (m) {
					const key = m[1];
					const value = m[2];
					if (value && value !== `%${key}%`) { // Only set if value exists and is not unresolved
						logger.info(`Setting environment variable ${key}`);
						addValue(key, value);
					}
				}
			});
		} catch (err) {
			logger.error(`Error setting environment variables from vcvars64.bat:`, err);

			// Fallback: Try to set basic paths manually
			const includeDir = path.join(vsPath, "VC", "Tools", "MSVC", msvcVersion, "include");
			const libDir = path.join(vsPath, "VC", "Tools", "MSVC", msvcVersion, "lib", "x64");

			if (fs.existsSync(includeDir)) {
				logger.info("Setting INCLUDE path manually");
				addValue("INCLUDE", includeDir);
			}
			if (fs.existsSync(libDir)) {
				logger.info("Setting LIB path manually");
				addValue("LIB", libDir);
			}
		} finally {
			// Ensure temp file cleanup in all cases
			if (tempBatFile && fs.existsSync(tempBatFile)) {
				try {
					fs.unlinkSync(tempBatFile);
					logger.debug(`Cleaned up temporary file: ${tempBatFile}`);
				} catch (cleanupErr) {
					logger.warn(`Failed to cleanup temporary file ${tempBatFile}:`, cleanupErr);
				}
			}
		}
	}
}

function updateEnvironmentForVS(vsPath: string, msvcVersion: string) {
	// Input validation
	if (!vsPath || typeof vsPath !== 'string') {
		throw new Error('Invalid VS path provided to updateEnvironmentForVS');
	}

	if (!msvcVersion || typeof msvcVersion !== 'string') {
		throw new Error('Invalid MSVC version provided to updateEnvironmentForVS');
	}

	if (!fs.existsSync(vsPath)) {
		throw new Error(`VS installation path does not exist: ${vsPath}`);
	}

	logger.info(`Updating environment for VS at ${vsPath} with MSVC ${msvcVersion}`);

	// Add MSBuild to PATH
	const msbuildPath = path.join(vsPath, "MSBuild", "Current", "Bin");
	if (fs.existsSync(msbuildPath)) {
		addValue("PATH", msbuildPath);
	}

	// Add CMake to PATH
	const cmakePath = path.join(
		vsPath,
		"Common7",
		"IDE",
		"CommonExtensions",
		"Microsoft",
		"CMake",
		"CMake",
		"bin",
	);
	if (fs.existsSync(cmakePath)) {
		addValue("PATH", cmakePath);
		addValue("CMAKE_PREFIX_PATH", path.dirname(cmakePath));
	}

	// Add MSVC compiler to PATH
	const msvcBinPath = path.join(
		vsPath,
		"VC",
		"Tools",
		"MSVC",
		msvcVersion,
		"bin",
		"Hostx64",
		"x64",
	);
	if (fs.existsSync(msvcBinPath)) {
		addValue("PATH", msvcBinPath);
		const clPath = path.join(msvcBinPath, "cl.exe");
		if (fs.existsSync(clPath)) {
			addValue("CMAKE_C_COMPILER", clPath);
			addValue("CMAKE_CXX_COMPILER", clPath);
		}
	}

	// Add Windows SDK paths
	addWindowsSDKToPath();

	// Setup environment variables from vcvars64.bat
	setupVCVarsEnvironment(vsPath, msvcVersion);

	// Set additional environment variables for Python builds
	logger.info("Setting Python build environment variables");
	addValue("DISTUTILS_USE_SDK", "1");
	addValue("MSSdk", "1");

	// Set VS version for Python
	if (vsPath.includes("2022")) {
		addValue("VS170COMNTOOLS", path.join(vsPath, "Common7", "Tools"));
	} else if (vsPath.includes("2019")) {
		addValue("VS160COMNTOOLS", path.join(vsPath, "Common7", "Tools"));
	}

	// Add VS installation directory
	addValue("VSINSTALLDIR", vsPath);
}

export async function isInstalled(
	binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
	// Input validation
	if (!binFolder || typeof binFolder !== 'string') {
		logger.error('Invalid binFolder provided to isInstalled');
		return { installed: false, reason: 'invalid-input' };
	}

	const depFolder = path.join(binFolder, depName);
	const env = getAllValues();

	// First check if custom installation exists
	if (fs.existsSync(depFolder) && fs.readdirSync(depFolder).length > 0) {
		const msbuild = path.join(
			depFolder,
			"MSBuild",
			"Current",
			"Bin",
			"MSBuild.exe",
		);
		if (fs.existsSync(msbuild)) {
			try {
				await new Promise<string>((resolve, reject) => {
					execFile(msbuild, ["-version"], { env: env }, (error, stdout) => {
						if (error) {
							reject(error);
						} else {
							resolve(stdout);
						}
					});
				});
				logger.info("Build tools found in custom location");
				return { installed: true, reason: `installed-custom` };
			} catch (error: any) {
				logger.debug("Custom MSBuild check failed", error);
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
					logger.info(
						`Build tools found at system location: ${vsInstall.path}`,
					);

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
		const nodeGypOutput = execSync("npm config get msbuild_path", {
			encoding: "utf8",
		}).trim();
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
			execSync("node-gyp configure --msvs_version=2022", {
				env: env,
				stdio: "pipe",
			});
			logger.info("Build tools detected via node-gyp");
			return { installed: true, reason: `installed-node-gyp` };
		} catch (configError) {
			try {
				execSync("node-gyp configure --msvs_version=2019", {
					env: env,
					stdio: "pipe",
				});
				logger.info("Build tools detected via node-gyp (2019)");
				return { installed: true, reason: `installed-node-gyp-2019` };
			} catch (config2019Error) {
				logger.debug("node-gyp configure failed", config2019Error);
			}
		}
	} catch (error) {
		logger.debug("node-gyp check failed", error);
	}

	logger.info("Build tools not found");
	return { installed: false, reason: `not-installed` };
}

export async function install(
	binFolder: string,
	id: string,
	io: Server,
): Promise<{ success: boolean }> {
	// Input validation
	if (!binFolder || typeof binFolder !== 'string') {
		logger.error('Invalid binFolder provided to install');
		io.to(id).emit("installDep", {
			type: "error",
			content: "Invalid installation directory provided",
		});
		return { success: false };
	}

	if (!id || typeof id !== 'string') {
		logger.error('Invalid id provided to install');
		return { success: false };
	}

	const depFolder = path.join(binFolder, depName);
	const tempDir = path.join(binFolder, "temp");

	const platform = getOS(); // window, linux, macos
	const arch = getArch(); // amd64, arm64, x86

	// Only support Windows for build tools
	if (platform !== 'windows') {
		io.to(id).emit("installDep", {
			type: "error",
			content: `Build tools installation is only supported on Windows, current platform: ${platform}`,
		});
		return { success: false };
	}

	// First check if already installed system-wide
	try {
		const vsInstall = findVSInstallation();
		if (vsInstall) {
			io.to(id).emit("installDep", {
				type: "log",
				content: `Build tools already installed at ${vsInstall.path}`,
			});
			updateEnvironmentForVS(vsInstall.path, vsInstall.msvcVersion);
			return { success: true };
		}
	} catch (error) {
		logger.warn('Error checking for existing VS installation:', error);
		// Continue with installation attempt
	}

	// Create directories with proper error handling
	try {
		if (!fs.existsSync(depFolder)) {
			fs.mkdirSync(depFolder, { recursive: true });
		}
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}
	} catch (error) {
		logger.error('Failed to create directories:', error);
		io.to(id).emit("installDep", {
			type: "error",
			content: `Failed to create installation directories: ${error}`,
		});
		return { success: false };
	}

	const urls: Record<string, Record<string, string>> = {
		windows: {
			amd64: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
			arm64: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
			x86: "https://aka.ms/vs/17/release/vs_BuildTools.exe",
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

	const installerPath = path.join(tempDir, `build_tools.exe`);
	let installerFile: fs.WriteStream | null = null;

	try {
		installerFile = fs.createWriteStream(installerPath);

		// 1. url method: install the dependency using official installer url
		io.to(id).emit("installDep", {
			type: "log",
			content: `Downloading ${depName} for ${platform} (${arch}) using URL method...`,
		});

		const options = {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			},
			timeout: 60000, // 60 second timeout
		};

		await new Promise<void>((resolve, reject) => {
			const request = https.get(url, options, (response) => {
				if ([301, 302].includes(response.statusCode ?? 0)) {
					const redirectUrl = response.headers.location;
					if (redirectUrl) {
						https
							.get(redirectUrl, (redirectResponse) => {
								redirectResponse.pipe(installerFile!);
								installerFile!.on("close", resolve);
								installerFile!.on("error", reject);
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
					response.pipe(installerFile!);
					installerFile!.on("close", resolve);
					installerFile!.on("error", reject);
				} else {
					reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
				}
			});

			request.on("error", reject);
			request.on("timeout", () => {
				request.destroy();
				reject(new Error("Download timeout"));
			});
		});
	} catch (error) {
		logger.error('Download failed:', error);
		io.to(id).emit("installDep", {
			type: "error",
			content: `Failed to download ${depName}: ${error}`,
		});

		// Cleanup partial download
		if (installerFile) {
			installerFile.destroy();
		}
		if (fs.existsSync(installerPath)) {
			try {
				fs.unlinkSync(installerPath);
			} catch (cleanupError) {
				logger.warn('Failed to cleanup partial download:', cleanupError);
			}
		}

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
				`--installPath`,
				depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart",
				"--includeRecommended",
				"--add",
				"Microsoft.VisualStudio.Workload.VCTools",
				"--add",
				"Microsoft.VisualStudio.Component.VC.CMake.Project",
				"--add",
				"Microsoft.VisualStudio.Component.Windows10SDK.19041",
				"--add",
				"Microsoft.VisualStudio.Component.VC.Tools.x86.x64",
			],
		},
		{
			name: "Modify existing installation",
			args: [
				"modify",
				`--installPath`,
				depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart",
				"--add",
				"Microsoft.VisualStudio.Workload.VCTools",
				"--add",
				"Microsoft.VisualStudio.Component.VC.CMake.Project",
			],
		},
		{
			name: "Repair installation",
			args: [
				"repair",
				`--installPath`,
				depFolder,
				"--quiet",
				"--wait",
				"--nocache",
				"--norestart",
			],
		},
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

				child.stdout.on("data", (data) => {
					io.to(id).emit("installDep", {
						type: "log",
						content: data.toString(),
					});
				});

				child.stderr.on("data", (data) => {
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
			// Find vs_installer.exe on any drive
			let vsInstallerPath = "";
			const drives = getWindowsDrives();
			for (const drive of drives) {
				const installerPath = path.join(
					drive,
					"\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vs_installer.exe",
				);
				if (fs.existsSync(installerPath)) {
					vsInstallerPath = installerPath;
					break;
				}
			}

			if (vsInstallerPath) {
				// First try to uninstall properly
				await new Promise<void>((resolve) => {
					const child = spawn("powershell", [
						"-Command",
						`Start-Process -FilePath "${vsInstallerPath}" -ArgumentList "uninstall","--installPath","${depFolder}","--quiet","--nocache" -Verb RunAs -Wait`,
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
			} else {
				logger.info("VS installer not found, will remove folder directly");
			}

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
		removeValue(
			path.join(
				depFolder,
				"Common7",
				"IDE",
				"CommonExtensions",
				"Microsoft",
				"CMake",
				"CMake",
				"bin",
			),
			"PATH",
		);
		logger.info(`${depName} uninstalled successfully`);
	} else {
		throw new Error(`Dependency ${depName} is not installed`);
	}
}