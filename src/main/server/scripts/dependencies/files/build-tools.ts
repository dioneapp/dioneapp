import child_process from "node:child_process";
import fs from "node:fs";
import path from "path";
import {
	ensureBuildToolsInstalled,
	verifyBuildToolsPaths,
} from "@/server/scripts/dependencies/utils/build-tools";
import { getOS } from "@/server/scripts/dependencies/utils/system";
import logger from "@/server/utils/logger";
import type { Server } from "socket.io";

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
	_required_v?: string,
	signal?: AbortSignal,
): Promise<{ success: boolean }> {
	const emit = createSocketEmitter(io, id);

	if (getOS() !== "windows") {
		emit(
			"log",
			"Build tools are not required on this platform. Skipping installation.",
		);
		broadcastDiagnostics(io, id, {
			status: "already-installed",
			summary: "Build tools are not required on non-Windows platforms.",
			logs: [],
		});
		return { success: true };
	}

	const result = await ensureBuildToolsInstalled({
		binFolder,
		signal,
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
	const vsExePath = path.join(
		"C:",
		"Program Files (x86)",
		"Microsoft Visual Studio",
		"Installer",
		"vs_installer.exe",
	);

	// check if vs_installer.exe exists before proceeding
	if (!fs.existsSync(vsExePath)) {
		const msg = `Build Tools uninstall could not find vs_installer.exe at path: ${vsExePath}`;
		logger.error(msg);
		throw new Error(msg);
	}

	const uninstallArgs = [
		"uninstall",
		"--installPath",
		installPath,
		"--quiet",
		"--norestart",
	];

	try {
		const quotedExe = `"${vsExePath}"`;
		const psCommand = `Start-Process -FilePath ${quotedExe} -ArgumentList '${uninstallArgs.map((s) => s.replace(/'/g, "''")).join("','")}' -Wait -Verb RunAs`;

		const spawnResult = child_process.spawnSync(
			"powershell.exe",
			[
				"-NoLogo",
				"-NoProfile",
				"-ExecutionPolicy",
				"Bypass",
				"-Command",
				psCommand,
			],
			{
				stdio: "inherit",
				shell: false,
				windowsHide: false,
			},
		);

		if (spawnResult.error) {
			logger.error(
				`Build Tools uninstall failed to start: ${spawnResult.error}`,
			);
			throw new Error(
				`Build Tools uninstall failed to start: ${spawnResult.error instanceof Error ? spawnResult.error.message : String(spawnResult.error)}`,
			);
		}
		if (typeof spawnResult.status === "number" && spawnResult.status !== 0) {
			let stderrMsg = "";
			if (spawnResult.stderr) {
				try {
					stderrMsg =
						typeof spawnResult.stderr === "string"
							? spawnResult.stderr
							: spawnResult.stderr.toString();
				} catch {
					/* ignore */
				}
			}
			logger.error(
				`Build Tools uninstall failed with exit code ${spawnResult.status}` +
					(stderrMsg ? `: ${stderrMsg}` : ""),
			);
			throw new Error(
				`vs_installer.exe uninstall failed with exit code ${spawnResult.status}` +
					(stderrMsg ? `: ${stderrMsg}` : ""),
			);
		}
		logger.info("Build Tools uninstall completed successfully.");
	} catch (e: any) {
		logger.error(
			`Exception while running uninstall: ${e && e.message ? e.message : e}`,
		);
		throw new Error(
			`Build Tools uninstall command failed: ${e && e.message ? e.message : e}`,
		);
	}
}
