import { execSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import https from "node:https";
import type { IncomingMessage } from "node:http";
import os from "node:os";
import path from "node:path";
import { pipeline as streamPipeline } from "node:stream/promises";
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
    enableLayoutFallback?: boolean;
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

interface AttemptInstallOptions {
    enableLayoutFallback: boolean;
}

const BUILD_TOOLS_URL = "https://aka.ms/vs/17/release/vs_BuildTools.exe";
const DEFAULT_SDK = "22621";
const FALLBACK_SDK = "19041";
const MAX_BOOTSTRAPPER_REDIRECTS = 5;
const FILE_UNLOCK_TIMEOUT_MS = 60_000;
const INSTALL_MUTEX_TIMEOUT_MS = 5 * 60 * 1000;
const INSTALL_MUTEX_STALE_MS = 30 * 60 * 1000;
const INSTALL_MUTEX_RETRY_MS = 1000;
const FILE_LOCK_EXIT_CODE = 5001;
const START_PROCESS_LOCK_EXIT_CODE = 5002;
const MUTEX_ACQUIRE_EXIT_CODE = 5003;
const CHANNEL_MANIFEST_URL = "https://aka.ms/vs/17/release/channel";
const MAX_CHANNEL_MANIFEST_ATTEMPTS = 3;
const CHANNEL_MANIFEST_BACKOFF_BASE_MS = 500;
const BOOTSTRAPPER_CACHE_RETENTION_MS = 2 * 60 * 60 * 1000;
const CHANNEL_PARSE_ERROR_CODE = "0x80131500";
const BUILD_TOOLS_COMPONENTS_BASE = [
    "Microsoft.VisualStudio.Workload.VCTools",
    "Microsoft.VisualStudio.Component.VC.Tools.x86.x64",
    "Microsoft.VisualStudio.Component.VC.CMake.Project",
    "Microsoft.VisualStudio.Workload.MSBuildTools",
];
const LAYOUT_FALLBACK_ENV =
    process.env.DIONE_ENABLE_BUILD_TOOLS_LAYOUT_FALLBACK?.toLowerCase();
const DEFAULT_ENABLE_LAYOUT_FALLBACK =
    LAYOUT_FALLBACK_ENV === "1" || LAYOUT_FALLBACK_ENV === "true";
const UNINSTALL_MUTEX_NAME = "Global\\DioneVSBT_Uninstall";
const UNINSTALL_MUTEX_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_UNINSTALL_LOG_DIR_NAME = "build_tools_uninstall";

let uninstallInProgress = false;

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

interface RunElevatedResult {
    exitCode: number;
    stdout: string;
    stderr: string;
    uacCancelled: boolean;
    fileLocked: boolean;
    mutexUnavailable: boolean;
}

interface RunElevatedInstallerOptions {
    installerPath: string;
    args: string[];
    workingDirectory: string;
    tempDir: string;
    requireRunAs: boolean;
    mutexName?: string;
    mutexTimeoutMs?: number;
}

interface CollectInstallerLogsOptions {
    targetDir?: string;
    includeInstallerLogs?: boolean;
}

interface VsWhereInstanceResult {
    instanceId: string;
    installationPath: string;
    productId: string;
}

interface VisualStudioInstallerToolsResult {
    vsInstaller?: string;
    vsWhere?: string;
    logs: string[];
    needsReboot: boolean;
    uacCancelled: boolean;
    error?: string;
}

function escapeForPowerShellDoubleQuotes(value: string): string {
    return value.replace(/`/g, "``").replace(/"/g, '""');
}

function encodeArgumentsToBase64(args: string[]): string {
    return Buffer.from(JSON.stringify(args), "utf8").toString("base64");
}

function quoteArgumentForLogging(value: string): string {
    if (!value) {
        return '""';
    }
    if (/[\s"]/u.test(value)) {
        return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
}

function formatCommandLine(executable: string, args: string[]): string {
    return [quoteArgumentForLogging(executable), ...args.map(quoteArgumentForLogging)]
        .join(" ")
        .trim();
}

async function downloadBootstrapperExecutable(
    targetPath: string,
    onLog?: LogSink,
    url: string = BUILD_TOOLS_URL,
    redirectCount = 0,
): Promise<void> {
    if (redirectCount === 0) {
        logMessage(onLog, "Downloading Visual Studio Build Tools bootstrapper...");
    }

    await fsp.mkdir(path.dirname(targetPath), { recursive: true });

    const response = await new Promise<IncomingMessage>((resolve, reject) => {
        const request = https.get(
            url,
            {
                headers: {
                    "User-Agent": "DioneApp/1.0 (BuildToolsInstaller)",
                },
            },
            (res) => resolve(res),
        );
        request.on("error", (error) => reject(error));
    });

    if (
        response.statusCode &&
        [301, 302, 307, 308].includes(response.statusCode) &&
        response.headers.location
    ) {
        response.resume();
        if (redirectCount >= MAX_BOOTSTRAPPER_REDIRECTS) {
            throw new Error("Too many redirects while downloading bootstrapper.");
        }
        const nextUrl = new URL(response.headers.location, url).toString();
        await downloadBootstrapperExecutable(targetPath, onLog, nextUrl, redirectCount + 1);
        return;
    }

    if (response.statusCode !== 200) {
        response.resume();
        throw new Error(`Failed to download bootstrapper: HTTP ${response.statusCode}`);
    }

    const tempPath = `${targetPath}.part`;
    await fsp.rm(tempPath, { force: true }).catch(() => {});

    let handle: fsp.FileHandle | undefined;
    let writable: fs.WriteStream | undefined;
    const cleanupPartial = async () => {
        await fsp.rm(tempPath, { force: true }).catch(() => {});
    };

    try {
        handle = await fsp.open(tempPath, "w", 0o644);
        writable = fs.createWriteStream(null, { fd: handle.fd, autoClose: false });

        try {
            await streamPipeline(response, writable);
        } catch (pipelineError) {
            writable.destroy();
            writable = undefined;
            throw pipelineError;
        }

        try {
            await handle.sync();
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (!(isWindows() && err?.code === "EPERM")) {
                throw error;
            }
            logMessage(
                onLog,
                "fsync is not permitted on the bootstrapper descriptor (EPERM). Continuing without syncing.",
                "warn",
            );
        }

        await handle.close();
        handle = undefined;

        await fsp.rename(tempPath, targetPath);
    } catch (error) {
        response.destroy();
        if (handle) {
            try {
                await handle.close();
            } catch {}
            handle = undefined;
        }
        writable?.destroy();
        writable = undefined;
        await cleanupPartial();
        throw error;
    }
}

function unblockFile(filePath: string, onLog?: LogSink) {
    if (!isWindows()) return;

    const command = `try { Unblock-File -Path "${escapeForPowerShellDoubleQuotes(filePath)}" -ErrorAction SilentlyContinue } catch { }`;

    try {
        spawnSync("powershell", ["-NoProfile", "-Command", command], {
            windowsHide: true,
            stdio: "ignore",
        });
    } catch (error) {
        logMessage(onLog, `Failed to unblock bootstrapper: ${error}`, "warn");
    }
}

async function verifyFileUnlocked(
    filePath: string,
    onLog?: LogSink,
    timeoutMs: number = FILE_UNLOCK_TIMEOUT_MS,
): Promise<void> {
    if (!isWindows()) return;

    const escapedPath = escapeForPowerShellDoubleQuotes(filePath);
    const start = Date.now();
    const timeoutSeconds = Math.ceil(timeoutMs / 1000);
    let warned = false;
    let attempt = 0;

    while (true) {
        const script = `
$path = "${escapedPath}"
$accessModes = @([System.IO.FileAccess]::ReadWrite, [System.IO.FileAccess]::Read)

foreach ($mode in $accessModes) {
    try {
        $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::Open, $mode, [System.IO.FileShare]::None)
        $stream.Dispose()
        exit 0
    } catch {
        continue
    }
}

exit 1
`.trim();

        const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
            windowsHide: true,
            encoding: "utf8",
        });

        const exitCode = typeof result.status === "number" ? result.status : result.signal ? 1 : 0;

        if (exitCode === 0) {
            return;
        }

        if (result.error) {
            logMessage(onLog, `File lock verification failed: ${result.error}`, "warn");
        }

        if (!warned) {
            logMessage(
                onLog,
                "Waiting for the Visual Studio Build Tools bootstrapper to release file handles...",
                "warn",
            );
            warned = true;
        }

        if (Date.now() - start >= timeoutMs) {
            throw new Error(
                `Bootstrapper executable remained locked after waiting ${timeoutSeconds} seconds.`,
            );
        }

        attempt += 1;
        const backoff = Math.min(1000, 200 + attempt * 100);
        await delay(backoff);
    }
}

async function gracefulCleanup(tempDir: string): Promise<void> {
    try {
        await fsp.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
        logger.warn(`Failed to clean up temporary directory ${tempDir}: ${error}`);
    }
}

async function ensureBootstrapperDownloadedUnlocked(
    binFolder: string,
    onLog?: LogSink,
): Promise<{ tempDir: string; installerPath: string }> {
    const tempRoot = path.join(binFolder, "temp");
    ensureDirectory(tempRoot);

    const attemptId = crypto.randomUUID();
    const tempDir = path.join(tempRoot, `bt_${attemptId}`);
    await fsp.mkdir(tempDir, { recursive: true });

    const installerPath = path.join(tempDir, `vs_BuildTools_${crypto.randomUUID()}.exe`);

    try {
        await downloadBootstrapperExecutable(installerPath, onLog);
        unblockFile(installerPath, onLog);
        await verifyFileUnlocked(installerPath, onLog);
        return { tempDir, installerPath };
    } catch (error) {
        await gracefulCleanup(tempDir);
        throw error;
    }
}

async function downloadChannelManifestContent(
    url: string,
    redirectCount = 0,
): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
        const request = https.get(
            url,
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
                    response.resume();
                    if (redirectCount >= MAX_BOOTSTRAPPER_REDIRECTS) {
                        reject(new Error("Too many redirects while downloading channel manifest."));
                        return;
                    }
                    const nextUrl = new URL(response.headers.location, url).toString();
                    downloadChannelManifestContent(nextUrl, redirectCount + 1)
                        .then(resolve)
                        .catch(reject);
                    return;
                }

                if (response.statusCode !== 200) {
                    response.resume();
                    reject(
                        new Error(`Failed to download channel manifest: HTTP ${response.statusCode}`),
                    );
                    return;
                }

                const chunks: string[] = [];
                response.setEncoding("utf8");
                response.on("data", (chunk) => chunks.push(chunk));
                response.on("end", () => resolve(chunks.join("")));
                response.on("error", (error) => reject(error));
            },
        );

        request.on("error", (error) => reject(error));
    });
}

async function ensureChannelManifest(tempDir: string, onLog?: LogSink): Promise<string> {
    const manifestPath = path.join(tempDir, "channelManifest.json");
    let lastError: unknown;
    await fsp.rm(manifestPath, { force: true }).catch(() => {});

    for (let attempt = 0; attempt < MAX_CHANNEL_MANIFEST_ATTEMPTS; attempt += 1) {
        if (attempt === 0) {
            logMessage(onLog, "Prefetching Visual Studio channel manifest...");
        } else {
            logMessage(
                onLog,
                `Retrying Visual Studio channel manifest download (attempt ${attempt + 1}/${MAX_CHANNEL_MANIFEST_ATTEMPTS})...`,
                "warn",
            );
        }

        try {
            const content = await downloadChannelManifestContent(CHANNEL_MANIFEST_URL);
            JSON.parse(content);
            await fsp.writeFile(manifestPath, content, "utf8");
            logMessage(
                onLog,
                `Using locally validated Visual Studio channel manifest at ${manifestPath}`,
            );
            return manifestPath;
        } catch (error) {
            lastError = error;
            await fsp.rm(manifestPath, { force: true }).catch(() => {});
            const message = error instanceof Error ? error.message : String(error);
            const isLastAttempt = attempt >= MAX_CHANNEL_MANIFEST_ATTEMPTS - 1;
            logMessage(
                onLog,
                `Failed to validate Visual Studio channel manifest: ${message}`,
                isLastAttempt ? "error" : "warn",
            );

            if (!isLastAttempt) {
                const backoff = CHANNEL_MANIFEST_BACKOFF_BASE_MS * (attempt + 1);
                logMessage(
                    onLog,
                    `Retrying channel manifest download in ${backoff} ms...`,
                    "warn",
                );
                await delay(backoff);
            }
        }
    }

    throw new Error(
        lastError instanceof Error
            ? lastError.message
            : "Unable to download Visual Studio channel manifest.",
    );
}

function cleanupBootstrapperCache(onLog?: LogSink) {
    if (!isWindows()) return;

    const programData = process.env.ProgramData || "C:\\ProgramData";
    const cacheDir = path.join(
        programData,
        "Microsoft",
        "VisualStudio",
        "Packages",
        "_bootstrapper",
    );

    if (!fs.existsSync(cacheDir)) {
        return;
    }

    const cutoff = Date.now() - BOOTSTRAPPER_CACHE_RETENTION_MS;
    let removed = 0;

    try {
        for (const entry of fs.readdirSync(cacheDir)) {
            if (!/^vs_setup_bootstrapper_.*\.json$/i.test(entry)) {
                continue;
            }

            const candidate = path.join(cacheDir, entry);
            try {
                const stat = fs.statSync(candidate);
                if (stat.mtimeMs >= cutoff) {
                    fs.rmSync(candidate, { force: true });
                    removed += 1;
                }
            } catch (error) {
                logger.warn(`Failed to inspect bootstrapper cache file ${candidate}: ${error}`);
            }
        }
    } catch (error) {
        logger.warn(`Failed to enumerate Visual Studio bootstrapper cache: ${error}`);
        return;
    }

    if (removed > 0) {
        logMessage(
            onLog,
            `Cleared ${removed} Visual Studio bootstrapper manifest ${
                removed === 1 ? "file" : "files"
            } from ${cacheDir}.`,
        );
    }
}

async function acquireInstallMutex(
    binFolder: string,
    onLog?: LogSink,
): Promise<() => Promise<void>> {
    const tempRoot = path.join(binFolder, "temp");
    ensureDirectory(tempRoot);
    const lockPath = path.join(tempRoot, "build_tools.install.lock");
    const start = Date.now();
    let warned = false;

    while (true) {
        try {
            const handle = await fsp.open(
                lockPath,
                fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_RDWR,
                0o600,
            );

            try {
                await handle.truncate(0);
                await handle.write(`${process.pid}\n${Date.now()}\n`);
            } catch (writeError) {
                logger.warn(`Failed to write install mutex metadata: ${writeError}`);
            }

            return async () => {
                try {
                    await handle.close();
                } catch (closeError) {
                    logger.warn(`Failed to close install mutex handle: ${closeError}`);
                }

                await fsp.unlink(lockPath).catch(() => {});
            };
        } catch (error) {
            const err = error as NodeJS.ErrnoException;
            if (err.code !== "EEXIST") {
                throw err;
            }

            if (!warned) {
                logMessage(
                    onLog,
                    "Another Visual Studio Build Tools installation is in progress. Waiting for it to finish...",
                    "warn",
                );
                warned = true;
            }

            try {
                const stat = await fsp.stat(lockPath);
                if (Date.now() - stat.mtimeMs > INSTALL_MUTEX_STALE_MS) {
                    await fsp.unlink(lockPath);
                    continue;
                }
            } catch (statError) {
                const errno = statError as NodeJS.ErrnoException;
                if (errno.code === "ENOENT") {
                    continue;
                }
                logger.warn(`Failed to inspect build tools install lock: ${statError}`);
            }

            if (Date.now() - start >= INSTALL_MUTEX_TIMEOUT_MS) {
                throw new Error(
                    "Another Visual Studio Build Tools installation is already running. Please try again later.",
                );
            }

            await delay(INSTALL_MUTEX_RETRY_MS);
        }
    }
}

async function runElevatedInstaller(
    options: RunElevatedInstallerOptions,
    onLog?: LogSink,
): Promise<RunElevatedResult> {
    if (!isWindows()) {
        throw new Error("Attempted to run Windows installer on non-Windows platform");
    }

    const scriptPath = path.join(
        options.tempDir,
        `launch_vs_buildtools_${Date.now()}_${crypto.randomUUID()}.ps1`,
    );
    const unlockTimeoutSeconds = Math.ceil(FILE_UNLOCK_TIMEOUT_MS / 1000);

    const scriptContent = `
param(
    [Parameter(Mandatory = $true)][string]$InstallerPath,
    [Parameter(Mandatory = $true)][string]$ArgumentsBase64,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory,
    [switch]$ForceRunAs,
    [string]$MutexName,
    [int]$MutexTimeoutMs = 0
)

$ErrorActionPreference = 'Stop'
$lockedExitCode = ${FILE_LOCK_EXIT_CODE}
$startProcessLockedExitCode = ${START_PROCESS_LOCK_EXIT_CODE}
$uacCancelledCode = 1223
$mutexAcquireExitCode = ${MUTEX_ACQUIRE_EXIT_CODE}

$mutex = $null
$mutexAcquired = $false
$mutexTimeoutValue = if ($MutexTimeoutMs -gt 0) { $MutexTimeoutMs } else { ${UNINSTALL_MUTEX_TIMEOUT_MS} }

if (-not [string]::IsNullOrWhiteSpace($MutexName)) {
    try {
        $mutex = New-Object System.Threading.Mutex($false, $MutexName)
        try {
            $mutexAcquired = $mutex.WaitOne([System.TimeSpan]::FromMilliseconds($mutexTimeoutValue), $false)
        } catch [System.Threading.AbandonedMutexException] {
            $mutexAcquired = $true
        }
        if (-not $mutexAcquired) {
            exit $mutexAcquireExitCode
        }
    } catch {
        Write-Error "Failed to acquire mutex $MutexName: $_"
        exit $mutexAcquireExitCode
    }
}

try {
    try {
        $argumentsJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($ArgumentsBase64))
        $argumentList = ConvertFrom-Json $argumentsJson
    } catch {
        Write-Error "Failed to parse installer arguments: $_"
        exit 1
    }

    $processNames = @("vs_installer", "VisualStudioInstaller", "vs_installerservice", "vs_setup_bootstrapper", "setup", "vs_bldtools")
    foreach ($name in $processNames) {
        try {
            Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
                try {
                    if (-not $_.HasExited) {
                        $_.CloseMainWindow() | Out-Null
                        Start-Sleep -Milliseconds 400
                        if (-not $_.HasExited) {
                            Stop-Process -Id $_.Id -Force
                        }
                    }
                } catch {}
            }
        } catch {}
    }

    try {
        Unblock-File -Path $InstallerPath -ErrorAction SilentlyContinue
    } catch {}

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    while ($true) {
        try {
            $stream = [System.IO.File]::Open($InstallerPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
            $stream.Dispose()
            break
        } catch {
            if ($stopwatch.Elapsed.TotalSeconds -ge ${unlockTimeoutSeconds}) {
                Write-Error "Installer file remained locked after ${unlockTimeoutSeconds} seconds."
                exit $lockedExitCode
            }
            Start-Sleep -Milliseconds 500
        }
    }

    $startParams = @{
        FilePath = $InstallerPath
        ArgumentList = $argumentList
        WorkingDirectory = $WorkingDirectory
        Wait = $true
        PassThru = $true
    }

    if ($ForceRunAs.IsPresent) {
        $startParams["Verb"] = "RunAs"
    }

    try {
        $process = Start-Process @startParams
        if ($null -ne $process.ExitCode) {
            exit $process.ExitCode
        } else {
            exit 0
        }
    } catch {
        $hr = $_.Exception.HResult
        if ($hr -eq -2147024864) {
            Write-Error "Start-Process failed because the installer file is in use."
            exit $startProcessLockedExitCode
        }
        if ($hr -eq -2147023673) {
            exit $uacCancelledCode
        }
        throw
    }
} finally {
    if ($mutex -ne $null) {
        if ($mutexAcquired) {
            try {
                $mutex.ReleaseMutex() | Out-Null
            } catch {}
        }
        $mutex.Dispose()
    }
}
`.trim();

    await fsp.writeFile(scriptPath, scriptContent, "utf8");

    const argsBase64 = encodeArgumentsToBase64(options.args);
    const psArguments = [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
        "-InstallerPath",
        options.installerPath,
        "-ArgumentsBase64",
        argsBase64,
        "-WorkingDirectory",
        options.workingDirectory,
    ];

    if (options.requireRunAs) {
        psArguments.push("-ForceRunAs");
    }

    if (options.mutexName) {
        psArguments.push("-MutexName", options.mutexName);
        const mutexTimeout = options.mutexTimeoutMs ?? UNINSTALL_MUTEX_TIMEOUT_MS;
        psArguments.push("-MutexTimeoutMs", mutexTimeout.toString());
    }

    try {
        const result = spawnSync("powershell", psArguments, {
            windowsHide: true,
            encoding: "utf8",
        });

        const exitCode = typeof result.status === "number" ? result.status : result.signal ? 1 : 0;

        if (result.error) {
            logMessage(onLog, `Failed to launch installer via PowerShell: ${result.error}`, "error");
        }

        return {
            exitCode,
            stdout: result.stdout?.toString() ?? "",
            stderr: result.stderr?.toString() ?? "",
            uacCancelled: exitCode === 1223,
            fileLocked:
                exitCode === FILE_LOCK_EXIT_CODE || exitCode === START_PROCESS_LOCK_EXIT_CODE,
            mutexUnavailable: exitCode === MUTEX_ACQUIRE_EXIT_CODE,
        };
    } finally {
        await fsp.rm(scriptPath, { force: true }).catch(() => {});
    }
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
$names = @("vs_installer", "VisualStudioInstaller", "vs_installerservice", "vs_setup_bootstrapper", "setup", "vs_bldtools")
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
}
Start-Sleep -Milliseconds 200`.trim();

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

function interpretUninstallExitCode(exitCode: number, commandLine: string): {
    success: boolean;
    needsReboot: boolean;
    summary: string;
    uacCancelled: boolean;
} {
    if (exitCode === 0) {
        return {
            success: true,
            needsReboot: false,
            summary: "Build tools uninstalled successfully.",
            uacCancelled: false,
        };
    }

    if (exitCode === 3010) {
        return {
            success: true,
            needsReboot: true,
            summary:
                "Build tools uninstallation completed. A system restart is required to finalize cleanup.",
            uacCancelled: false,
        };
    }

    if (exitCode === 1223) {
        return {
            success: false,
            needsReboot: false,
            summary:
                "Uninstallation was cancelled at the elevation prompt. Please accept the administrator request to continue.",
            uacCancelled: true,
        };
    }

    if (exitCode === 5) {
        return {
            success: false,
            needsReboot: false,
            summary:
                "Access denied (5) while running the Visual Studio Installer. Try running Dione as administrator or accept the UAC prompt.",
            uacCancelled: false,
        };
    }

    if (exitCode === 87) {
        return {
            success: false,
            needsReboot: false,
            summary: `Visual Studio Installer rejected the command line (error 87). Command: ${commandLine}`,
            uacCancelled: false,
        };
    }

    if (exitCode === 1603) {
        return {
            success: false,
            needsReboot: false,
            summary:
                "Fatal error (1603) while uninstalling build tools. Ensure no other Visual Studio processes are running and review the installer logs.",
            uacCancelled: false,
        };
    }

    return {
        success: false,
        needsReboot: false,
        summary: `Visual Studio Installer exited with code ${exitCode} while executing ${commandLine}. Review the collected logs for more details.`,
        uacCancelled: false,
    };
}

function collectInstallerLogs(
    installPath: string,
    startedAt: number,
    onLog?: LogSink,
    options?: CollectInstallerLogsOptions,
): string[] {
    const logsDir = options?.targetDir ?? path.join(installPath, "logs");
    ensureDirectory(logsDir);

    const collected: string[] = [];
    const seenSources = new Set<string>();
    const candidates: Array<{ path: string; mtimeMs: number }> = [];
    const threshold = startedAt - 5 * 60 * 1000;

    const addCandidate = (filePath: string) => {
        if (!filePath || seenSources.has(filePath)) {
            return;
        }

        try {
            const stat = fs.statSync(filePath);
            if (!stat.isFile()) {
                return;
            }
            if (stat.mtimeMs >= threshold) {
                candidates.push({ path: filePath, mtimeMs: stat.mtimeMs });
                seenSources.add(filePath);
            }
        } catch (error) {
            logMessage(onLog, `Failed to inspect installer log ${filePath}: ${error}`, "warn");
        }
    };

    const tempDir = process.env.TEMP || os.tmpdir();
    try {
        for (const entry of fs.readdirSync(tempDir)) {
            if (!/^dd_.*\.log$/i.test(entry)) continue;
            addCandidate(path.join(tempDir, entry));
        }
    } catch (error) {
        logMessage(onLog, `Failed to enumerate installer logs: ${error}`, "warn");
    }

    if (options?.includeInstallerLogs) {
        const programData = process.env.ProgramData || "C:\\ProgramData";
        const installerRoot = path.join(programData, "Microsoft", "VisualStudio", "Installer");

        const includeDirectory = (dir: string) => {
            try {
                for (const entry of fs.readdirSync(dir)) {
                    if (!/\.log(\.|$)/i.test(entry)) continue;
                    addCandidate(path.join(dir, entry));
                }
            } catch (error) {
                logMessage(
                    onLog,
                    `Failed to enumerate Visual Studio Installer logs in ${dir}: ${error}`,
                    "warn",
                );
            }
        };

        if (fs.existsSync(installerRoot)) {
            includeDirectory(installerRoot);
            const nestedLogs = path.join(installerRoot, "Logs");
            if (fs.existsSync(nestedLogs)) {
                includeDirectory(nestedLogs);
            }
        }
    }

    candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);

    const ensureUniqueDestination = (fileName: string): string => {
        const parsed = path.parse(fileName);
        let candidate = path.join(logsDir, fileName);
        let counter = 1;
        while (fs.existsSync(candidate)) {
            candidate = path.join(logsDir, `${parsed.name}_${counter}${parsed.ext}`);
            counter += 1;
        }
        return candidate;
    };

    for (const file of candidates) {
        const destination = ensureUniqueDestination(path.basename(file.path));
        try {
            fs.copyFileSync(file.path, destination);
            collected.push(destination);
        } catch (error) {
            logMessage(onLog, `Failed to copy log ${file.path}: ${error}`, "warn");
        }
    }

    return collected;
}

function getBuildToolsComponents(sdkVersion: string): string[] {
    return [
        ...BUILD_TOOLS_COMPONENTS_BASE,
        `Microsoft.VisualStudio.Component.Windows10SDK.${sdkVersion}`,
    ];
}

function createInstallArguments(
    installPath: string,
    sdkVersion: string,
    manifestPath: string,
    options?: { layoutPath?: string; noweb?: boolean },
): string[] {
    const args = [
        "--installPath",
        installPath,
        "--quiet",
        "--wait",
        "--norestart",
        "--nocache",
        "--locale",
        "en-US",
        "--channelId",
        "VisualStudio.17.Release",
        "--channelUri",
        manifestPath,
    ];

    if (options?.layoutPath) {
        args.push("--layout", options.layoutPath);
    }

    if (options?.noweb) {
        args.push("--noweb");
    }

    for (const component of getBuildToolsComponents(sdkVersion)) {
        args.push("--add", component);
    }

    return args;
}

function createLayoutArguments(
    layoutPath: string,
    sdkVersion: string,
    manifestPath: string,
): string[] {
    const args = [
        "--layout",
        layoutPath,
        "--lang",
        "en-US",
        "--channelId",
        "VisualStudio.17.Release",
        "--channelUri",
        manifestPath,
    ];

    for (const component of getBuildToolsComponents(sdkVersion)) {
        args.push("--add", component);
    }

    return args;
}

function logsContainChannelParseError(logPaths: string[]): boolean {
    for (const logPath of logPaths) {
        try {
            const content = fs.readFileSync(logPath, "utf8");
            if (content.includes(CHANNEL_PARSE_ERROR_CODE)) {
                return true;
            }
        } catch (error) {
            logger.warn(`Failed to read installer log ${logPath}: ${error}`);
        }
    }

    return false;
}

async function attemptInstall(
    binFolder: string,
    sdkVersion: string,
    onLog: LogSink | undefined,
    options: AttemptInstallOptions,
): Promise<InstallAttemptResult> {
    const installPath = path.join(binFolder, "build_tools");
    const tempRoot = path.join(binFolder, "temp");
    ensureDirectory(installPath);
    ensureDirectory(tempRoot);

    let releaseMutex: (() => Promise<void>) | undefined;
    try {
        releaseMutex = await acquireInstallMutex(binFolder, onLog);
    } catch (error) {
        const summary =
            error instanceof Error && error.message
                ? error.message
                : "Another Visual Studio Build Tools installation is already running.";
        logMessage(onLog, summary, "warn");
        return {
            exitCode: 1,
            needsReboot: false,
            uacCancelled: false,
            summary,
            logs: [],
            success: false,
            sdkVersion,
            error: summary,
        };
    }

    try {
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

        const requireRunAs = !isProcessElevated();
        const startedAt = Date.now();
        const maxBootstrapAttempts = 2;
        let dynamicAttempts = maxBootstrapAttempts;
        let lastRun: RunElevatedResult | undefined;
        let failureSummary: string | undefined;
        let logs: string[] = [];
        let channelRetryAdded = false;
        let lastAttemptParseError = false;

        for (let attemptIndex = 0; attemptIndex < dynamicAttempts; attemptIndex += 1) {
            lastAttemptParseError = false;
            let bootstrap: { tempDir: string; installerPath: string } | undefined;
            try {
                bootstrap = await ensureBootstrapperDownloadedUnlocked(binFolder, onLog);
                const manifestPath = await ensureChannelManifest(bootstrap.tempDir, onLog);

                cleanupBootstrapperCache(onLog);
                stopVisualStudioInstallerProcesses(onLog);

                logMessage(
                    onLog,
                    attemptIndex === 0
                        ? `Launching Visual Studio Build Tools installer (Windows 10 SDK ${sdkVersion})...`
                        : "Retrying Visual Studio Build Tools installer launch...",
                );

                const args = createInstallArguments(installPath, sdkVersion, manifestPath);
                const runResult = await runElevatedInstaller(
                    {
                        installerPath: bootstrap.installerPath,
                        args,
                        workingDirectory: bootstrap.tempDir,
                        tempDir: bootstrap.tempDir,
                        requireRunAs,
                    },
                    onLog,
                );

                const stdout = runResult.stdout.trim();
                if (stdout) {
                    logMessage(onLog, stdout);
                }
                const stderr = runResult.stderr.trim();
                if (stderr) {
                    logMessage(onLog, stderr, "warn");
                }

                logs = collectInstallerLogs(installPath, startedAt, onLog);

                if (runResult.fileLocked) {
                    failureSummary =
                        "Visual Studio Build Tools bootstrapper was locked by another process during launch.";
                    logMessage(
                        onLog,
                        attemptIndex === 0
                            ? `${failureSummary} Retrying with a fresh download...`
                            : failureSummary,
                        attemptIndex === 0 ? "warn" : "error",
                    );

                    if (attemptIndex === 0) {
                        await delay(1000);
                        continue;
                    }
                }

                lastRun = runResult;

                const interpretation = interpretExitCode(runResult.exitCode);
                const hasParseError = logsContainChannelParseError(logs);

                lastAttemptParseError = hasParseError;

                if (!interpretation.success && hasParseError) {
                    if (!channelRetryAdded) {
                        channelRetryAdded = true;
                        dynamicAttempts += 1;
                        logMessage(
                            onLog,
                            "Detected Visual Studio channel manifest parse error (0x80131500). Clearing cached bootstrapper manifests and retrying once...",
                            "warn",
                        );
                        cleanupBootstrapperCache(onLog);
                        await delay(1000);
                        continue;
                    }

                    failureSummary =
                        "Visual Studio Build Tools installer failed to parse the channel manifest (0x80131500).";
                    logMessage(
                        onLog,
                        "Visual Studio Build Tools installer still failed to parse the channel manifest (0x80131500) after retry.",
                        "error",
                    );
                } else if (!interpretation.success && !failureSummary) {
                    failureSummary = interpretation.summary;
                }

                break;
            } catch (error) {
                logs = collectInstallerLogs(installPath, startedAt, onLog);
                failureSummary = `Failed to execute Visual Studio Build Tools installer: ${error}`;
                logMessage(onLog, failureSummary, "error");
                if (attemptIndex === 0) {
                    logMessage(onLog, "Re-downloading the bootstrapper and retrying once...", "warn");
                    await delay(1000);
                    continue;
                }
                break;
            } finally {
                if (bootstrap) {
                    await gracefulCleanup(bootstrap.tempDir);
                }
            }
        }

        if (!lastRun || lastRun.fileLocked) {
            const summary =
                failureSummary ??
                "Failed to launch the Visual Studio Build Tools installer because the bootstrapper file is locked.";
            return {
                exitCode: lastRun?.exitCode ?? 1,
                needsReboot: false,
                uacCancelled: lastRun?.uacCancelled ?? false,
                summary,
                logs,
                success: false,
                sdkVersion,
                error: summary,
            };
        }

        let interpretation = interpretExitCode(lastRun.exitCode);

        if (!interpretation.success && lastAttemptParseError) {
            interpretation = {
                ...interpretation,
                summary:
                    "Visual Studio Build Tools installer failed to parse the channel manifest (0x80131500).",
            };
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

        if (
            !interpretation.success &&
            options.enableLayoutFallback &&
            lastAttemptParseError &&
            !interpretation.uacCancelled
        ) {
            logMessage(
                onLog,
                "Falling back to an offline Visual Studio Build Tools layout (--noweb) after repeated channel manifest failures.",
                "warn",
            );
            const fallbackResult = await attemptLayoutFallback(
                binFolder,
                installPath,
                sdkVersion,
                requireRunAs,
                onLog,
            );

            if (logs.length > 0) {
                const combinedLogs = [...logs];
                for (const logPath of fallbackResult.logs) {
                    if (!combinedLogs.includes(logPath)) {
                        combinedLogs.push(logPath);
                    }
                }
                fallbackResult.logs = combinedLogs;
            }

            return fallbackResult;
        }

        return {
            exitCode: lastRun.exitCode,
            needsReboot: interpretation.needsReboot,
            uacCancelled: interpretation.uacCancelled,
            summary: interpretation.summary,
            logs,
            success: interpretation.success,
            sdkVersion,
            error: interpretation.success ? undefined : interpretation.summary,
        };
    } finally {
        if (releaseMutex) {
            await releaseMutex();
        }
    }
}

async function attemptLayoutFallback(
    binFolder: string,
    installPath: string,
    sdkVersion: string,
    requireRunAs: boolean,
    onLog?: LogSink,
): Promise<InstallAttemptResult> {
    const layoutDir = path.join(binFolder, "temp", `bt_layout_${crypto.randomUUID()}`);
    await fsp.mkdir(layoutDir, { recursive: true });

    let bootstrap: { tempDir: string; installerPath: string } | undefined;
    let logs: string[] = [];
    const startedAt = Date.now();

    try {
        bootstrap = await ensureBootstrapperDownloadedUnlocked(binFolder, onLog);
        const manifestPath = await ensureChannelManifest(bootstrap.tempDir, onLog);

        logMessage(
            onLog,
            "Creating offline Visual Studio Build Tools layout for required components...",
        );

        cleanupBootstrapperCache(onLog);
        stopVisualStudioInstallerProcesses(onLog);

        const layoutArgs = createLayoutArguments(layoutDir, sdkVersion, manifestPath);
        const layoutResult = await runElevatedInstaller(
            {
                installerPath: bootstrap.installerPath,
                args: layoutArgs,
                workingDirectory: bootstrap.tempDir,
                tempDir: bootstrap.tempDir,
                requireRunAs,
            },
            onLog,
        );

        const layoutStdout = layoutResult.stdout.trim();
        if (layoutStdout) {
            logMessage(onLog, layoutStdout);
        }
        const layoutStderr = layoutResult.stderr.trim();
        if (layoutStderr) {
            logMessage(onLog, layoutStderr, "warn");
        }

        logs = collectInstallerLogs(installPath, startedAt, onLog);

        if (layoutResult.fileLocked) {
            const summary =
                "Visual Studio Build Tools bootstrapper was locked while creating the offline layout.";
            logMessage(onLog, summary, "error");
            return {
                exitCode: layoutResult.exitCode ?? 1,
                needsReboot: false,
                uacCancelled: layoutResult.uacCancelled,
                summary,
                logs,
                success: false,
                sdkVersion,
                error: summary,
            };
        }

        if (layoutResult.exitCode === 1223) {
            const summary =
                "Offline layout creation was cancelled before completion. Please accept the administrator prompt to continue.";
            logMessage(onLog, summary, "warn");
            return {
                exitCode: layoutResult.exitCode,
                needsReboot: false,
                uacCancelled: true,
                summary,
                logs,
                success: false,
                sdkVersion,
                error: summary,
            };
        }

        if (layoutResult.exitCode !== 0) {
            const summary = `Offline layout creation failed with exit code ${layoutResult.exitCode}.`;
            logMessage(onLog, summary, "error");
            return {
                exitCode: layoutResult.exitCode,
                needsReboot: false,
                uacCancelled: layoutResult.uacCancelled,
                summary,
                logs,
                success: false,
                sdkVersion,
                error: summary,
            };
        }

        logMessage(
            onLog,
            "Offline layout created successfully. Installing Visual Studio Build Tools with --noweb...",
        );

        cleanupBootstrapperCache(onLog);
        stopVisualStudioInstallerProcesses(onLog);

        const installArgs = createInstallArguments(installPath, sdkVersion, manifestPath, {
            layoutPath: layoutDir,
            noweb: true,
        });

        const installResult = await runElevatedInstaller(
            {
                installerPath: bootstrap.installerPath,
                args: installArgs,
                workingDirectory: bootstrap.tempDir,
                tempDir: bootstrap.tempDir,
                requireRunAs,
            },
            onLog,
        );

        const installStdout = installResult.stdout.trim();
        if (installStdout) {
            logMessage(onLog, installStdout);
        }
        const installStderr = installResult.stderr.trim();
        if (installStderr) {
            logMessage(onLog, installStderr, "warn");
        }

        logs = collectInstallerLogs(installPath, startedAt, onLog);

        if (installResult.fileLocked) {
            const summary =
                "Visual Studio Build Tools bootstrapper was locked during offline installation.";
            logMessage(onLog, summary, "error");
            return {
                exitCode: installResult.exitCode ?? 1,
                needsReboot: false,
                uacCancelled: installResult.uacCancelled,
                summary,
                logs,
                success: false,
                sdkVersion,
                error: summary,
            };
        }

        const interpretation = interpretExitCode(installResult.exitCode);
        let summary: string;

        if (interpretation.success) {
            summary = interpretation.needsReboot
                ? "Microsoft Build Tools installed successfully using the offline layout. A reboot is required to finalize the installation."
                : "Microsoft Build Tools installed successfully using the offline layout.";
            logMessage(onLog, summary);
        } else if (interpretation.uacCancelled) {
            summary = interpretation.summary;
            logMessage(onLog, summary, "warn");
        } else {
            summary = interpretation.summary;
            logMessage(onLog, summary, "error");
        }

        return {
            exitCode: installResult.exitCode,
            needsReboot: interpretation.needsReboot,
            uacCancelled: interpretation.uacCancelled,
            summary,
            logs,
            success: interpretation.success,
            sdkVersion,
            error: interpretation.success ? undefined : summary,
        };
    } catch (error) {
        const summary = `Offline layout fallback failed: ${error}`;
        logMessage(onLog, summary, "error");
        logs = collectInstallerLogs(installPath, startedAt, onLog);
        return {
            exitCode: 1,
            needsReboot: false,
            uacCancelled: false,
            summary,
            logs,
            success: false,
            sdkVersion,
            error: summary,
        };
    } finally {
        if (bootstrap) {
            await gracefulCleanup(bootstrap.tempDir);
        }
        await gracefulCleanup(layoutDir);
    }
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
    const { binFolder, onLog, preferredSdk, enableLayoutFallback: enableLayoutFallbackOption } = options;
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

    const enableLayoutFallback =
        enableLayoutFallbackOption ?? DEFAULT_ENABLE_LAYOUT_FALLBACK;

    const desiredSdk = preferredSdk || DEFAULT_SDK;
    let attempt = await attemptInstall(binFolder, desiredSdk, onLog, {
        enableLayoutFallback,
    });

    if (!attempt.success && !attempt.uacCancelled && desiredSdk === DEFAULT_SDK) {
        logMessage(
            onLog,
            `Retrying installation with Windows 10 SDK ${FALLBACK_SDK} (fallback component).`,
            "warn",
        );
        await delay(1000);
        attempt = await attemptInstall(binFolder, FALLBACK_SDK, onLog, {
            enableLayoutFallback,
        });
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
    const candidates: string[] = [];

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

    if (installPath) {
        candidates.push(path.join(installPath, "vs_installer.exe"));
    }

    for (const candidate of candidates) {
        if (candidate && fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}

function resolveVsWhereExecutable(installPath?: string): string | null {
    const candidates: string[] = [];

    const programFilesX86 = process.env["ProgramFiles(x86)"];
    if (programFilesX86) {
        candidates.push(
            path.join(programFilesX86, "Microsoft Visual Studio", "Installer", "vswhere.exe"),
        );
    }

    const programFiles = process.env.ProgramFiles;
    if (programFiles) {
        candidates.push(
            path.join(programFiles, "Microsoft Visual Studio", "Installer", "vswhere.exe"),
        );
    }

    if (installPath) {
        candidates.push(path.join(installPath, "vswhere.exe"));
    }

    const localAppData = process.env.LOCALAPPDATA;
    if (localAppData) {
        candidates.push(
            path.join(
                localAppData,
                "Microsoft",
                "VisualStudio",
                "Packages",
                "Microsoft.VisualStudio.Setup.Configuration.Native",
                "vswhere.exe",
            ),
        );
    }

    const seen = new Set<string>();
    for (const candidate of candidates) {
        if (!candidate) continue;
        const normalized = candidate.toLowerCase();
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
}

function queryBuildToolsInstance(
    installPath: string,
    vsWherePath: string,
    onLog?: LogSink,
): VsWhereInstanceResult | null {
    try {
        const args = ["-path", installPath, "-products", "*", "-format", "json"];
        const result = spawnSync(vsWherePath, args, {
            windowsHide: true,
            encoding: "utf8",
        });

        if (result.error) {
            logMessage(onLog, `vswhere execution failed: ${result.error}`, "warn");
        }

        const stdout = result.stdout?.toString().trim() ?? "";
        if (!stdout) {
            return null;
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(stdout);
        } catch (error) {
            logMessage(onLog, `Failed to parse vswhere output: ${error}`, "warn");
            return null;
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return null;
        }

        const instance = parsed[0] as Record<string, unknown>;
        const productId = typeof instance.productId === "string" ? (instance.productId as string) : "";
        const instanceId = typeof instance.instanceId === "string" ? (instance.instanceId as string) : "";
        const installationPath =
            typeof instance.installationPath === "string"
                ? (instance.installationPath as string)
                : "";

        if (!instanceId || !installationPath) {
            return null;
        }

        return {
            instanceId,
            installationPath,
            productId,
        };
    } catch (error) {
        logMessage(onLog, `Failed to query Visual Studio instances: ${error}`, "warn");
        return null;
    }
}

async function ensureVisualStudioInstallerTools(
    installPath: string,
    onLog: LogSink | undefined,
    logTargetDir: string,
): Promise<VisualStudioInstallerToolsResult> {
    const result: VisualStudioInstallerToolsResult = {
        logs: [],
        needsReboot: false,
        uacCancelled: false,
    };

    let vsInstaller = resolveVsInstallerExecutable(installPath);
    let vsWhere = resolveVsWhereExecutable(installPath);

    if (vsInstaller && vsWhere) {
        result.vsInstaller = vsInstaller;
        result.vsWhere = vsWhere;
        return result;
    }

    const binRoot = path.dirname(installPath);
    let bootstrap: { tempDir: string; installerPath: string } | undefined;
    const startedAt = Date.now();

    try {
        logMessage(
            onLog,
            "Visual Studio Installer tools were not found. Attempting to repair them via the bootstrapper...",
            "warn",
        );
        bootstrap = await ensureBootstrapperDownloadedUnlocked(binRoot, onLog);
        stopVisualStudioInstallerProcesses(onLog);

        const args = [
            "--update",
            "--quiet",
            "--wait",
            "--norestart",
            "--nocache",
            "--locale",
            "en-US",
        ];

        const runResult = await runElevatedInstaller(
            {
                installerPath: bootstrap.installerPath,
                args,
                workingDirectory: bootstrap.tempDir,
                tempDir: bootstrap.tempDir,
                requireRunAs: true,
            },
            onLog,
        );

        const bootstrapLogs = collectInstallerLogs(
            installPath,
            startedAt,
            onLog,
            { targetDir: logTargetDir, includeInstallerLogs: true },
        );
        for (const logPath of bootstrapLogs) {
            if (!result.logs.includes(logPath)) {
                result.logs.push(logPath);
            }
        }

        if (runResult.fileLocked) {
            result.error =
                "Visual Studio Installer bootstrapper was locked by another process while attempting to repair the installer.";
            return result;
        }

        if (runResult.uacCancelled) {
            result.uacCancelled = true;
            result.error =
                "Administrator approval is required to repair the Visual Studio Installer. Please accept the UAC prompt and try again.";
            return result;
        }

        const interpretation = interpretExitCode(runResult.exitCode);
        result.needsReboot = interpretation.needsReboot;
        if (!interpretation.success) {
            result.error = interpretation.summary;
            return result;
        }
    } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
        return result;
    } finally {
        if (bootstrap) {
            await gracefulCleanup(bootstrap.tempDir);
        }
    }

    vsInstaller = resolveVsInstallerExecutable(installPath);
    vsWhere = resolveVsWhereExecutable(installPath);

    if (!vsInstaller || !vsWhere) {
        result.error =
            "Visual Studio Installer tools were not found after bootstrapping the installer.";
        return result;
    }

    result.vsInstaller = vsInstaller;
    result.vsWhere = vsWhere;
    return result;
}

function getUninstallRemovalComponents(installPath: string): string[] {
    const metadata = readManagedMetadata(installPath);
    const sdkVersion =
        typeof metadata.sdkVersion === "string" && metadata.sdkVersion.trim().length > 0
            ? metadata.sdkVersion.trim()
            : DEFAULT_SDK;

    const components = new Set<string>([
        ...BUILD_TOOLS_COMPONENTS_BASE,
        `Microsoft.VisualStudio.Component.Windows10SDK.${sdkVersion}`,
    ]);

    return Array.from(components);
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

    if (uninstallInProgress) {
        const summary = "Another build tools uninstallation is already running.";
        logMessage(onLog, summary, "warn");
        return {
            status: "failed",
            summary,
            logs: [],
        };
    }

    uninstallInProgress = true;

    try {
        if (!fs.existsSync(installPath)) {
            const summary = "Build tools were already removed.";
            logMessage(onLog, summary);
            return {
                status: "uninstalled",
                summary,
                logs: [],
            };
        }

        const markerPath = path.join(installPath, ".dione-managed");
        if (!fs.existsSync(markerPath)) {
            const summary =
                "The Visual Studio installation at the managed path is missing the Dione management marker. Aborting uninstall to avoid modifying user installations.";
            logMessage(onLog, summary, "warn");
            return {
                status: "failed",
                summary,
                logs: [],
            };
        }

        const binRoot = path.dirname(installPath);
        const logTargetDir = path.join(binRoot, "logs", DEFAULT_UNINSTALL_LOG_DIR_NAME);
        ensureDirectory(logTargetDir);

        const aggregatedLogs = new Set<string>();
        const appendLogs = (paths: string[]) => {
            for (const entry of paths) {
                if (entry && !aggregatedLogs.has(entry)) {
                    aggregatedLogs.add(entry);
                }
            }
        };
        const emitAggregatedLogs = () => {
            if (aggregatedLogs.size > 0) {
                logMessage(onLog, "Collected Visual Studio Installer logs:");
                for (const logPath of aggregatedLogs) {
                    logMessage(onLog, `  • ${logPath}`);
                }
            }
        };
        const snapshotLogs = () => {
            emitAggregatedLogs();
            return Array.from(aggregatedLogs);
        };

        let needsReboot = false;
        let uacCancelled = false;
        let exitCode: number | undefined;

        const tools = await ensureVisualStudioInstallerTools(installPath, onLog, logTargetDir);
        appendLogs(tools.logs);
        if (tools.needsReboot) {
            needsReboot = true;
        }
        if (tools.uacCancelled) {
            uacCancelled = true;
        }

        if (!tools.vsInstaller || !tools.vsWhere) {
            const summary = tools.error ?? "Visual Studio Installer executable was not found.";
            logMessage(onLog, summary, tools.uacCancelled ? "warn" : "error");
            return {
                status: "failed",
                summary,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        const vsInstallerPath = tools.vsInstaller;
        const vsWherePath = tools.vsWhere;

        let instance = queryBuildToolsInstance(installPath, vsWherePath, onLog);
        if (!instance) {
            logMessage(onLog, "No Visual Studio Build Tools instance found. Cleaning up leftovers.");
            await fsp.rm(installPath, { recursive: true, force: true }).catch((error) => {
                logMessage(onLog, `Failed to remove build tools directory: ${error}`, "warn");
            });
            const logsArray = snapshotLogs();
            return {
                status: "uninstalled",
                summary: "Build tools were already removed.",
                logs: logsArray,
                needsReboot,
                uacCancelled,
            };
        }

        if (
            instance.productId &&
            instance.productId.toLowerCase() !== "microsoft.visualstudio.product.buildtools"
        ) {
            const summary = `The Visual Studio installation at ${installPath} is not a Build Tools instance (productId: ${instance.productId}). Aborting uninstall.`;
            logMessage(onLog, summary, "warn");
            return {
                status: "failed",
                summary,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        logMessage(
            onLog,
            `Preparing to uninstall Visual Studio Build Tools instance ${instance.instanceId}.`,
        );

        const runInstallerCommand = async (
            args: string[],
            description: string,
        ): Promise<{ result?: RunElevatedResult; commandLine: string; error?: Error }> => {
            stopVisualStudioInstallerProcesses(onLog);
            const commandLine = formatCommandLine(vsInstallerPath, args);
            logMessage(onLog, `${description}: ${commandLine}`);
            const tempDir = path.join(os.tmpdir(), `dione_vs_uninstall_${crypto.randomUUID()}`);
            await fsp.mkdir(tempDir, { recursive: true });
            const attemptStartedAt = Date.now();

            let runResult: RunElevatedResult | undefined;
            let runError: Error | undefined;

            try {
                runResult = await runElevatedInstaller(
                    {
                        installerPath: vsInstallerPath,
                        args,
                        workingDirectory: path.dirname(vsInstallerPath),
                        tempDir,
                        requireRunAs: true,
                        mutexName: UNINSTALL_MUTEX_NAME,
                        mutexTimeoutMs: UNINSTALL_MUTEX_TIMEOUT_MS,
                    },
                    onLog,
                );
            } catch (error) {
                runError = error instanceof Error ? error : new Error(String(error));
            } finally {
                appendLogs(
                    collectInstallerLogs(installPath, attemptStartedAt, onLog, {
                        targetDir: logTargetDir,
                        includeInstallerLogs: true,
                    }),
                );
                await fsp.rm(tempDir, { recursive: true, force: true }).catch(() => {});
            }

            if (runError) {
                return { error: runError, commandLine };
            }

            return { result: runResult!, commandLine };
        };

        const uninstallArgs = [
            "uninstall",
            "--installPath",
            installPath,
            "--quiet",
            "--norestart",
            "--nocache",
            "--locale",
            "en-US",
        ];

        const uninstallExecution = await runInstallerCommand(
            uninstallArgs,
            "Executing Visual Studio Installer uninstall",
        );

        if (uninstallExecution.error) {
            const summary = `Failed to run vs_installer.exe: ${uninstallExecution.error.message}`;
            logMessage(onLog, summary, "error");
            return {
                status: "failed",
                summary,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        const uninstallResult = uninstallExecution.result!;
        exitCode = uninstallResult.exitCode;

        if (uninstallResult.mutexUnavailable) {
            const summary =
                "Another Visual Studio Installer operation is already running. Close Visual Studio Installer and try again.";
            logMessage(onLog, summary, "warn");
            return {
                status: "failed",
                summary,
                exitCode,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        if (uninstallResult.fileLocked) {
            const summary =
                "Visual Studio Installer could not be launched because the executable is locked by another process.";
            logMessage(onLog, summary, "error");
            return {
                status: "failed",
                summary,
                exitCode,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        let interpretation = interpretUninstallExitCode(
            uninstallResult.exitCode,
            uninstallExecution.commandLine,
        );
        needsReboot ||= interpretation.needsReboot;
        uacCancelled ||= interpretation.uacCancelled;

        if (!interpretation.success && interpretation.uacCancelled) {
            logMessage(onLog, interpretation.summary, "warn");
            return {
                status: "failed",
                summary: interpretation.summary,
                exitCode,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        if (!interpretation.success && !interpretation.uacCancelled) {
            instance = queryBuildToolsInstance(installPath, vsWherePath, onLog);
            if (instance) {
                const removalComponents = getUninstallRemovalComponents(installPath);
                const modifyArgs = [
                    "modify",
                    "--installPath",
                    installPath,
                    "--quiet",
                    "--norestart",
                    "--nocache",
                    "--locale",
                    "en-US",
                ];
                for (const component of removalComponents) {
                    modifyArgs.push("--remove", component);
                }

                const modifyExecution = await runInstallerCommand(
                    modifyArgs,
                    "Executing Visual Studio Installer modify fallback",
                );

                if (modifyExecution.error) {
                    const summary = `Component removal fallback failed: ${modifyExecution.error.message}`;
                    logMessage(onLog, summary, "error");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                const modifyResult = modifyExecution.result!;
                exitCode = modifyResult.exitCode;

                if (modifyResult.mutexUnavailable) {
                    const summary =
                        "Another Visual Studio Installer operation started during component removal. Please retry.";
                    logMessage(onLog, summary, "warn");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                if (modifyResult.fileLocked) {
                    const summary =
                        "Visual Studio Installer reported that the executable was locked during component removal.";
                    logMessage(onLog, summary, "error");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                const modifyInterpretation = interpretUninstallExitCode(
                    modifyResult.exitCode,
                    modifyExecution.commandLine,
                );
                needsReboot ||= modifyInterpretation.needsReboot;
                uacCancelled ||= modifyInterpretation.uacCancelled;

                if (!modifyInterpretation.success) {
                    logMessage(
                        onLog,
                        modifyInterpretation.summary,
                        modifyInterpretation.uacCancelled ? "warn" : "error",
                    );
                    return {
                        status: "failed",
                        summary: modifyInterpretation.summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                const retryExecution = await runInstallerCommand(
                    uninstallArgs,
                    "Retrying Visual Studio Installer uninstall after component removal",
                );

                if (retryExecution.error) {
                    const summary = `Failed to relaunch vs_installer.exe after component removal: ${retryExecution.error.message}`;
                    logMessage(onLog, summary, "error");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                const retryResult = retryExecution.result!;
                exitCode = retryResult.exitCode;

                if (retryResult.mutexUnavailable) {
                    const summary =
                        "Another Visual Studio Installer operation started during the uninstall retry. Please retry later.";
                    logMessage(onLog, summary, "warn");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                if (retryResult.fileLocked) {
                    const summary =
                        "Visual Studio Installer reported that the executable was locked during the uninstall retry.";
                    logMessage(onLog, summary, "error");
                    return {
                        status: "failed",
                        summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }

                interpretation = interpretUninstallExitCode(
                    retryResult.exitCode,
                    retryExecution.commandLine,
                );
                needsReboot ||= interpretation.needsReboot;
                uacCancelled ||= interpretation.uacCancelled;

                if (!interpretation.success) {
                    logMessage(
                        onLog,
                        interpretation.summary,
                        interpretation.uacCancelled ? "warn" : "error",
                    );
                    return {
                        status: "failed",
                        summary: interpretation.summary,
                        exitCode,
                        logs: snapshotLogs(),
                        needsReboot,
                        uacCancelled,
                    };
                }
            }
        }

        if (!interpretation.success) {
            logMessage(onLog, interpretation.summary, interpretation.uacCancelled ? "warn" : "error");
            return {
                status: "failed",
                summary: interpretation.summary,
                exitCode,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        instance = queryBuildToolsInstance(installPath, vsWherePath, onLog);
        if (instance) {
            const summary =
                "Visual Studio Build Tools still appear to be installed after running the uninstaller. Review the collected logs for more details.";
            logMessage(onLog, summary, "error");
            return {
                status: "failed",
                summary,
                exitCode,
                logs: snapshotLogs(),
                needsReboot,
                uacCancelled,
            };
        }

        await fsp.rm(installPath, { recursive: true, force: true }).catch((error) => {
            logMessage(onLog, `Failed to remove build tools directory: ${error}`, "warn");
        });

        const logsArray = snapshotLogs();

        const summary = needsReboot
            ? "Build tools uninstalled successfully. Please reboot to finalize cleanup."
            : "Build tools uninstalled successfully.";

        return {
            status: "uninstalled",
            summary,
            exitCode,
            needsReboot,
            uacCancelled,
            logs: logsArray,
        };
    } finally {
        uninstallInProgress = false;
    }
}
