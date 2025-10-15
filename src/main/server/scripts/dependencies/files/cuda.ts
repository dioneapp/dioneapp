import { execFile, spawn } from "child_process";
import fs, { rmdir } from "fs";
import https from "https";
import path from "path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import { addValue, getAllValues, removeKey, removeValue } from "../environment";
import { getArch, getOS } from "../utils/system";

const depName = "cuda";
const cudaVersion = "12.1";
const expectedWindowsPath = `C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v${cudaVersion}`;
const expectedLinuxPath = `/usr/local/cuda-${cudaVersion}`;

function getCudaUrl(platform: string, arch: string): string | undefined {
    if (platform === "windows" && arch === "amd64") {
        return "https://developer.download.nvidia.com/compute/cuda/12.1.0/local_installers/cuda_12.1.0_531.14_windows.exe";
    }
    if (platform === "linux" && arch === "amd64") {
        return "https://developer.download.nvidia.com/compute/cuda/12.1.0/local_installers/cuda_12.1.0_530.30.02_linux.run";
    }
    return undefined;
}

export async function isInstalled(
    _binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
    const platform = getOS();
    const ENVIRONMENT = getAllValues();
    let cudaPath: string;

    if (platform === "windows") {
        cudaPath = expectedWindowsPath;
    } else if (platform === "linux") {
        cudaPath = expectedLinuxPath;
        try {
            await new Promise<void>((resolve, reject) => {
                execFile("nvcc", ["--version"], { env: ENVIRONMENT }, (error) => {
                    if (!error) resolve();
                    else reject(error);
                });
            });

            return { installed: true, reason: `nvcc-found-in-path` };

        } catch (error) {
        }
    } else {
        return { installed: false, reason: "unsupported-platform" };
    }

    if (fs.existsSync(cudaPath)) {
        if (!ENVIRONMENT.CUDA_HOME) {
            if (platform === "windows") {
                    addValue("PATH", expectedWindowsPath);
                    addValue("PATH", path.join(expectedWindowsPath, "bin"));
                    addValue("CUDA_HOME", expectedWindowsPath);
                    addValue("CUDA_PATH", expectedWindowsPath);
                } else if (platform === "linux") {
                    addValue("PATH", path.join(expectedLinuxPath, "bin"));
                    addValue("CUDA_HOME", expectedLinuxPath);
                    addValue("CUDA_PATH", expectedLinuxPath);
                }
        }
        return { installed: true, reason: `path-exists-at-${cudaPath}` };
    }

    return { installed: false, reason: `path-not-found-${cudaPath}` };
}

export async function install(
    binFolder: string,
    id: string,
    io: Server,
): Promise<{ success: boolean }> {
    const tempDir = path.join(binFolder, "temp");
    const platform = getOS();
    const arch = getArch();

    const url = getCudaUrl(platform, arch);
    if (!url) {
        io.to(id).emit("installDep", {
            type: "error",
            content: `No download URL found for ${depName} ${cudaVersion} on ${platform} (${arch})`,
        });
        return { success: false };
    }

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const installerExt = platform === "windows" ? "exe" : "run";
    const installerFilename = `${depName}-${cudaVersion}-${platform}-${arch}.${installerExt}`;
    const installerFilepath = path.join(tempDir, installerFilename);

    io.to(id).emit("installDep", {
        type: "log",
        content: `Downloading ${depName} ${cudaVersion} (~3GB). This may take a while...`,
    });

    try {
        await new Promise<void>((resolve, reject) => {
            const fileStream = fs.createWriteStream(installerFilepath);
            const options = {
                headers: { "User-Agent": "Mozilla/5.0" },
            };
            
            https.get(url, options, (response) => {
                if (response.statusCode && (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location)) {
                    https.get(response.headers.location, options, (redirectResponse) => {
                        redirectResponse.pipe(fileStream);
                        fileStream.on("close", resolve);
                        fileStream.on("error", reject);
                    }).on("error", reject);
                } else if (response.statusCode === 200) {
                    response.pipe(fileStream);
                    fileStream.on("close", resolve);
                    fileStream.on("error", reject);
                } else {
                    reject(new Error(`HTTP ${response.statusCode} for installer download`));
                }
            }).on("error", reject);
        });

        io.to(id).emit("installDep", {
            type: "log",
            content: `${depName} installer downloaded successfully to ${installerFilepath}`,
        });

    } catch (error) {
        logger.error(`Error downloading installer for ${depName}:`, error);
        io.to(id).emit("installDep", {
            type: "error",
            content: `Error downloading installer for ${depName}: ${error}`,
        });
        return { success: false };
    }

    io.to(id).emit("installDep", {
        type: "log",
        content: `Running CUDA installer...`,
    });

    let command: { file: string; args: string[] };

    if (platform === "windows") {
        command = {
            file: installerFilepath,
            args: [`-s -n nvcc_12.1 cudart_12.1`],
        };
    } else if (platform === "linux") {
        command = {
            file: "sudo",
            args: ["sh", installerFilepath, "--silent", "--toolkit"],
        };
    } else {
        io.to(id).emit("installDep", {
            type: "error",
            content: `Unsupported platform for CUDA installation: ${platform}`,
        });
        return { success: false };
    }

    io.to(id).emit("installDep", {
        type: "log",
        content: `Executing: ${command.file} ${command.args.join(" ")}`,
    });

    const ENVIRONMENT = getAllValues();
    const spawnOptions = {
        shell: true,
        windowsHide: true,
        env: ENVIRONMENT,
    };

    try {
        await new Promise<void>((resolve, reject) => {
            let child;

            if (platform === "windows") {
                const argString = command.args.join(" ");
                const installerPathEscaped = installerFilepath.replace(/'/g, "''");
                const argStringEscaped = argString.replace(/'/g, "''");
                const psCommand = `Start-Process -FilePath '${installerPathEscaped}' -ArgumentList '${argStringEscaped}' -Verb RunAs -Wait -PassThru`;

                child = spawn("powershell", [
                    "-NoProfile",
                    "-NonInteractive",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    psCommand,
                ], { windowsHide: true, env: ENVIRONMENT });
            } else {
                child = spawn(command.file, command.args, spawnOptions);
            }

            if (child.stdout) {
                child.stdout.on("data", (data) => {
                    io.to(id).emit("installDep", { type: "log", content: data.toString() });
                });
            }

            if (child.stderr) {
                child.stderr.on("data", (data) => {
                    io.to(id).emit("installDep", {
                        type: "error",
                        content: `Installer Error: ${data.toString()}`,
                    });
                    logger.error(`Error during CUDA installation: ${data.toString()}`);
                });
            }

            child.on("close", (code) => {
                if (code === 0) {
                    io.to(id).emit("installDep", {
                        type: "log",
                        content: `CUDA ${cudaVersion} installation finished.`,
                    });
                    
                    if (platform === "windows") {
                        addValue("PATH", expectedWindowsPath);
                        addValue("PATH", path.join(expectedWindowsPath, "bin"));
                        addValue("CUDA_HOME", expectedWindowsPath);
                        addValue("CUDA_PATH", expectedWindowsPath);
                    } else if (platform === "linux") {
                         addValue("PATH", path.join(expectedLinuxPath, "bin"));
                         addValue("CUDA_HOME", expectedLinuxPath);
                         addValue("CUDA_PATH", expectedLinuxPath);
                    }

                    resolve();
                } else {
                    reject(new Error(`CUDA installer exited with code ${code}.`));
                }
            });
        });
    } catch (error) {
        logger.error(`Error running CUDA installer:`, error);
        io.to(id).emit("installDep", {
            type: "error",
            content: `Fatal error during CUDA installation: ${error}`,
        });
        return { success: false };
    }

    return { success: true };
}

export async function uninstall(_binFolder: string): Promise<void> {
    const platform = getOS();
    let cudaPath: string | undefined;

    if (platform === "windows") {
        cudaPath = expectedWindowsPath;
    } else if (platform === "linux") {
        cudaPath = expectedLinuxPath;
    } else {
        logger.warn("Uninstall of CUDA not supported on this platform via script.");
        return;
    }

    if (fs.existsSync(cudaPath)) {
        logger.warn(`Removing CUDA installation directory: ${cudaPath}`);
        await rmdir(cudaPath, { recursive: true }, (err) => {
            if (err) {
                logger.error(`Error removing CUDA directory:`, err);
            } else {
                logger.info(`CUDA directory removed successfully.`);
            }
        });
        if (platform === "windows") {
            removeValue(expectedWindowsPath, "PATH");
            removeKey("CUDA_HOME");
        } else if (platform === "linux") {
             removeValue(path.join(expectedLinuxPath, "bin"), "PATH");
             removeKey("CUDA_HOME");
        }
        
        logger.info(`Environment variables for CUDA ${cudaVersion} removed.`);
    }
}

