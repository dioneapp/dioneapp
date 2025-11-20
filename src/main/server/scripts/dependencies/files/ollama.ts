import type { Server } from "socket.io";
import { getArch, getOS } from "../utils/system";
import fs, { createWriteStream } from "fs";
import path from "path";
import { addValue, getAllValues, removeKey } from "../environment";
import logger from "../../../utils/logger";
import { execFile, spawn } from "child_process";

const depName = "ollama";

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
                ["-v"],
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

    const urls: Record<string, Record<string, string>> = {
        linux: {
            amd64:
                "https://ollama.com/download/ollama-linux-amd64.tgz",
            arm64:
                "https://ollama.com/download/ollama-linux-arm64.tgz"
        },
        macos: {
            amd64:
                "https://ollama.com/download/Ollama.dmg",
            arm64:
                "https://ollama.com/download/Ollama.dmg",
        },
        windows: {
            amd64:
                "https://ollama.com/download/ollama-windows-amd64.zip",
            arm64:
                "https://ollama.com/download/ollama-windows-arm64.zip"
        },
    };

    const url = urls[platform]?.[arch];
    if (!fs.existsSync(tempDir)) {
        // if temp dir does not exist, create it
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const installerExt = platform === "windows" ? "zip" : platform === "macos" ? "dmg" : "tgz";

    if (url) {
        // 1. url method: install the dependency using official installer url
        io.to(id).emit("installDep", {
            type: "log",
            content: `Downloading ${depName} for ${platform} (${arch}) using URL method...`,
        });

        await downloadFile(
            url,
            path.join(tempDir, `${depName}-${platform}-${arch}.${installerExt}`),
            (p) => {
                io.to(id).emit("installDep", {
                    type: "log",
                    content: `Downloading: ${(p * 100).toFixed(2)}%`
                });
            }
        );

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

    if (!fs.existsSync(depFolder)) {
        fs.mkdirSync(depFolder, { recursive: true });
    }

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
            file: "powershell",
            args: [
                "-Command",
                `Expand-Archive -Path '${exe}' -DestinationPath '${depFolder}' -Force`
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

    const ENVIRONMENT = getAllValues();
    const spawnOptions = {
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

                    // create models dir if it does not exist
                    if (!fs.existsSync(path.join(depFolder, "models"))) {
                        fs.mkdirSync(path.join(depFolder, "models"), { recursive: true });
                    }

                    addValue("PATH", path.join(depFolder));
                    addValue("OLLAMA_MODELS", path.join(depFolder, "models"));
                    addValue("OLLAMA_HOST", "http://localhost:11434");
                    addValue("OLLAMA_CACHE", cacheDir);
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
        removeKey("PATH");
        removeKey("OLLAMA_MODELS");
        removeKey("OLLAMA_HOST");
        removeKey("OLLAMA_CACHE");

        logger.info(`${depName} uninstalled successfully`);
    }
}

export async function downloadFile(url, dest, onProgress) {
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://ollama.com/"
        }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!res.body) throw new Error("Response body is null");

    const total = Number(res.headers.get("content-length")) || 0;
    let downloaded = 0;

    const reader = res.body.getReader();
    const file = createWriteStream(dest);

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        file.write(value);
        downloaded += value.length;

        if (onProgress && total > 0) onProgress(downloaded / total);
    }

    file.end();

    if (downloaded === 0) throw new Error("Downloaded 0 bytes");
}
