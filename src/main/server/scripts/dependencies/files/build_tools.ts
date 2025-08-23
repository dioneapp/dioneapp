import { execFile, execSync, spawn } from "node:child_process";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import { addValue, getAllValues, removeValue } from "../environment";
import { getArch, getOS } from "../utils/system";

// Get available drive letters on Windows
function getAvailableDrives(): string[] {
  const drives: string[] = [];

  // Check all drive letters from A to Z
  for (let i = 65; i <= 90; i++) {
    const driveLetter = String.fromCharCode(i);
    const drivePath = `${driveLetter}:\\`;

    try {
      // Check if drive exists by attempting to access it
      if (fs.existsSync(drivePath)) {
        drives.push(driveLetter);
      }
    } catch (error) {
      // Drive not accessible, skip it (loop continues automatically)
    }
  }

  return drives;
}

// Find Visual Studio installer on any drive
function findVSInstaller(): string | null {
  const availableDrives = getAvailableDrives();

  for (const drive of availableDrives) {
    const installerPaths = [
      `${drive}:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vs_installer.exe`,
      `${drive}:\\Program Files\\Microsoft Visual Studio\\Installer\\vs_installer.exe`
    ];

    for (const installerPath of installerPaths) {
      if (fs.existsSync(installerPath)) {
        logger.info(`Found VS installer at: ${installerPath}`);
        return installerPath;
      }
    }
  }

  return null;
}

// Get Visual Studio environment variables for Python builds
function getVSEnvironmentVariables(): Record<string, string> | null {
	const installations = findExistingVSInstallations();
	if (installations.length === 0) {
		return null;
	}

	// Use the newest installation (first in array)
	const selectedVS = installations[0];
	const vcvarsPath = path.join(selectedVS.path, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');

	try {
		logger.info(`Setting up VS environment using: ${selectedVS.version} ${selectedVS.edition}`);

		const vcvarsOutput = execSync(
			`"${vcvarsPath}" && set`,
			{
				shell: "cmd.exe",
				encoding: 'utf8',
				timeout: 30000
			}
		).toString();

		const envVars: Record<string, string> = {};

		for (const line of vcvarsOutput.split(/\r?\n/)) {
			const match = line.match(/^([^=]+)=(.*)$/);
			if (match) {
				const key = match[1];
				const value = match[2];

				// Include important build environment variables
				if ([
					"PATH", "INCLUDE", "LIB", "LIBPATH",
					"WindowsSdkDir", "WindowsSDKVersion", "UCRTVersion",
					"VCToolsInstallDir", "VCToolsRedistDir"
				].includes(key)) {
					envVars[key] = value;
				}
			}
		}

		logger.info(`VS environment configured with ${Object.keys(envVars).length} variables`);
		return envVars;

	} catch (error) {
		logger.error(`Failed to get VS environment variables: ${error}`);
		return null;
	}
}

// Find existing Visual Studio installations on any drive
function findExistingVSInstallations(): Array<{ path: string; version: string; edition: string }> {
  const installations: Array<{ path: string; version: string; edition: string }> = [];
  const availableDrives = getAvailableDrives();
  const vsVersions = ['2022', '2019', '2017'];
  const editions = ['Enterprise', 'Professional', 'Community', 'BuildTools'];

  for (const drive of availableDrives) {
    for (const version of vsVersions) {
      for (const edition of editions) {
        const paths = [
          `${drive}:\\Program Files\\Microsoft Visual Studio\\${version}\\${edition}`,
          `${drive}:\\Program Files (x86)\\Microsoft Visual Studio\\${version}\\${edition}`
        ];

        for (const vsPath of paths) {
          if (fs.existsSync(vsPath)) {
            const vcvarsPath = path.join(vsPath, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');
            if (fs.existsSync(vcvarsPath)) {
              logger.info(`Found VS ${version} ${edition} at: ${vsPath}`);
              installations.push({
                path: vsPath,
                version,
                edition
              });
            }
          }
        }
      }
    }
  }

  return installations;
}

const depName = "build_tools";
const ENVIRONMENT = getAllValues();

export async function isInstalled(
  binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
  const depFolder = path.join(binFolder, depName);
  const msbuild = path.join(
    depFolder,
    "MSBuild",
    "Current",
    "Bin",
    "MSBuild.exe",
  );
  const env = getAllValues();

  // First check if installed in our managed location
  if (fs.existsSync(depFolder) && fs.readdirSync(depFolder).length > 0) {
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

      return { installed: true, reason: "installed" };
    } catch (error: any) {
      logger.error("ERROR BUILD_TOOLS", error);
    }
  }

  // Check for existing VS installations on any drive
  const existingInstallations = findExistingVSInstallations();
  if (existingInstallations.length > 0) {
    logger.info(`Found ${existingInstallations.length} existing VS installation(s)`);

    // Try to find MSBuild in existing installations
    for (const installation of existingInstallations) {
      const existingMSBuild = path.join(installation.path, "MSBuild", "Current", "Bin", "MSBuild.exe");
      if (fs.existsSync(existingMSBuild)) {
        try {
          await new Promise<string>((resolve, reject) => {
            execFile(existingMSBuild, ["-version"], { env: env }, (error, stdout) => {
              if (error) {
                reject(error);
              } else {
                resolve(stdout);
              }
            });
          });

          logger.info(`Using existing VS installation at: ${installation.path}`);
          return { installed: true, reason: "existing-installation" };
        } catch (error: any) {
          logger.warn(`MSBuild test failed for ${installation.path}:`, error);
          // Loop continues automatically to try next installation
        }
      }
    }
  }

  return { installed: false, reason: "not-installed" };
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

  // Log system information
  const availableDrives = getAvailableDrives();
  const existingInstallations = findExistingVSInstallations();

  logger.info(`Available drives: ${availableDrives.join(', ')}`);
  io.to(id).emit("installDep", {
    type: "log",
    content: `System scan - Available drives: ${availableDrives.join(', ')}`,
  });

  if (existingInstallations.length > 0) {
    logger.info(`Found ${existingInstallations.length} existing VS installation(s)`);
    io.to(id).emit("installDep", {
      type: "log",
      content: `Found ${existingInstallations.length} existing Visual Studio installation(s)`,
    });

    for (const installation of existingInstallations) {
      logger.info(`  - VS ${installation.version} ${installation.edition} at ${installation.path}`);
    }
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
    path.join(tempDir, "build_tools.exe"),
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

  const exe = path.join(tempDir, "build_tools.exe");
  const commands = {
    windows: {
      file: exe,
      args: [
        `--installPath ${depFolder}`,
        "--quiet",
        "--wait",
        "--nocache",
        "--norestart",
        "--includeRecommended",
        "--add",
        "Microsoft.VisualStudio.Workload.VCTools",
        "--add",
        "Microsoft.VisualStudio.Component.VC.CMake.Project",
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
          addValue(
            "PATH",
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
          );
          addValue(
            "CMAKE_PREFIX_PATH",
            path.join(
              depFolder,
              "Common7",
              "IDE",
              "CommonExtensions",
              "Microsoft",
              "CMake",
              "CMake",
            ),
          );
          addValue(
            "CMAKE_MODULE_PATH",
            path.join(
              depFolder,
              "Common7",
              "IDE",
              "CommonExtensions",
              "Microsoft",
              "CMake",
              "CMake",
            ),
          );
          addValue(
            "CMAKE_C_COMPILER",
            path.join(
              depFolder,
              "VC",
              "Tools",
              "MSVC",
              "14.44.35207",
              "bin",
              "Hostx64",
              "x64",
              "cl.exe",
            ),
          );
          addValue(
            "CMAKE_CXX_COMPILER",
            path.join(
              depFolder,
              "VC",
              "Tools",
              "MSVC",
              "14.44.35207",
              "bin",
              "Hostx64",
              "x64",
              "cl.exe",
            ),
          );
          addValue(
            "PATH",
            path.join(
              depFolder,
              "VC",
              "Tools",
              "MSVC",
              "14.44.35207",
              "bin",
              "Hostx64",
              "x64",
            ),
          );

          try {
            const vcvarsOutput = execSync(
              `"${path.join(depFolder, "VC", "Auxiliary", "Build", "vcvars64.bat")}" && set`,
              { shell: "cmd.exe", env: ENVIRONMENT },
            ).toString();

            for (const line of vcvarsOutput.split(/\r?\n/)) {
              const m = line.match(/^([^=]+)=(.*)$/);
              if (m) {
                const key = m[1];
                const value = m[2];
                if (
                  [
                    "INCLUDE",
                    "LIB",
                    "LIBPATH",
                    "WindowsSdkDir",
                    "WindowsSDKVersion",
                    "UCRTVersion",
                  ].includes(key)
                ) {
                  logger.info(`Setting environment variable ${key}=${value}`);
                  addValue(key, value);
                }
              }
            }
          } catch (err) {
            logger.error(
              `Error setting environment variables for ${depName}:`,
              err,
            );
          }

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

// Export function to get enhanced environment for Python builds
export function getEnhancedEnvironment(): Record<string, string> {
	const baseEnv = getAllValues();
	const vsEnv = getVSEnvironmentVariables();

	if (vsEnv) {
		logger.info("Using Visual Studio enhanced environment for builds");
		return {
			...baseEnv,
			...vsEnv,
			// Additional Python build optimizations
			PYTHONUNBUFFERED: "1",
			NODE_NO_BUFFERING: "1",
			FORCE_UNBUFFERED_OUTPUT: "1",
			PYTHONIOENCODING: "UTF-8",
			// Ensure Visual C++ is available for Python
			DISTUTILS_USE_SDK: "1",
			MSSdk: "1"
		};
	}

	logger.warn("Visual Studio environment not available, using base environment");
	return baseEnv;
}

// Check if Visual Studio build tools are available
export function hasVSBuildTools(): boolean {
	const installations = findExistingVSInstallations();
	return installations.length > 0;
}

// Get Visual Studio installation info
export function getVSInfo(): Array<{ path: string; version: string; edition: string }> {
	return findExistingVSInstallations();
}

export async function uninstall(binFolder: string): Promise<void> {
  const depFolder = path.join(binFolder, depName);

  if (fs.existsSync(depFolder)) {
    logger.info(`Removing ${depName} folder in ${depFolder}...`);

    // Find VS installer on any drive
    const vsInstallerPath = findVSInstaller();
    if (!vsInstallerPath) {
      logger.error("Visual Studio installer not found on any drive");
      throw new Error("Visual Studio installer not found");
    }

    try {
      await new Promise<void>((resolve, reject) => {
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
