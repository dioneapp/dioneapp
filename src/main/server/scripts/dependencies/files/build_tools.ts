import path from "path";
import type { Server } from "socket.io";
import logger from "../../../utils/logger";
import {
    ensureBuildToolsInstalled,
    uninstallManagedBuildTools,
    verifyBuildToolsPaths,
} from "../utils/build-tools";
import { getOS } from "../utils/system";

const depName = "build_tools";

type InstallEventType = "log" | "error";

type SocketEmitter = (type: InstallEventType, message: string) => void;

function createSocketEmitter(io: Server, id: string): SocketEmitter {
    return (type: InstallEventType, message: string) => {
        if (!message) return;
        const content = message.endsWith("\n") ? message : `${message}\n`;
        io.to(id).emit("installDep", { type, content });
    };
}

function broadcastDiagnostics(
    io: Server,
    id: string,
    payload: Record<string, unknown>,
) {
    io.to(id).emit("dependencyDiagnostics", {
        dependency: depName,
        ...payload,
    });
}

export async function isInstalled(
    binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
    if (getOS() !== "windows") {
        return { installed: true, reason: "not-required" };
    }

    const installPath = path.join(binFolder, depName);
    const verification = verifyBuildToolsPaths(installPath);

    if (verification) {
        return { installed: true, reason: "installed" };
    }

    return { installed: false, reason: "not-installed" };
}

export async function install(
    binFolder: string,
    id: string,
    io: Server,
): Promise<{ success: boolean }> {
    const emit = createSocketEmitter(io, id);

    if (getOS() !== "windows") {
        emit("log", "Build tools are not required on this platform. Skipping installation.");
        broadcastDiagnostics(io, id, {
            status: "already-installed",
            summary: "Build tools are not required on non-Windows platforms.",
            logs: [],
        });
        return { success: true };
    }

    const result = await ensureBuildToolsInstalled({
        binFolder,
        onLog: (message, level) => {
            if (!message) return;
            if (level === "error") {
                emit("error", message);
            } else if (level === "warn") {
                emit("log", `[warn] ${message}`);
            } else {
                emit("log", message);
            }
        },
    });

    const { verification } = result;

    if (result.logs && result.logs.length > 0) {
        emit("log", "Installer generated the following log files:");
        for (const logPath of result.logs) {
            emit("log", `  • ${logPath}`);
        }
        emit(
            "log",
            "You can share these logs with support if the installation fails.",
        );
    }

    if (result.needsReboot) {
        emit(
            "log",
            "A system restart is required to finalize the Visual Studio Build Tools installation.",
        );
    }

    if (result.status === "failed") {
        emit("error", result.summary);
    } else {
        emit("log", result.summary);
    }

    if (verification) {
        emit("log", `cl.exe located at: ${verification.clPath}`);
        emit("log", `cmake.exe located at: ${verification.cmakePath}`);
    }

    broadcastDiagnostics(io, id, {
        status: result.status,
        exitCode: result.exitCode,
        needsReboot: Boolean(result.needsReboot),
        uacCancelled: Boolean(result.uacCancelled),
        summary: result.summary,
        logs: result.logs,
        sdkVersion: result.sdkVersion,
        installPath: verification?.installPath,
        vcvarsPath: verification?.vcvarsPath,
        clPath: verification?.clPath,
        cmakePath: verification?.cmakePath,
        msvcVersion: verification?.msvcVersion,
    });

    const success = result.status !== "failed";
    return { success };
}

export async function uninstall(binFolder: string): Promise<void> {
    if (getOS() !== "windows") {
        return;
    }

    const installPath = path.join(binFolder, depName);
    const result = await uninstallManagedBuildTools(installPath, (message, level) => {
        if (level === "error") {
            logger.error(message);
        } else if (level === "warn") {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    if (result.status === "failed") {
        throw new Error(result.summary);
    }
}
