import { execFile, spawn } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";
import type { Server } from "socket.io";
import { getArch, getOS } from "../utils/system";
import { addValue, getAllValues, removeKey, removeValue } from "../environment";
import logger from "../../../utils/logger";

const depName = "pnpm";
const ENVIRONMENT = getAllValues();

export async function isInstalled(binFolder: string): Promise<{ installed: boolean; reason: string; }> {
    const depFolder = path.join(binFolder, depName);
    const ENVIRONMENT = getAllValues(); 

    if (
        !fs.existsSync(depFolder) ||
        fs.readdirSync(depFolder).length === 0
    ) {
        return { installed: false, reason: `not-installed` };
    }

    try {
        await new Promise<string>((resolve, reject) => {
            execFile(depName, ["-v"], { env: ENVIRONMENT }, (error, stdout) => {
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

export async function install(binFolder: string, id: string, io: Server): Promise<{success: boolean}> {
    const depFolder = path.join(binFolder, depName);
    const tempDir = path.join(binFolder, "temp");

    const platform = getOS(); // window, linux, macos
    const arch = getArch(); // amd64, arm64, x86


    if (!fs.existsSync(depFolder)) {
        fs.mkdirSync(depFolder, { recursive: true });
    }

    const urls: Record<string, Record<string, string>> = {
        linux: {
            amd64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-linux-x64",
            arm64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-linux-arm64"
        },
        macos: {
            amd64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-macos-x64",
            arm64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-macos-arm64"
        },
        windows: {
            amd64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-win-x64.exe",
            arm64: "https://github.com/pnpm/pnpm/releases/download/v10.13.1/pnpm-win-arm64.exe",
        },
    }

    const url = urls[platform]?.[arch];
    if (!fs.existsSync(tempDir)) {
        // if temp dir does not exist, create it
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const installerExt = platform === "windows" ? "exe" : "";
    const installerFile = fs.createWriteStream(path.join(depFolder, `pnpm.${installerExt}`));

    if (url) {
        // 1. url method: install the dependency using official installer url
        io.to(id).emit("installDep", {
            type: "log",
            content: `Downloading ${depName} for ${platform} (${arch}) using URL method...`
        });

        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        };

        await new Promise<void>((resolve, reject) => {
            https.get(url, options, (response) => {
                if ([301, 302].includes(response.statusCode ?? 0)) {
                    const redirectUrl = response.headers.location;
                    if (redirectUrl) {
                        https.get(redirectUrl, (redirectResponse) => {
                            redirectResponse.pipe(installerFile);
                            installerFile.on("close", resolve);
                            installerFile.on("error", reject);
                        }).on("error", reject);
                    } else {
                        reject(new Error("Redirect URL not found"));
                    }
                } else if (response.statusCode === 200) {
                    io.to(id).emit("installDep", {
                        type: "log",
                        content: `${depName} installer downloaded successfully`
                    });
                    response.pipe(installerFile);
                    installerFile.on("close", resolve);
                    installerFile.on("error", reject);
                } else {
                    reject(new Error(`HTTP ${response.statusCode}`));
                }
            }).on("error", reject);
        });
    } else {
        io.to(id).emit("installDep", {
            type: "error",
            content: `No download URL found for ${depName} on ${platform} (${arch})`
        });

        return { success: false };
    }

    io.to(id).emit("installDep", {
        type: "log",
        content: `Running installer for ${depName}...`
    });

    const commands: Record<string, { file: string, args: string[] }> = {
    };

    // 2. run the installer/ command line method
    const command = commands[platform];
    if (!command && !urls[platform]?.[arch]) {
        io.to(id).emit("installDep", {
            type: "error",
            content: `Unsupported platform: ${platform}`
        });
        return { success: false };
    }

    if (!command && urls[platform]?.[arch]) {
        io.to(id).emit("installDep", {
            type: "log",
            content: `Successfully downloaded ${depName} for ${platform} (${arch}) using URL method`
        });

        addValue("PATH", path.join(depFolder, 'pnpm.exe'));
        addValue("XDG_CACHE_HOME", path.join(binFolder, "cache", depName));
        addValue("XDG_STATE_HOME", path.join(binFolder, "state", depName));
        addValue("XDG_DATA_HOME", path.join(binFolder, "cache", depName));
        
        return { success: true };
    }

    io.to(id).emit("installDep", {
        type: "log",
        content: `Running command: ${command.file} ${command.args.join(" ")}`
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
                io.to(id).emit("installDep", { type: "error", content: data.toString() });
                logger.error(`Error during installation of ${depName}: ${data.toString()}`);
            });

            child.on("close", (code) => {
                console.log(`Installer exited with code ${code}`);
                if (code === 0) {
                    io.to(id).emit("installDep", {
                        type: "log",
                        content: `${depName} installed successfully`
                    });

                    if (getOS() === "windows") {
                        try {
                            // move from node-v22.17.1-win-x64 to binFolder
                            io.to(id).emit("installDep", {
                                type: "log",
                                content: `Moving Node.js files to ${binFolder}/${depName}...`
                            });
                            const tempFolder = path.join(binFolder, depName, `node-v22.17.1-win-${arch == "amd64" ? "x64" : arch}`);
                            fs.cpSync(tempFolder, path.join(binFolder, depName), { recursive: true, force: true });
                            fs.rmSync(tempFolder, { recursive: true, force: true });
                        } catch (error) {
                            logger.error(`Error moving Node.js files:`, error);
                            io.to(id).emit("installDep", {
                                type: "error",
                                content: `Error moving Node.js files: ${error}`
                            });
                            reject(error);
                        }
                    }
                    
                    // update environment variables
                    const cacheDir = path.join(binFolder, "cache", depName);
                    addValue("PATH", path.join(depFolder));
                    addValue("NPM_CONFIG_CACHE", path.join(cacheDir));

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
                content: `Error running installer for ${depName}: ${error}`
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
        removeKey("XDG_CACHE_HOME");
        removeKey("XDG_STATE_HOME");
        removeKey("XDG_DATA_HOME");
        logger.info(`${depName} uninstalled successfully`);
    }
}