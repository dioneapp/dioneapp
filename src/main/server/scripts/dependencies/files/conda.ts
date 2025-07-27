import { execFile, spawn } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";
import type { Server } from "socket.io";
import { getArch, getOS } from "../utils/system";
import { addValue, getAllValues, removeValue } from "../environment";
import logger from "../../../utils/logger";

const depName = "conda";
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
            execFile(depName, ["--version"], { env: ENVIRONMENT }, (error, stdout) => {
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
            amd64: "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh",
            arm64: "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh"
        },
        macos: {
            amd64: "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh",
            arm64: "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh"
        },
        windows: {
            amd64: "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe",
            x86: "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86.exe"
        },
    }

    const url = urls[platform]?.[arch];
    if (!fs.existsSync(tempDir)) {
        // if temp dir does not exist, create it
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const installerExt = platform === "windows" ? "exe" : "sh";
    const installerFile = fs.createWriteStream(path.join(tempDir, `${depName}-${platform}-${arch}.${installerExt}`));

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

    const exe = path.join(tempDir, `${depName}-${platform}-${arch}.${installerExt}`);
    const commands: Record<string, { file: string, args: string[] }> = {
        linux: {
            file: 'bash',
            args: [`${exe} -b -u -p ${depFolder}`]
        },
        macos: {
            file: 'bash',
            args: [`${exe} -b -u -p ${depFolder}`]
        },
        windows: {
            file: exe,
            args: [
                '/InstallationType=JustMe',
                '/RegisterPython=0',
                '/S',
                '/D=' + depFolder,
            ]
        }
    };

    // 2. run the installer/ command line method
    const command = commands[platform];
    if (!command) {
        io.to(id).emit("installDep", {
            type: "error",
            content: `Unsupported platform: ${platform}`
        });
        return { success: false };
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

                    // update environment variables
                    if (platform === "windows") {
                        const cacheDir = path.join(binFolder, "cache");
                        addValue("CONDA_PKGS_DIRS", cacheDir);
                        addValue(
                            "CONDA_EXE",
                            platform === "windows"
                                ? path.join(depFolder, "Scripts", "conda.exe")
                                : path.join(depFolder, "bin", "conda")
                        );
                        addValue("PATH", path.join(depFolder));
                        addValue("PATH", path.join(depFolder, 'Scripts'));
                    } else {
                        // linux/macos
                        addValue("PATH", path.join(depFolder, "bin"));
                        addValue("GIT_EXEC_PATH", path.join(depFolder, "libexec", "git-core"));
                        addValue("GIT_TEMPLATE_DIR", path.join(depFolder, "share", "git-core", "templates"));
                    }

                    try {
                        // execute conda init
                        const condaExecutable =
                            platform === "windows"
                                ? path.join(depFolder, "Scripts", "conda.exe")
                                : path.join(depFolder, "bin", "conda");
                        execFile(condaExecutable, ["init"], spawnOptions, (error) => {
                            if (error) {
                                logger.error(`Error initializing conda: ${error}`);
                                reject(new Error(`Error initializing conda: ${error}`));
                            } else {
                                io.to(id).emit("installDep", {
                                    type: "log",
                                    content: `Conda initialized successfully`
                                });

                                resolve();
                            }
                        });
                    } catch (error) {
                        logger.error(`Error running conda init: ${error}`);
                        io.to(id).emit("installDep", {
                            type: "error",
                            content: `Error running conda init: ${error}`
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
                content: `Error running installer for ${depName}: ${error}`
            });
            return { success: false };
        }

    return { success: true };
}

export async function uninstall(binFolder: string): Promise<void> {
    const depFolder = path.join(binFolder, depName);
    if (fs.existsSync(depFolder)) {
        fs.rmSync(depFolder, { recursive: true, force: true });
        logger.info(`Removing ${depName} from environment variables...`);
        if (getOS() === "windows") {
            removeValue(path.join(depFolder), "PATH");
            removeValue(path.join(depFolder, "Scripts"), "PATH");
            removeValue(path.join(depFolder, "Library", "bin"), "PATH");
            removeValue("CONDA_PKGS_DIRS", path.join(binFolder, "cache"));
            removeValue("CONDA_EXE", path.join(depFolder, "Scripts", "conda.exe"));
        } else {
            removeValue(path.join(depFolder, "bin"), "PATH");
            removeValue(path.join(depFolder, "libexec", "git-core"), "GIT_EXEC_PATH");
            removeValue(path.join(depFolder, "share", "git-core", "templates"), "GIT_TEMPLATE_DIR");
        }

        logger.info(`${depName} uninstalled successfully`);
    } else {
        throw new Error(`Dependency ${depName} is not installed`);
    }
}