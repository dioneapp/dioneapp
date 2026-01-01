import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { getAllValues } from "@/server/scripts/dependencies/environment";
import logger from "@/server/utils/logger";
import type { Server } from "socket.io";

function getCondaConfig() {
    const env = getAllValues();
    const condaExe = env.CONDA_EXE;
    const condaRoot = env.CONDA_ROOT;
    return { condaExe, condaRoot, env };
}

export function getCondaEnv() {
    const { condaRoot, env } = getCondaConfig();
    if (!condaRoot) return env;

    const separator = process.platform === "win32" ? ";" : ":";
    const currentPath = env.PATH || "";
    const prepend = (p: string, existing: string) =>
        p ? `${p}${separator}${existing}` : existing;

    let newPath = currentPath;
    if (process.platform === "win32") {
        newPath = prepend(path.join(condaRoot, "Scripts"), newPath);
        newPath = prepend(path.join(condaRoot, "Library", "bin"), newPath);
        newPath = prepend(path.join(condaRoot, "bin"), newPath);
        newPath = prepend(path.join(condaRoot), newPath);
    } else {
        newPath = prepend(path.join(condaRoot, "bin"), newPath);
    }

    return { ...env, PATH: newPath };
}

export function checkCondaBinary(binaryName: string): boolean {
    const { condaRoot } = getCondaConfig();
    if (!condaRoot) return false;

    const possiblePaths =
        process.platform === "win32"
            ? [
                path.join(condaRoot, binaryName),
                path.join(condaRoot, `${binaryName}.exe`),
                path.join(condaRoot, "Scripts", binaryName),
                path.join(condaRoot, "Scripts", `${binaryName}.exe`),
                path.join(condaRoot, "bin", binaryName),
                path.join(condaRoot, "bin", `${binaryName}.exe`),
                path.join(condaRoot, "Library", "bin", binaryName),
                path.join(condaRoot, "Library", "bin", `${binaryName}.exe`),
            ]
            : [path.join(condaRoot, "bin", binaryName)];

    return possiblePaths.some((p) => fs.existsSync(p));
}

function log(io: Server, id: string, type: "log" | "error", content: string) {
    if (type === "error") logger.error(content);
    io.to(id).emit("installDep", { type, content });
}

async function runSpawn(
    cmd: string,
    args: string[],
    env: any,
    io: Server,
    id: string,
    cwd?: string,
): Promise<boolean> {
    return new Promise((resolve) => {
        const child = spawn(cmd, args, { env, shell: true, cwd });
        child.stdout.on("data", (d) => log(io, id, "log", d.toString()));
        child.stderr.on("data", (d) => log(io, id, "log", d.toString()));
        child.on("close", (code) => {
            if (code !== 0) {
                log(io, id, "error", `Command exited with code ${code}`);
            }
            resolve(code === 0);
        });
        child.on("error", (e) => {
            log(io, id, "error", e.message);
            resolve(false);
        });
    });
}

export async function runInstall(
    packageName: string,
    args: string[],
    io: Server,
    id: string,
    cwd?: string,
): Promise<boolean> {
    const { condaExe, env } = getCondaConfig();
    if (!condaExe || !fs.existsSync(condaExe)) {
        log(io, id, "error", "Conda executable not found");
        return false;
    }

    log(io, id, "log", `Installing ${packageName} via Conda...`);
    // conda install -y <args> <packageName>
    const allArgs = ["install", "-y", ...args, packageName];

    return runSpawn(condaExe, allArgs, env, io, id, cwd);
}

export async function runRemove(
    packageName: string,
    io: Server,
    id?: string,
): Promise<void> {
    const { condaExe, env } = getCondaConfig();
    if (!condaExe || !fs.existsSync(condaExe)) return;

    if (id) {
        await runSpawn(
            condaExe,
            ["remove", packageName, "-y"],
            env,
            io,
            id,
        );
    } else {
        try {
            await new Promise<void>((resolve) => {
                const child = spawn(condaExe, ["remove", packageName, "-y"], {
                    env,
                    shell: true,
                });
                child.on("close", () => resolve());
            });
        } catch (e) {
        }
    }
}

export async function runCommand(
    command: string,
    args: string[],
    io: Server,
    id: string,
    cwd?: string,
): Promise<boolean> {
    const env = getCondaEnv();
    log(io, id, "log", `Running ${command} inside Conda env...`);
    return runSpawn(command, args, env, io, id, cwd);
}
