import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { app } from "electron";
import { readConfig } from "../../../../config";
import logger from "../../../utils/logger";
import { type BuildToolsVerification, verifyBuildToolsPaths } from "./build-tools";

class BuildToolsManager {
    private static instance: BuildToolsManager;
    private vcvarsEnv: Record<string, string> | null = null;
    private initialized = false;

    private constructor() {}

    static getInstance(): BuildToolsManager {
        if (!BuildToolsManager.instance) {
            BuildToolsManager.instance = new BuildToolsManager();
        }
        return BuildToolsManager.instance;
    }

    // Resolve the Dione-managed Visual Studio Build Tools installation
    private resolveManagedBuildTools(): BuildToolsVerification | null {
        const settings = readConfig();
        const fallbackRoot = app.getPath("userData");
        const binRoot = settings?.defaultBinFolder ?? fallbackRoot;
        const baseBinFolder = path.join(binRoot, "bin");
        const installPath = path.join(baseBinFolder, "build_tools");
        const verification = verifyBuildToolsPaths(installPath);

        if (!verification) {
            logger.warn(
                "No managed Visual Studio Build Tools installation detected at the expected location.",
            );
            return null;
        }

        logger.info(`Using Visual Studio Build Tools located at ${verification.installPath}`);
        return verification;
    }

    // Get environment variables from vcvars
    private getVCVarsEnvironment(
        vcvarsPath: string,
    ): Record<string, string> | null {
        try {
            const tempScript = path.join(os.tmpdir(), `vcvars_${Date.now()}.bat`);
            const batchContent = `@echo off
call "${vcvarsPath}" >nul 2>&1
echo VCVARS_ENV_START
set
echo VCVARS_ENV_END`;

            fs.writeFileSync(tempScript, batchContent);

            const output = execSync(`"${tempScript}"`, {
                encoding: "utf8",
                timeout: 30000,
                windowsHide: true,
            });

            fs.unlinkSync(tempScript);

            const envStart = output.indexOf("VCVARS_ENV_START");
            const envEnd = output.indexOf("VCVARS_ENV_END");

            if (envStart === -1 || envEnd === -1) {
                throw new Error("Could not parse vcvars output");
            }

            const envSection = output.substring(
                envStart + "VCVARS_ENV_START".length,
                envEnd,
            );
            const envVars: Record<string, string> = {};

            for (const line of envSection.split("\n")) {
                const trimmed = line.trim();
                if (trimmed?.includes("=")) {
                    const [key, ...valueParts] = trimmed.split("=");
                    envVars[key] = valueParts.join("=");
                }
            }

            return envVars;
        } catch (error: any) {
            logger.error(`Failed to get vcvars environment: ${error.message}`);
            return null;
        }
    }

    // Initialize build tools environment
    async initialize(): Promise<boolean> {
        if (this.initialized && this.vcvarsEnv) {
            return true;
        }

        if (process.platform !== "win32") {
            logger.info("Build tools initialization skipped on non-Windows platform.");
            return false;
        }

        try {
            logger.info("Initializing build tools environment...");

            const verification = this.resolveManagedBuildTools();
            if (!verification) {
                return false;
            }

            const vcvarsEnv = this.getVCVarsEnvironment(verification.vcvarsPath);
            if (!vcvarsEnv) {
                logger.error("Failed to compute environment variables from vcvars64.bat");
                return false;
            }

            vcvarsEnv.npm_config_msvs_version = "2022";
            vcvarsEnv.npm_config_node_gyp = "node-gyp";

            try {
                const pythonPath = execSync("where python", { encoding: "utf8" })
                    .trim()
                    .split("\n")[0];
                if (pythonPath) {
                    vcvarsEnv.npm_config_python = pythonPath;
                    vcvarsEnv.PYTHON = pythonPath;
                }
            } catch (error) {
                logger.info(
                    "Python not found via 'where python' - some native modules may require a manual Python installation.",
                );
            }

            const separator = ";";
            const extraPaths = [
                path.dirname(verification.clPath),
                path.dirname(verification.cmakePath),
            ];
            const currentPath = vcvarsEnv.PATH ? vcvarsEnv.PATH.split(separator) : [];
            const merged = [...extraPaths, ...currentPath]
                .filter((value) => value && value.trim().length > 0)
                .filter((value, index, self) =>
                    self.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) ===
                    index,
                )
                .join(separator);
            vcvarsEnv.PATH = merged;

            this.vcvarsEnv = vcvarsEnv;
            this.initialized = true;

            logger.info("✅ Build tools environment initialized successfully");
            return true;
        } catch (error: any) {
            logger.error(`Failed to initialize build tools: ${error.message}`);
            return false;
        }
    }

    // Get enhanced environment for spawning processes
    getEnhancedEnvironment(
        baseEnv: Record<string, string> = {},
    ): Record<string, string> {
        if (!this.vcvarsEnv) {
            logger.warn("Build tools not initialized - using base environment");
            return baseEnv;
        }

        const mergedEnv: Record<string, string> = {
            ...baseEnv,
            ...this.vcvarsEnv,
            PYTHONUNBUFFERED: "1",
            NODE_NO_BUFFERING: "1",
            FORCE_UNBUFFERED_OUTPUT: "1",
            PYTHONIOENCODING: "UTF-8",
            FORCE_COLOR: "1",
        };

        if (baseEnv.PATH) {
            const separator = ";";
            const vcPath = this.vcvarsEnv.PATH ? this.vcvarsEnv.PATH.split(separator) : [];
            const basePath = baseEnv.PATH.split(separator);
            const combined = [...vcPath, ...basePath]
                .filter((value) => value && value.trim().length > 0)
                .filter((value, index, self) =>
                    self.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) ===
                    index,
                )
                .join(separator);
            mergedEnv.PATH = combined;
        }

        return mergedEnv;
    }

    // Test if build tools are working
    async test(): Promise<boolean> {
        if (!this.vcvarsEnv) {
            logger.error("Build tools not initialized");
            return false;
        }

        try {
            logger.info("Testing build tools...");

            // Test if we can find cl.exe
            try {
                const clPath = execSync("where cl", {
                    encoding: "utf8",
                    env: this.vcvarsEnv,
                }).trim();
                logger.info(`✅ Found cl.exe: ${clPath.split("\n")[0]}`);
            } catch (e) {
                logger.warn("❌ cl.exe not found in PATH");
                return false;
            }

            // Test if we can find link.exe
            try {
                const linkPath = execSync("where link", {
                    encoding: "utf8",
                    env: this.vcvarsEnv,
                }).trim();
                logger.info(`✅ Found link.exe: ${linkPath.split("\n")[0]}`);
            } catch (e) {
                logger.warn("❌ link.exe not found in PATH");
                return false;
            }

            logger.info("✅ Build tools test completed successfully");
            return true;
        } catch (error: any) {
            logger.error(`❌ Build tools test failed: ${error.message}`);
            return false;
        }
    }
}

export default BuildToolsManager;
