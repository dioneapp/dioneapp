import fs from "node:fs";
import path from "node:path";
import { readConfig as userConfig } from "@/config";
import {
    addValue,
    getAllValues,
} from "@/server/scripts/dependencies/environment";
import { getArch, getOS } from "@/server/scripts/dependencies/utils/system";
import { getSystemInfo } from "@/server/scripts/system";
import logger from "@/server/utils/logger";
import { app } from "electron";

// commands to create virtual environment
export async function createVirtualEnvCommands(
    envName: string,
    commands: string[] | any[],
    baseDir: string,
    pythonVersion: string,
    envType = "uv",
) {
    const isWindows = process.platform === "win32";
    const currentPlatform = process.platform;
    const { gpu: currentGpu } = await getSystemInfo();
    const envPath = path.join(baseDir, envName);

    // filter and ensure commands is an array of strings without empty strings
    const commandStrings = Array.isArray(commands)
        ? commands.flatMap((cmd) => {
            if (typeof cmd === "string" && cmd.trim()) {
                return [cmd.trim()];
            }
            if (
                cmd &&
                typeof cmd === "object" &&
                typeof cmd.command === "string" &&
                cmd.command.trim()
            ) {
                // Apply platform filtering
                if ("platform" in cmd) {
                    const cmdPlatform = cmd.platform.toLowerCase();
                    const normalizedPlatform =
                        currentPlatform === "win32"
                            ? "windows"
                            : currentPlatform === "darwin"
                                ? "mac"
                                : currentPlatform === "linux"
                                    ? "linux"
                                    : currentPlatform;

                    // if platform does not match current platform, skip
                    if (cmdPlatform !== normalizedPlatform) {
                        logger.info(
                            `Skipping command for platform ${cmdPlatform} on current platform ${currentPlatform}`,
                        );
                        return [];
                    }
                }

                // Apply GPU filtering
                if ("gpus" in cmd) {
                    const allowedGpus = Array.isArray(cmd.gpus)
                        ? cmd.gpus.map((g: string) => g.toLowerCase())
                        : [cmd.gpus.toLowerCase()];

                    if (!allowedGpus.includes(currentGpu.toLowerCase())) {
                        logger.info(
                            `Skipping command for GPU ${allowedGpus.join(", ")} on current ${currentGpu} GPU`,
                        );
                        return [];
                    }
                }

                return [cmd.command.trim()];
            }
            return [];
        })
        : [];

    // add python version flag if specified
    const pythonFlag = pythonVersion ? `--python ${pythonVersion}` : "";
    // join commands without leading/trailing separators; add separators conditionally where used
    const middle =
        commandStrings.length > 1
            ? commandStrings.join(" && ")
            : commandStrings[0] || "";

    // variables
    const variables = getAllValues();
    const config = userConfig();

    if (envType === "conda") {
        const pythonArg = pythonVersion ? `python=${pythonVersion}` : "";
        const condaW = path.join(
            config?.defaultBinFolder || path.join(app.getPath("userData")),
            "bin",
            "conda",
            "condabin",
            "conda.bat",
        );
        const condaU = path.join(
            config?.defaultBinFolder || path.join(app.getPath("userData")),
            "bin",
            "conda",
            "bin",
            "activate",
        );
        const condaUC = path.join(
            config?.defaultBinFolder || path.join(app.getPath("userData")),
            "bin",
            "conda",
            "bin",
            "conda",
        );
        if (isWindows) {
            const between = middle ? ` && ${middle} && ` : " && ";
            return [
                `if not exist "${envPath}" (call "${condaW}" create -p "${envPath}" ${pythonArg} -y)`,
                `call "${condaW}" activate "${envPath}"${between}call "${condaW}" deactivate`,
            ];
        }
        // for linux and mac
        {
            const between = middle ? ` && ${middle} && ` : " && ";
            return [
                `if [ ! -d "${envPath}" ]; then "${condaUC}" create -p "${envPath}" ${pythonArg} -y; fi`,
                `. "${condaU}" "${envPath}"${between}conda deactivate`,
            ];
        }
    }

    // default uv env
    if (isWindows && envType !== "conda") {
        const activateScript = path.join(envPath, "Scripts", "activate");
        const deactivateScript = path.join(envPath, "Scripts", "deactivate.bat");
        if (!variables.PATH.includes(path.join(envPath, "Scripts"))) {
            addValue("PATH", path.join(envPath, "Scripts"));
        }
        {
            const between = middle ? ` && ${middle} && ` : " && ";
            return [
                `if not exist "${envPath}" (uv venv ${pythonFlag} "${envName}")`,
                `call "${activateScript}"${between}call "${deactivateScript}"`,
            ];
        }
    }

    // for linux and mac
    const activateScript = path.join(envPath, "bin", "activate");
    if (!variables.PATH.includes(path.join(envPath, "Scripts"))) {
        addValue("PATH", path.join(envPath, "Scripts"));
    }

    const existsEnv = fs.existsSync(envPath);
    const arch = getArch();
    const platform = getOS();
    const uvFolder =
        platform === "linux"
            ? arch === "amd64"
                ? "uv-x86_64-unknown-linux-gnu"
                : "uv-aarch64-unknown-linux-gnu"
            : platform === "macos"
                ? arch === "amd64"
                    ? "uv-x86_64-apple-darwin"
                    : "uv-aarch64-apple-darwin"
                : "";

    const uvPath = path.join(
        config?.defaultBinFolder || path.join(app.getPath("userData")),
        "bin",
        "uv",
        uvFolder,
        process.platform === "win32" ? "uv.exe" : "uv",
    );

    if (!existsEnv) {
        {
            const between = middle ? ` && ${middle} && ` : " && ";
            return [
                // create new env
                `"${uvPath}" venv ${pythonFlag} "${envPath}"`,
                // use it
                `. "${activateScript}"${between}deactivate`,
            ];
        }
    }
    const between = middle ? ` && ${middle} && ` : " && ";
    return [
        // use existing env
        `. "${activateScript}"${between}deactivate`,
    ];
}
