import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import logger from "../../../utils/logger";

type LogLevel = "info" | "warn" | "error";

type LogSink = (message: string, level?: LogLevel) => void;

export interface BuildToolsVerification {
    installPath: string;
    vcvarsPath: string;
    clPath: string;
    cmakePath: string;
    msvcVersion?: string;
}

export interface BuildToolsEnsureResult {
    status: "already-installed" | "installed" | "failed" | "uninstalled";
    exitCode?: number;
    needsReboot?: boolean;
    uacCancelled?: boolean;
    summary: string;
    logs: string[];
    error?: string;
    sdkVersion?: string;
    verification?: BuildToolsVerification;
}

interface EnsureBuildToolsOptions {
    binFolder: string;
    onLog?: LogSink;
    preferredSdk?: string;
}

interface InstallAttemptResult {
    exitCode: number;
    needsReboot: boolean;
    uacCancelled: boolean;
    sdkVersion: string;
    summary: string;
    logs: string[];
    success: boolean;
    error?: string;
}

const BUILD_TOOLS_URL = "https://aka.ms/vs/17/release/vs_BuildTools.exe";
const DEFAULT_SDK = "22621";
const FALLBACK_SDK = "19041";

function logMessage(onLog: LogSink | undefined, message: string, level: LogLevel = "info") {
    if (onLog) {
        onLog(message, level);
    }

    switch (level) {
        case "error":
            logger.error(message);
            break;
        case "warn":
            logger.warn(message);
            break;
        default:
            logger.info(message);
    }
}

function isWindows(): boolean {
    return process.platform === "win32";
}

function ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function isProcessElevated(): boolean {
    if (!isWindows()) return true;
    try {
        const output = execSync(
            "powershell -NoProfile -Command \"[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)\"",
            { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
        );
        return output.trim().toLowerCase() === "true";
    } catch (error) {
        logger.warn(`Failed to determine elevation status: ${error}`);
        return false;
    }
}

function formatArgumentsForPowerShell(args: string[]): string {
    const lines = args
        .map((arg) => {
            const escaped = arg.replace(/`/g, "``").replace(/"/g, '""');
            return `\t\"${escaped}\"`;
        })
        .join(",\n");
    return `@(\n${lines}\n)`;
}

interface RunElevatedResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    uacCancelled: boolean;
}

function runBuildToolsInstallerElevated(
    installerPath: string,
    args: string[],
    onLog?: LogSink,
): RunElevatedResult {
    if (!isWindows()) {
        throw new Error("Attempted to run elevated installer on non-Windows platform");
    }

    const tempScriptPath = path.join(
        os.tmpdir(),
        `dione_vs_buildtools_install_${Date.now()}_${Math.random().toString(16).slice(2)}.ps1`,
    );

    const argList = formatArgumentsForPowerShell(args);
    const scriptContent = `
$ErrorActionPreference = 'Stop'
$arguments = ${argList}
try {
    $process = Start-Process -FilePath "${installerPath}" -ArgumentList $arguments -Verb RunAs -Wait -PassThru
    if ($process.ExitCode -ne $null) {
        exit $process.ExitCode
    } else {
        exit 0
    }
} catch {
    $code = $_.Exception.HResult
    if ($code -eq 0x800704C7) { exit 1223 }
    throw
}
`.trim();

    fs.writeFileSync(tempScriptPath, scriptContent, { encoding: "utf8" });

    try {
        const result = spawnSync(
            "powershell",
            ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", tempScriptPath],
            { windowsHide: true, encoding: "utf8" },
        );

        const exitCode = typeof result.status === "number" ? result.status : result.signal ? 1 : 0;
        const stdout = result.stdout?.toString() ?? "";
        const stderr = result.stderr?.toString() ?? "";
        const uacCancelled = exitCode === 1223;

        if (result.error) {
            logMessage(onLog, `Failed to launch installer elevated: ${result.error}`, "error");
        }

        return { exitCode, stdout, stderr, uacCancelled };
    } finally {
        try {
            fs.unlinkSync(tempScriptPath);
        } catch (error) {
            logger.warn(`Failed to remove temporary script ${tempScriptPath}: ${error}`);
        }
    }
}

function runInstallerDirect(
    installerPath: string,
    args: string[],
    onLog?: LogSink,
): RunElevatedResult {
    const result = spawnSync(installerPath, args, {
        windowsHide: true,
        encoding: "utf8",
    });

    const exitCode = typeof result.status === "number" ? result.status : result.signal ? 1 : 0;
    if (result.error) {
        logMessage(onLog, `Installer execution failed: ${result.error}`, "error");
    }

    return {
        exitCode,
        stdout: result.stdout?.toString() ?? "",
        stderr: result.stderr?.toString() ?? "",
        uacCancelled: exitCode === 1223,
    };
}

async function downloadBootstrapper(tempDir: string, onLog?: LogSink): Promise<string> {
    const targetPath = path.join(tempDir, "vs_BuildTools.exe");
    ensureDirectory(tempDir);

    return new Promise((resolve, reject) => {
        logMessage(onLog, "Downloading Visual Studio Build Tools bootstrapper...");

        const request = https.get(
            BUILD_TOOLS_URL,
            {
                headers: {
                    "User-Agent": "DioneApp/1.0 (BuildToolsInstaller)",
                },
            },
            (response) => {
                if (
                    response.statusCode &&
                    [301, 302, 307, 308].includes(response.statusCode) &&
                    response.headers.location
                ) {
                    https
                        .get(response.headers.location, (redirectResponse) => {
                            redirectResponse.pipe(fs.createWriteStream(targetPath));
                            redirectResponse.on("end", () => resolve(targetPath));
                            redirectResponse.on("error", (error) => reject(error));
                        })
                        .on("error", (error) => reject(error));
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download bootstrapper: HTTP ${response.statusCode}`));
                    return;
                }

                const fileStream = fs.createWriteStream(targetPath);
                response.pipe(fileStream);
                fileStream.on("finish", () => {
                    fileStream.close(() => resolve(targetPath));
                });
                fileStream.on("error", (error) => reject(error));
            },
        );

        request.on("error", (error) => {
            reject(error);
        });
    });
}

function ensureDiskSpace(targetPath: string, onLog?: LogSink): boolean {
    if (!isWindows()) return true;

    try {
        const root = path.parse(targetPath).root;
        const driveLetter = root.replace(/\\/g, "").replace(/\//g, "").charAt(0) || "C";
        const command = `powershell -NoProfile -Command \"(Get-PSDrive -Name '${driveLetter}').Free\"`;
        const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
        const freeBytes = Number.parseInt(output.trim(), 10);
        const requiredBytes = 10 * 1024 * 1024 * 1024; // 10 GB

        if (Number.isNaN(freeBytes)) {
            logMessage(onLog, "Unable to determine free disk space. Continuing cautiously.", "warn");
            return true;
        }

        if (freeBytes < requiredBytes) {
            const freeGB = (freeBytes / (1024 ** 3)).toFixed(2);
            logMessage(
                onLog,
                `Insufficient free space on drive ${driveLetter}: ${freeGB} GB available. At least 10 GB is required.`,
                "error",
            );
            return false;
        }

        return true;
    } catch (error) {
        logMessage(onLog, `Failed to check disk space: ${error}`, "warn");
        return true;
    }
}

function stopVisualStudioInstallerProcesses(onLog?: LogSink) {
    if (!isWindows()) return;

    const script = `
$names = @("vs_installer", "vs_installerservice", "vs_setup_bootstrapper", "setup", "vs_bldtools")
foreach ($name in $names) {
    try {
        $processes = Get-Process -Name $name -ErrorAction SilentlyContinue
        if ($null -ne $processes) {
            foreach ($proc in $processes) {
                try {
                    if (-not $proc.HasExited) {
                        $proc.CloseMainWindow() | Out-Null
                        Start-Sleep -Milliseconds 400
                        if (-not $proc.HasExited) {
                            Stop-Process -Id $proc.Id -Force
                        }
                    }
                } catch {}
            }
        }
    } catch {}
}`.trim();

    try {
        spawnSync("powershell", ["-NoProfile", "-Command", script], {
            windowsHide: true,
            stdio: "ignore",
        });
        logMessage(onLog, "Ensured Visual Studio Installer processes are not running.");
    } catch (error) {
        logMessage(onLog, `Failed to stop Visual Studio Installer processes: ${error}`, "warn");
    }
}

function interpretExitCode(exitCode: number): {
    success: boolean;
    needsReboot: boolean;
    summary: string;
    uacCancelled: boolean;
} {
    if (exitCode === 0) {
        return {
            success: true,
            needsReboot: false,
            summary: "Microsoft Build Tools installed successfully.",
            uacCancelled: false,
        };
    }

    if (exitCode === 3010) {
        return {
            success: true,
            needsReboot: true,
            summary:
                "Installation completed. A system restart is required to finalize the Visual Studio Build Tools setup.",
            uacCancelled: false,
        };
    }

    if (exitCode === 1223) {
        return {
            success: false,
            needsReboot: false,
            summary:
                "Installation was cancelled before completion. Please accept the administrator prompt to continue.",
            uacCancelled: true,
        };
    }

    if (exitCode === 1603) {
        return {
            success: false,
            needsReboot: false,
            summary:
                "Fatal error (1603). Ensure no other Visual Studio installations are running, you have at least 10 GB free space, and run Dione as administrator.",
            uacCancelled: false,
        };
    }

    return {
        success: false,
        needsReboot: false,
        summary: `Installer exited with code ${exitCode}. Check the dd_*.log files for details.`,
        uacCancelled: false,
    };
}

function collectInstallerLogs(
    installPath: string,
    startedAt: number,
    onLog?: LogSink,
): string[] {
    const logsDir = path.join(installPath, "logs");
    ensureDirectory(logsDir);

    const tempDir = process.env.TEMP || os.tmpdir();
    const files: Array<{ path: string; mtimeMs: number }> = [];

    try {
        for (const entry of fs.readdirSync(tempDir)) {
            if (!/^dd_.*\.log$/i.test(entry)) continue;
            const fullPath = path.join(tempDir, entry);
            try {
                const stat = fs.statSync(fullPath);
                if (stat.mtimeMs >= startedAt - 5 * 60 * 1000) {
                    files.push({ path: fullPath, mtimeMs: stat.mtimeMs });
                }
            } catch {}
        }
    } catch (error) {
        logMessage(onLog, `Failed to enumerate installer logs: ${error}`, "warn");
    }

    files.sort((a, b) => b.mtimeMs - a.mtimeMs);

    const collected: string[] = [];

    for (const file of files.slice(0, 10)) {
        const destName = path.basename(file.path);
        const destPath = path.join(logsDir, destName);
        let finalPath = destPath;
        let counter = 1;
        while (fs.existsSync(finalPath)) {
            const parsed = path.parse(destPath);
            finalPath = path.join(parsed.dir, `${parsed.name}_${counter}${parsed.ext}`);
            counter += 1;
        }

        try {
            fs.copyFileSync(file.path, finalPath);
            collected.push(finalPath);
        } catch (error) {
            logMessage(onLog, `Failed to copy log ${file.path}: ${error}`, "warn");
        }
    }

    return collected;
}

async function attemptInstall(
    binFolder: string,
    sdkVersion: string,
    onLog?: LogSink,
): Promise<InstallAttemptResult> {
    const installPath = path.join(binFolder, "build_tools");
    const tempDir = path.join(binFolder, "temp");
    ensureDirectory(installPath);
    ensureDirectory(tempDir);

    if (!ensureDiskSpace(installPath, onLog)) {
        return {
            exitCode: 1603,
            needsReboot: false,
            uacCancelled: false,
            summary: "Not enough free disk space to continue installation.",
            logs: [],
            success: false,
            sdkVersion,
            error: "Insufficient disk space",
        };
    }

    stopVisualStudioInstallerProcesses(onLog);

    let installerPath: string;
    try {
        installerPath = await downloadBootstrapper(tempDir, onLog);
    } catch (error) {
        const message = `Failed to download Visual Studio Build Tools: ${error}`;
        logMessage(onLog, message, "error");
        return {
            exitCode: 1,
            needsReboot: false,
            uacCancelled: false,
            summary: message,
            logs: [],
            success: false,
            sdkVersion,
            error: String(error),
        };
    }

    const args = [
        "--installPath",
        installPath,
        "--quiet",
        "--wait",
        "--norestart",
        "--nocache",
        "--channelId",
        "VisualStudio.17.Release",
        "--channelUri",
        "https://aka.ms/vs/17/release/channel",
        "--add",
        "Microsoft.VisualStudio.Workload.VCTools",
        "--add",
        "Microsoft.VisualStudio.Component.VC.Tools.x86.x64",
        "--add",
        "Microsoft.VisualStudio.Component.VC.CMake.Project",
        "--add",
        "Microsoft.VisualStudio.Workload.MSBuildTools",
        "--add",
        `Microsoft.VisualStudio.Component.Windows10SDK.${sdkVersion}`,
    ];

    logMessage(
        onLog,
        `Launching Visual Studio Build Tools installer (Windows 10 SDK ${sdkVersion})...`,
    );
    const startTs = Date.now();

    let runResult: RunElevatedResult;
    try {
        if (isProcessElevated()) {
            runResult = runInstallerDirect(installerPath, args, onLog);
        } else {
            runResult = runBuildToolsInstallerElevated(installerPath, args, onLog);
        }
    } catch (error) {
        const message = `Failed to execute installer: ${error}`;
        logMessage(onLog, message, "error");
        return {
            exitCode: 1,
            needsReboot: false,
            uacCancelled: false,
            summary: message,
            logs: [],
            success: false,
            sdkVersion,
            error: String(error),
        };
    }

    const logs = collectInstallerLogs(installPath, startTs, onLog);
    const interpretation = interpretExitCode(runResult.exitCode);

    if (runResult.stdout) {
        logMessage(onLog, runResult.stdout.trim());
    }
    if (runResult.stderr) {
        logMessage(onLog, runResult.stderr.trim(), "warn");
    }

    if (interpretation.success) {
        logMessage(
            onLog,
            interpretation.needsReboot
                ? "Installer completed successfully but a reboot is required."
                : "Installer completed successfully.",
        );
    } else if (interpretation.uacCancelled) {
        logMessage(onLog, "Installer cancelled by the user before completion.", "warn");
    } else {
        logMessage(onLog, interpretation.summary, "error");
    }

    return {
        exitCode: runResult.exitCode,
        needsReboot: interpretation.needsReboot,
        uacCancelled: interpretation.uacCancelled,
        summary: interpretation.summary,
        logs,
        success: interpretation.success,
        sdkVersion,
        error: interpretation.success ? undefined : interpretation.summary,
    };
}

function writeManagedMarker(installPath: string, sdkVersion: string) {
    const metadata = {
        managedBy: "dioneapp",
        installedAt: new Date().toISOString(),
        sdkVersion,
    };

    try {
        fs.writeFileSync(
            path.join(installPath, ".dione-managed.json"),
            JSON.stringify(metadata, null, 2),
            "utf8",
        );
        fs.writeFileSync(
            path.join(installPath, ".dione-managed"),
            "This Visual Studio Build Tools instance is managed by Dione.\n",
            "utf8",
        );
    } catch (error) {
        logger.warn(`Failed to write Dione managed marker: ${error}`);
    }
}

function readManagedMetadata(installPath: string): { sdkVersion?: string } {
    try {
        const metadataPath = path.join(installPath, ".dione-managed.json");
        if (fs.existsSync(metadataPath)) {
            const content = fs.readFileSync(metadataPath, "utf8");
            return JSON.parse(content);
        }
    } catch (error) {
        logger.warn(`Failed to read build tools metadata: ${error}`);
    }
    return {};
}

export async function ensureBuildToolsInstalled(
    options: EnsureBuildToolsOptions,
): Promise<BuildToolsEnsureResult> {
    const { binFolder, onLog, preferredSdk } = options;
    const installPath = path.join(binFolder, "build_tools");

    if (!isWindows()) {
        logMessage(onLog, "Build tools installation is only required on Windows. Skipping.");
        return {
            status: "already-installed",
            summary: "Build tools are not required on this platform.",
            logs: [],
        };
    }

    const existing = verifyBuildToolsPaths(installPath);
    if (existing) {
        const metadata = readManagedMetadata(installPath);
        logMessage(onLog, "Microsoft Build Tools already installed and verified.");
        return {
            status: "already-installed",
            summary: "Microsoft Build Tools installation is already present and ready.",
            logs: [],
            verification: existing,
            sdkVersion: metadata.sdkVersion,
        };
    }

    const desiredSdk = preferredSdk || DEFAULT_SDK;
    let attempt = await attemptInstall(binFolder, desiredSdk, onLog);

    if (!attempt.success && !attempt.uacCancelled && desiredSdk === DEFAULT_SDK) {
        logMessage(
            onLog,
            `Retrying installation with Windows 10 SDK ${FALLBACK_SDK} (fallback component).`,
            "warn",
        );
        await delay(1000);
        attempt = await attemptInstall(binFolder, FALLBACK_SDK, onLog);
    }

    if (!attempt.success) {
        return {
            status: "failed",
            exitCode: attempt.exitCode,
            needsReboot: attempt.needsReboot,
            uacCancelled: attempt.uacCancelled,
            summary: attempt.summary,
            error: attempt.error,
            logs: attempt.logs,
            sdkVersion: attempt.sdkVersion,
        };
    }

    const verification = verifyBuildToolsPaths(installPath);
    if (!verification) {
        return {
            status: "failed",
            summary:
                "Build tools installer reported success, but the expected binaries were not found. Check the installer logs for details.",
            exitCode: attempt.exitCode,
            needsReboot: attempt.needsReboot,
            uacCancelled: attempt.uacCancelled,
            error: "Verification failed",
            logs: attempt.logs,
            sdkVersion: attempt.sdkVersion,
        };
    }

    writeManagedMarker(installPath, attempt.sdkVersion);

    return {
        status: "installed",
        exitCode: attempt.exitCode,
        needsReboot: attempt.needsReboot,
        uacCancelled: attempt.uacCancelled,
        summary: attempt.summary,
        logs: attempt.logs,
        verification,
        sdkVersion: attempt.sdkVersion,
    };
}

export function verifyBuildToolsPaths(installPath: string): BuildToolsVerification | null {
    if (!isWindows()) return null;
    if (!installPath || !fs.existsSync(installPath)) return null;

    const vcvarsPath = path.join(
        installPath,
        "VC",
        "Auxiliary",
        "Build",
        "vcvars64.bat",
    );

    if (!fs.existsSync(vcvarsPath)) {
        return null;
    }

    const msvcRoot = path.join(installPath, "VC", "Tools", "MSVC");
    if (!fs.existsSync(msvcRoot)) {
        return null;
    }

    let selectedVersion: string | undefined;
    let clPath: string | undefined;

    try {
        const versions = fs
            .readdirSync(msvcRoot, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name)
            .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));

        for (const version of versions) {
            const candidate = path.join(msvcRoot, version, "bin", "Hostx64", "x64", "cl.exe");
            if (fs.existsSync(candidate)) {
                selectedVersion = version;
                clPath = candidate;
                break;
            }
        }
    } catch (error) {
        logger.warn(`Failed to enumerate MSVC toolsets: ${error}`);
        return null;
    }

    if (!selectedVersion || !clPath) {
        return null;
    }

    const cmakePath = path.join(
        installPath,
        "Common7",
        "IDE",
        "CommonExtensions",
        "Microsoft",
        "CMake",
        "CMake",
        "bin",
        "cmake.exe",
    );

    if (!fs.existsSync(cmakePath)) {
        return null;
    }

    return {
        installPath,
        vcvarsPath,
        clPath,
        cmakePath,
        msvcVersion: selectedVersion,
    };
}

function resolveVsInstallerExecutable(installPath: string): string | null {
    const candidates = [
        path.join(installPath, "vs_installer.exe"),
    ];

    const programFilesX86 = process.env["ProgramFiles(x86)"];
    if (programFilesX86) {
        candidates.push(
            path.join(programFilesX86, "Microsoft Visual Studio", "Installer", "vs_installer.exe"),
        );
    }

    const programFiles = process.env.ProgramFiles;
    if (programFiles) {
        candidates.push(
            path.join(programFiles, "Microsoft Visual Studio", "Installer", "vs_installer.exe"),
        );
    }

    for (const candidate of candidates) {
        if (candidate && fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}

export async function uninstallManagedBuildTools(
    installPath: string,
    onLog?: LogSink,
): Promise<BuildToolsEnsureResult> {
    if (!isWindows()) {
        return {
            status: "failed",
            summary: "Build tools are not installed on this platform.",
            logs: [],
        };
    }

    if (!fs.existsSync(installPath)) {
        return {
            status: "failed",
            summary: "Build tools installation folder not found.",
            logs: [],
        };
    }

    const vsInstaller = resolveVsInstallerExecutable(installPath);
    if (!vsInstaller) {
        return {
            status: "failed",
            summary: "Could not locate vs_installer.exe to uninstall build tools.",
            logs: [],
        };
    }

    const args = [
        "uninstall",
        "--installPath",
        installPath,
        "--quiet",
        "--wait",
        "--norestart",
        "--nocache",
    ];

    logMessage(onLog, "Starting uninstallation of Dione-managed Visual Studio Build Tools instance...");

    let result: RunElevatedResult;
    try {
        if (isProcessElevated()) {
            result = runInstallerDirect(vsInstaller, args, onLog);
        } else {
            result = runBuildToolsInstallerElevated(vsInstaller, args, onLog);
        }
    } catch (error) {
        const summary = `Failed to run vs_installer.exe: ${error}`;
        logMessage(onLog, summary, "error");
        return {
            status: "failed",
            summary,
            logs: [],
            error: String(error),
        };
    }

    const interpretation = interpretExitCode(result.exitCode);

    if (!interpretation.success) {
        logMessage(onLog, interpretation.summary, interpretation.uacCancelled ? "warn" : "error");
        return {
            status: "failed",
            summary: interpretation.summary,
            exitCode: result.exitCode,
            uacCancelled: interpretation.uacCancelled,
            logs: [],
        };
    }

    try {
        await fsp.rm(installPath, { recursive: true, force: true });
        logMessage(onLog, "Managed Visual Studio Build Tools instance removed successfully.");
    } catch (error) {
        logMessage(onLog, `Failed to remove build tools directory: ${error}`, "warn");
    }

    const summary = interpretation.needsReboot
        ? "Build tools uninstallation completed. Please reboot to finish cleanup."
        : "Build tools uninstalled successfully.";

    return {
        status: "uninstalled",
        summary,
        exitCode: result.exitCode,
        needsReboot: interpretation.needsReboot,
        logs: [],
    };
}
