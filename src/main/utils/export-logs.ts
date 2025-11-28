import { readConfig } from "@/config";
import logger from "@/server/utils/logger";
import archiver from "archiver";
import { app } from "electron";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import si from "systeminformation";

/**
 * Collects system information for debugging purposes
 */
async function collectSystemInfo(): Promise<string> {
	try {
		const [cpu, mem, osInfo, graphics, disk] = await Promise.all([
			si.cpu(),
			si.mem(),
			si.osInfo(),
			si.graphics(),
			si.diskLayout(),
		]);

		const config = readConfig();

		const systemInfo = `
=== DIONE DEBUG INFORMATION ===
Generated: ${new Date().toISOString()}

=== APPLICATION INFO ===
App Version: ${app.getVersion()}
App Path: ${app.getAppPath()}
User Data Path: ${app.getPath("userData")}
Logs Path: ${app.getPath("logs")}
Temp Path: ${app.getPath("temp")}
Exe Path: ${app.getPath("exe")}

=== CONFIGURATION ===
${JSON.stringify(config, null, 2)}

=== OPERATING SYSTEM ===
Platform: ${osInfo.platform}
Distro: ${osInfo.distro}
Release: ${osInfo.release}
Architecture: ${osInfo.arch}
Hostname: ${osInfo.hostname}
Kernel: ${osInfo.kernel}

=== CPU ===
Manufacturer: ${cpu.manufacturer}
Brand: ${cpu.brand}
Cores: ${cpu.cores}
Physical Cores: ${cpu.physicalCores}
Speed: ${cpu.speed} GHz

=== MEMORY ===
Total: ${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB
Free: ${(mem.free / 1024 / 1024 / 1024).toFixed(2)} GB
Used: ${(mem.used / 1024 / 1024 / 1024).toFixed(2)} GB
Active: ${(mem.active / 1024 / 1024 / 1024).toFixed(2)} GB

=== GRAPHICS ===
${graphics.controllers.map((gpu, i) => `
GPU ${i + 1}:
  Model: ${gpu.model}
  Vendor: ${gpu.vendor}
  VRAM: ${gpu.vram} MB
  Driver Version: ${gpu.driverVersion}
`).join("\n")}

=== DISK ===
${disk.map((d, i) => `
Disk ${i + 1}:
  Type: ${d.type}
  Name: ${d.name}
  Size: ${(d.size / 1024 / 1024 / 1024).toFixed(2)} GB
  Interface: ${d.interfaceType}
`).join("\n")}

=== NODE.JS ===
Node Version: ${process.versions.node}
V8 Version: ${process.versions.v8}
Electron Version: ${process.versions.electron}
Chrome Version: ${process.versions.chrome}

=== ENVIRONMENT VARIABLES ===
PATH: ${process.env.PATH}
TEMP: ${process.env.TEMP}
TMP: ${process.env.TMP}
USERPROFILE: ${process.env.USERPROFILE}
APPDATA: ${process.env.APPDATA}
LOCALAPPDATA: ${process.env.LOCALAPPDATA}
NODE_ENV: ${process.env.NODE_ENV}
DIONE_BACKEND_PORT: ${process.env.DIONE_BACKEND_PORT}

=== NETWORK ===
Hostname: ${os.hostname()}
Network Interfaces:
${JSON.stringify(os.networkInterfaces(), null, 2)}
`;

		return systemInfo.trim();
	} catch (error) {
		logger.error("Error collecting system info:", error);
		return `Error collecting system information: ${error}`;
	}
}

/**
 * Exports all logs and system information as a zip file
 * @param destinationPath - The path where the zip file should be saved
 * @returns Path to the generated zip file
 */
export async function exportDebugLogs(destinationPath: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			const logsDir = app.getPath("logs");
			const zipPath = destinationPath;

			// create the zip archive
			const output = fs.createWriteStream(zipPath);
			const archive = archiver("zip", {
				zlib: { level: 9 }, // max compression
			});

			// handle stream events
			output.on("close", () => {
				logger.info(`Debug logs exported successfully: ${zipPath} (${archive.pointer()} bytes)`);
				resolve(zipPath);
			});

			archive.on("error", (err) => {
				logger.error("Error creating debug archive:", err);
				reject(err);
			});

			// pipe archive data to the file
			archive.pipe(output);

			// collect system information
			const systemInfo = await collectSystemInfo();
			archive.append(systemInfo, { name: "system-info.txt" });

			// add all log files from the logs directory
			if (fs.existsSync(logsDir)) {
				const logFiles = fs.readdirSync(logsDir);
				for (const file of logFiles) {
					const filePath = path.join(logsDir, file);
					if (fs.statSync(filePath).isFile()) {
						archive.file(filePath, { name: `logs/${file}` });
					}
				}
			}

			// add config file if it exists
			const configPath = path.join(app.getPath("userData"), "config.json");
			if (fs.existsSync(configPath)) {
				archive.file(configPath, { name: "config.json" });
			}

			// add database file if it exists
			const dbPath = path.join(app.getPath("userData"), "database.db");
			if (fs.existsSync(dbPath)) {
				archive.file(dbPath, { name: "database.db" });
			}

			// finalize the archive
			await archive.finalize();
		} catch (error) {
			logger.error("Error exporting debug logs:", error);
			reject(error);
		}
	});
}
