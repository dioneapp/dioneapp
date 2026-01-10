import fs from "node:fs";
import path from "node:path";
import { executeCommand, executeCommands, log } from "./process";
import { readDioneConfig } from "./dependencies/dependencies";
import { createVirtualEnvCommands } from "./dependencies/env-utils";
import { Server } from "socket.io";

export async function updateScript(
    workingDir: string,
    dioneFile: any,
    io: Server,
    id: string,
) {
    const dione = await readDioneConfig(dioneFile);
    const dependencies = Object.keys(dione.dependencies || {});

    let projectDir = workingDir;

    log(io, id, "INFO: Starting update process...");

    if (dependencies.includes("git")) {
        // Check if git repository is in current directory or subdirectory
        if (!fs.existsSync(path.join(projectDir, ".git"))) {
            try {
                const entries = fs.readdirSync(projectDir, { withFileTypes: true });
                const gitDir = entries.find(entry =>
                    entry.isDirectory() && fs.existsSync(path.join(projectDir, entry.name, ".git"))
                );
                if (gitDir) {
                    projectDir = path.join(projectDir, gitDir.name);
                    log(io, id, `INFO: Found git repository in ${gitDir.name}`);
                }
            } catch (error) {
                log(io, id, `WARN: Error searching for git repository: ${error}`);
            }
        }

        log(io, id, "INFO: pulling latest changes...");
        const gitPull = await executeCommand("git pull", io, projectDir, id);

        if (gitPull.code !== 0) {
            log(io, id, `ERROR: Git pull failed: ${gitPull.stderr}`);
            return false;
        }

        if (gitPull.stdout.includes("Already up to date.")) {
            log(io, id, "INFO: Code is already up to date.");
        } else {
            log(io, id, "INFO: Code updated successfully.");
        }
    }

    const env = dione.env || {};
    const envName = env.name || "env";
    const envType = env.type || "uv";

    // Check for dependency definitions
    const reqTxt = path.join(projectDir, "requirements.txt");
    const pyToml = path.join(projectDir, "pyproject.toml");
    const envYml = path.join(projectDir, "environment.yml");

    const updateCommands: string[] = [];

    if (fs.existsSync(reqTxt)) {
        if (envType === "uv") {
            updateCommands.push(`uv pip install -U -r requirements.txt`);
        } else if (envType === "conda") {
            updateCommands.push(`pip install -U -r requirements.txt`);
        } else { // venv
            updateCommands.push(`pip install -U -r requirements.txt`);
        }
    }

    if (fs.existsSync(pyToml) && envType === "uv") {
        updateCommands.push(`uv pip install -U .`);
    }

    if (fs.existsSync(envYml) && envType === "conda") {
        updateCommands.push(`conda env update --file environment.yml --prune`);
    }

    if (updateCommands.length === 0) {
        log(io, id, "INFO: No standard dependency files found (requirements.txt, etc.). Skipping dependency update.");
        return true;
    }

    log(io, id, `INFO: Updating dependencies using ${envType}...`);

    // execute with virtual environment
    try {
        const wrappedCommands = await createVirtualEnvCommands(
            envName,
            updateCommands,
            workingDir,
            "",
            envType
        );

        const result = await executeCommands(
            wrappedCommands,
            projectDir,
            io,
            id,
            false,
        );

        if (result.cancelled) {
            log(io, id, "INFO: Update cancelled.");
            return false;
        }

        log(io, id, "INFO: Dependencies updated successfully.");
        return true;

    } catch (error: any) {
        log(io, id, `ERROR: Dependency update failed: ${error.message}`);
        return false;
    }
}
