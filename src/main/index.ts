import fs from "node:fs";
import os from "node:os";
import path, { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import {
	BrowserWindow,
	Tray,
	app,
	dialog,
	globalShortcut,
	ipcMain,
	session,
	shell,
} from "electron";
import { Notification } from "electron";
import { autoUpdater } from "electron-updater";
import { machineIdSync } from "node-machine-id";
import si from "systeminformation";
import macosIcon from "../../resources/icon.icns?asset";
import icon from "../../resources/icon.ico?asset";
import { defaultConfig, deleteConfig, readConfig, writeConfig } from "./config";
import {
	destroyPresence,
	initializeDiscordPresence,
	updatePresence,
} from "./discord/presence";
import {
	deleteExpiresAt,
	deleteId,
	deleteToken,
	getExpiresAt,
	getId,
	getToken,
	saveExpiresAt,
	saveId,
	saveToken,
} from "./security/secure-tokens";
import { initDefaultEnv } from "./server/scripts/dependencies/environment";
import { start as startServer, stop as stopServer } from "./server/server";
import { getCurrentPort } from "./server/utils/getPort";
import logger, { getLogs } from "./server/utils/logger";

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient("dione");

// If we are running a non-packaged version of the app && on windows
if (process.env.NODE_ENV === "development" && process.platform === "win32") {
	// set the path of the app on node_modules/electron/electron.exe
	if (process.argv.length >= 2) {
		app.setAsDefaultProtocolClient("dione", process.execPath, [
			path.resolve(process.argv[1]),
		]);
	} else {
		app.setAsDefaultProtocolClient("dione");
	}
} else {
	app.setAsDefaultProtocolClient("dione");
}

// define main window
let mainWindow: BrowserWindow;
let port: number;
let sessionId: string;

// Creates the main application window with specific configurations.
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 800,
		show: false,
		center: true,
		autoHideMenuBar: true,
		titleBarStyle: process.platform === "darwin" ? "default" : "hidden",
		fullscreenable: false,
		maximizable: true,
		fullscreen: false,
		frame: process.platform === "darwin" ? true : false,
		// vibrancy: "fullscreen-ui", // macos
		backgroundColor: "rgba(0, 0, 0, 0.88)",
		...(process.platform === "win32" ? { backgroundMaterial: "acrylic" } : {}),
		...(process.platform === "win32" ? { icon } : {}),
		...(process.platform === "linux" ? { icon } : {}),
		...(process.platform === "darwin" ? { icon: macosIcon } : {}),
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			webviewTag: true,
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
			...(process.platform === "linux"
				? {
						enableRemoteModule: false,
						webSecurity: false,
						allowRunningInsecureContent: true,
					}
				: {}),
		},
	});

	// Remove default menu from the window
	mainWindow.removeMenu();

	mainWindow.webContents.once("did-fail-load", () => {
		logger.error("Failed to load the main window content.");
		dialog.showErrorBox("Error", "Failed to load the main window content.");
	});

	// show the window when its ready
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		mainWindow.focus();
		if (!app.isPackaged) {
			// in development mode, show the window and open dev tools
			mainWindow.show();
			mainWindow.focus();
			mainWindow.webContents.openDevTools({ mode: "undocked" });
		} else {
			checkForUpdates()
				.then(() => {
					logger.info("Checked for updates successfully.");
				})
				.catch((err) => {
					logger.error("Error checking for updates:", err);
				});
		}

		async function checkForUpdates(): Promise<void> {
			return new Promise((resolve) => {
				let updateDownloaded = false;

				autoUpdater.on("update-available", () => {
					logger.info("Update available, downloading...");
				});

				autoUpdater.on("update-downloaded", () => {
					logger.info("Update downloaded, installing...");
					updateDownloaded = true;
					mainWindow.webContents.send("update_downloaded");
				});

				autoUpdater.on("update-not-available", () => {
					logger.info("No update available");
					resolve();
				});

				autoUpdater.on("error", (err) => {
					logger.error("Error in autoUpdater", err);
					resolve();
				});

				autoUpdater.checkForUpdates();

				// if in 3s doesn't have any info about update, resolve
				setTimeout(() => {
					if (!updateDownloaded) resolve();
				}, 3000);
			});
		}

		const config = readConfig();
		const root = app.isPackaged
			? path.join(path.dirname(app.getPath("exe")))
			: path.join(process.cwd());

		if (config?.defaultBinFolder.toLowerCase() === root.toLowerCase()) {
			logger.warn("Default bin folder is set to the current working directory. This may cause issues.");
			dialog.showMessageBox({
				type: "warning",
				title: "Warning!",
				message: "To avoid potential errors when updating, please do not use on defaultBinFolder the same path as the Dione executable.",
			});
		}

		if (config?.defaultInstallFolder.toLowerCase() === root.toLowerCase()) {
			logger.warn("Default install folder is set to the current working directory. This may cause issues.");
			dialog.showMessageBox({
				type: "warning",
				title: "Warning!",
				message: "To avoid potential errors when updating, please do not use on defaultInstallFolder the same path as the Dione executable.",
			});
		}
	});

	if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");

	const handleDeepLink = (url: string | undefined) => {
		try {
			if (!url) {
				alert("Not found any data for login, please report this error.");
				logger.error("No url received");
				return;
			}

			const queryString = `?${url.replace(/^dione:\/\//, "")}`;
			const params = new URLSearchParams(queryString);

			const authToken = params.get("auth");
			if (authToken) {
				mainWindow.webContents.send("auth-token", authToken);
			} else {
				logger.error("Not found auth token in deep link");
			}

			const refreshToken = params.get("refresh");
			if (refreshToken) {
				mainWindow.webContents.send("refresh-token", refreshToken);
			} else {
				logger.error("Not found refresh token in deep link");
			}

			const downloadUrl = params.get("download");
			if (downloadUrl) {
				mainWindow.webContents.send("download", downloadUrl);
			} else {
				logger.error("No download param in deep link");
			}
		} catch (error) {
			alert("Error handling deep link, please report this error.");
			logger.error("Error handling deep link:", error);
		}
	};

	app.on("open-url", (event, url) => {
		event.preventDefault();
		handleDeepLink(url);
	});

	app.on("web-contents-created", (_e, contents) => {
		if (contents.getType() === "webview") {
			contents.setWindowOpenHandler((details) => {
				shell.openExternal(details.url);
				return { action: "deny" };
			});
		}
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});

	const gotTheLock = app.requestSingleInstanceLock();
	if (!gotTheLock) {
		app.quit();
		process.exit(0);
	} else {
		app.on("second-instance", (_event, commandLine) => {
			if (mainWindow) {
				if (mainWindow.isMinimized()) mainWindow.restore();
				mainWindow.focus();
			}

			handleDeepLink(commandLine.pop()?.replace(/\/$/, ""));
		});
	}

	// Load renderer content (URL in development, HTML file in production)
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	// add ipc handler for maximize/restore
	ipcMain.handle("app:toggle-maximize", () => {
		if (!mainWindow) return false;
		if (mainWindow.isMaximized()) {
			mainWindow.unmaximize();
			return false;
		}
		mainWindow.maximize();
		return true;
	});
}

// Sets up the application when ready.
app.whenReady().then(async () => {
	logger.info("Starting app...");

	// initialize environment variables
	initDefaultEnv();

	// map to store request origins
	const requestOrigins = new Map<string, string>();

	// set up CORS for localhost
	session.defaultSession.webRequest.onBeforeSendHeaders(
		{ urls: ["http://localhost:*/*", "http://127.0.0.1:*/*"] },
		(details, callback) => {
			const headers = { ...details.requestHeaders };
			const url = new URL(details.url);

			// only apply configurations for localhost/127.0.0.1
			if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
				headers.Origin = `${url.protocol}//${url.hostname}:${url.port}`;
				headers.Host = `${url.hostname}:${url.port}`;

				// Guardar el origen del request para usar en onHeadersReceived
				const requestOrigin =
					details.requestHeaders?.["origin"]?.[0] ||
					details.requestHeaders?.["Origin"]?.[0];
				if (requestOrigin && details.id) {
					requestOrigins.set(details.id.toString(), requestOrigin);
				}
			}

			callback({ requestHeaders: headers });
		},
	);

	// secure CORS
	session.defaultSession.webRequest.onHeadersReceived(
		{ urls: ["http://localhost:*/*", "http://127.0.0.1:*/*"] },
		(details, callback) => {
			const headers = { ...details.responseHeaders };
			const url = new URL(details.url);

			// only apply configurations for localhost/127.0.0.1
			if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
				// clean
				delete headers["Access-Control-Allow-Origin"];
				delete headers["access-control-allow-origin"];
				// get request origin
				const requestOrigin = details.id
					? requestOrigins.get(details.id.toString())
					: null;

				// check origin
				let allowedOrigin = "*";
				if (requestOrigin) {
					try {
						const originUrl = new URL(requestOrigin);
						if (
							originUrl.hostname === "localhost" ||
							originUrl.hostname === "127.0.0.1"
						) {
							allowedOrigin = requestOrigin;
						}
					} catch (e) {
						// if fails, use fallback
						// allowedOrigin = '*';
					}
				}

				// custom CORS rules
				headers["Access-Control-Allow-Origin"] = [allowedOrigin];
				headers["Access-Control-Allow-Methods"] = [
					"GET",
					"POST",
					"PUT",
					"DELETE",
					"OPTIONS",
				];
				headers["Access-Control-Allow-Headers"] = ["*"];
				headers["Access-Control-Allow-Credentials"] = ["true"];
				headers["X-Frame-Options"] = ["SAMEORIGIN"];

				// clean up
				if (details.id) {
					requestOrigins.delete(details.id.toString());
				}

				// configure CSP for localhost
				if (headers["Content-Security-Policy"]) {
					headers["Content-Security-Policy"] = headers[
						"Content-Security-Policy"
					]
						.map((v) => {
							// clean frame-ancestors directive
							return v.replace(
								/frame-ancestors[^;]*;?/gi,
								`frame-ancestors 'self' http://localhost:* http://127.0.0.1:* file: app:;`,
							);
						})
						.filter((v) => v.trim() !== "");
				} else {
					// if no CSP, create a basic one that allows frames from localhost
					headers["Content-Security-Policy"] = [
						`frame-ancestors 'self' http://localhost:* http://127.0.0.1:* file: app:;`,
					];
				}

				// security headers
				headers["X-Content-Type-Options"] = ["nosniff"];
				headers["X-XSS-Protection"] = ["1; mode=block"];
				headers["Referrer-Policy"] = ["strict-origin-when-cross-origin"];
			}

			callback({ responseHeaders: headers });
		},
	);

	// autoUpdater.forceDevUpdateConfig = true;
	autoUpdater.logger = logger;
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;
	autoUpdater.setFeedURL({
		provider: "github",
		owner: "dioneapp",
		repo: "dioneapp",
		private: false,
	});

	// Initialize Discord presence
	await initializeDiscordPresence();

	// Set up tray icon
	app.setName("Dione");
	let appIcon: Tray;
	switch (os.platform()) {
		// add the appropriate icon for the platform
		case "win32":
			appIcon = new Tray(path.resolve(__dirname, "../../resources/icon.ico"));
			break;
		case "darwin":
			appIcon = new Tray(path.resolve(__dirname, "../../resources/icon.icns"));
			break;
		case "linux":
			appIcon = new Tray(path.resolve(__dirname, "../../resources/icon.png"));
			break;
		default:
			appIcon = new Tray(path.resolve(__dirname, "../../resources/icon.ico"));
			break;
	}
	electronApp.setAppUserModelId("Dione");
	appIcon.setToolTip("Dione");

	// Start the server
	port = await startServer();

	// Create the main application window
	createWindow();

	// Register global shortcuts
	globalShortcut.register("Control+R", () => {
		console.log("Ctrl+R shortcut triggered");
		if (BrowserWindow.getFocusedWindow()) {
			BrowserWindow.getFocusedWindow()?.reload();
		}
	});

	// Automatically manage development shortcuts and production optimizations
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	// Set up IPC handlers
	ipcMain.handle("check-first-launch", () => {
		let config = readConfig();
		if (!config) {
			logger.warn("First time using Dione");
			writeConfig(defaultConfig);
			return true;
		}
		config = readConfig();
		return false;
	});

	ipcMain.handle("delete-config", () => {
		deleteConfig();
	});

	ipcMain.on("socket-ready", () => {
		logger.info("Server started successfully");
	});

	ipcMain.on("socket-error", () => {
		logger.error("Socket connection failed");
	});

	ipcMain.on("ping", () => console.log("pong"));

	ipcMain.handle("app:close", async () => {
		mainWindow.hide();

		try {
			await Promise.race([
				await destroyPresence(),
				await handleEndSession(),
				await stopServer(),
				new Promise((_, reject) =>
					setTimeout(reject, 10000, new Error("Server stop timeout")),
				),
			]);
		} catch (error) {
			logger.error("Error during shutdown:", error);
		} finally {
			app.quit();
		}
	});

	ipcMain.handle("app:minimize", () => {
		const win = BrowserWindow.getFocusedWindow();
		if (win) {
			win.minimize();
			win.webContents.send("app:minimized");
		}
	});

	// emit restore event
	if (mainWindow) {
		mainWindow.on("restore", () => {
			mainWindow.webContents.send("app:restored");
		});
	}

	ipcMain.handle("get-version", () => app.getVersion());

	// Add Discord presence update handler
	ipcMain.handle(
		"update-discord-presence",
		(_event, details: string, state: string) => {
			updatePresence(details, state);
		},
	);

	// notifications
	ipcMain.handle(
		"notify",
		(_event, title: string, body: string, xml?: string) => {
			const settings = readConfig();
			const options: Electron.NotificationConstructorOptions = {
				title,
				body,
				icon: path.resolve(__dirname, "../../resources/icon.ico"),
				timeoutType: "default",
				toastXml: xml ? xml : undefined,
			};

			if (settings?.enableDesktopNotifications) {
				const notification = new Notification(options);

				notification.show();
			} else {
				logger.warn(
					`Notification attempt... Notifications are disabled. enableDesktopNotifications: ${settings?.enableDesktopNotifications}`,
				);
			}
		},
	);

	// save dir
	ipcMain.handle("save-dir", async (_event, path: string) => {

		if (!path) {
			path = app.getPath("desktop");
		}

		const result = await dialog.showOpenDialog({
			defaultPath: path,
			properties: ["openDirectory"],
			title: "Select a directory",
			message: "Select a directory",
			securityScopedBookmarks: true,
		});

		return result;
	});

	// select file
	ipcMain.handle("select-file", async (_event, path: string) => {
		const result = await dialog.showOpenDialog({
			defaultPath: path,
			properties: ["openFile"],
			title: "Select a file",
			message: "Select a file",
			filters: [{ name: "Dione Config File", extensions: ["json"] }],
			securityScopedBookmarks: true,
		});

		return result;
	});

	// check dir 
	ipcMain.handle("check-dir", async (_event, dirValue: string) => {
		const root = app.isPackaged
			? path.join(path.dirname(app.getPath("exe")))
			: path.join(process.cwd());

		if (dirValue.toLowerCase() === root.toLowerCase()) {
			logger.warn("Directory is set to the current working directory. This may cause issues.");
			return false;
		} 

		return true;
	});

	// update config
	ipcMain.handle("update-config", (_event, newValue: any) => {
		let currentConfig = readConfig();
		if (!currentConfig) {
			logger.warn("No config found, creating a new one");
			writeConfig(defaultConfig);
			currentConfig = defaultConfig;
		}
		const updatedConfig = { ...currentConfig, ...newValue };
		writeConfig(updatedConfig);
		logger.info("Config updated successfully");
		return updatedConfig;
	});

	// open dir
	ipcMain.handle("open-dir", async (_event, path: string) => {
		await shell.openPath(path);
	});

	// Retrieve the current port
	ipcMain.handle("get-current-port", async () => {
		const port = await getCurrentPort();
		return port;
	});

	// Open external links
	ipcMain.handle("open-external-link", (_event, url) => {
		shell.openExternal(url);
	});

	ipcMain.handle("check-update", () => {
		autoUpdater.checkForUpdates();
	});

	ipcMain.on("restart_app", () => {
		autoUpdater.quitAndInstall();
	});

	ipcMain.on("restart", () => {
		app.relaunch();
		app.exit();
	});

	async function handleStartSession({ user }: { user: any }) {
		if (!port) return;
		if (sessionId) return;
		if (!app.isPackaged) return;

		if (user) {
			const response = await fetch(`http://localhost:${port}/db/events`, {
				method: "POST",
				headers: {
					user: user.id,
					type: "event",
					event: "session",
					started_at: new Date().toISOString(),
				},
			});
			const data = await response.json();
			if (response.ok && response.status === 200) {
				logger.info(`Session started with ID: ${data.id}`);
				sessionId = data.id;
			} else {
				if (data.error === "Database connection not available") {
					logger.error(
						"Database connection not available, please check your environment variables and your connection.",
					);
					return;
				}
				logger.error("Failed to start session");
				logger.error(response.statusText);
			}
		}
	}

	async function handleEndSession() {
		if (sessionId) {
			if (!app.isPackaged) return;

			logger.info(`Ending session with ID: ${sessionId}`);
			const response = await fetch(`http://localhost:${port}/db/events`, {
				method: "POST",
				headers: {
					id: sessionId,
					update: "true",
				},
			});
			if (response.ok) {
				logger.info("Session ended successfully");
				return true;
			}
			logger.error("Failed to end session");
			logger.error(response.statusText);
			return false;
		}
		logger.info("No session to end");
		return false;
	}

	ipcMain.on("start-session", (_event, { user }) => {
		handleStartSession({ user });
	});
	ipcMain.handle("end-session", async (_event) => {
		const result = await handleEndSession();
		return result;
	});

	// handle protocols
	if (process.env.NODE_ENV !== "development") {
		app.setAsDefaultProtocolClient("dione");
	}

	// Handle reactivation of the app (e.g., clicking the dock icon on macOS)
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	ipcMain.handle("send-discord-report", async (_, data) => {
		if (!app.isPackaged) {
			return "dev-mode";
		}
		try {
			const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
			if (!webhookUrl) {
				throw new Error("Discord webhook URL not configured");
			}

			const response = await fetch(webhookUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to send report: ${response.statusText}`);
			}

			return true;
		} catch (err) {
			logger.error("Failed to send Discord report:", err);
			return false;
		}
	});

	ipcMain.handle("get-logs", async () => {
		return getLogs();
	});

	// Set up IPC handlers
	ipcMain.handle("get-hwid", () => {
		return machineIdSync(true); // true for hashed version
	});

	// handle secure token
	ipcMain.handle("secure-token:save", (_event, token: string) => {
		return saveToken(token);
	});

	ipcMain.handle("secure-token:get", () => {
		return getToken();
	});

	ipcMain.handle("secure-token:delete", () => {
		return deleteToken();
	});

	ipcMain.handle("secure-token:save-expiresAt", (_event, expiresAt: number) => {
		return saveExpiresAt(expiresAt);
	});

	ipcMain.handle("secure-token:get-expiresAt", () => {
		return getExpiresAt();
	});

	ipcMain.handle("secure-token:delete-expiresAt", () => {
		return deleteExpiresAt();
	});

	ipcMain.handle("secure-token:save-id", (_event, id: string) => {
		return saveId(id);
	});

	ipcMain.handle("secure-token:get-id", () => {
		return getId();
	});

	ipcMain.handle("secure-token:delete-id", () => {
		return deleteId();
	});

	// restart backend
	ipcMain.handle("restart-backend", async () => {
		try {
			logger.info("Restarting backend...");
			await Promise.race([
				await stopServer(),
				new Promise((_, reject) =>
					setTimeout(reject, 10000, new Error("Server stop timeout")),
				),
			]);
			const port = await startServer();
			// refresh environment variables
			// if (os.platform() === "win32") {
			// 	refreshPathFromSystem();
			// }
			logger.info(`Backend restarted successfully on port ${port}`);
			return port;
		} catch (error) {
			logger.error("Error restarting backend:", error);
			throw error;
		}
	});

	// system usage monitoring
	ipcMain.handle("get-system-usage", async () => {
		try {
			try {
				// get cpu usage
				const cpuLoad = await si.currentLoad();
				const cpuUsage = cpuLoad.currentLoad;

				// get memory usage
				const mem = await si.mem();
				const ramUsage = {
					percent: (mem.used / mem.total) * 100,
					usedGB: mem.used / (1024 * 1024 * 1024),
				};

				// get disk usage
				const diskUsage = await si.fsSize();
				const diskUsagePercent = diskUsage[0].used / diskUsage[0].size;

				const result = {
					cpu: cpuUsage,
					ram: ramUsage,
					disk: diskUsagePercent,
				};

				return result;
			} catch (siError) {
				logger.warn(
					"Error getting system usage, returning only ram usage:",
					siError,
				);

				// get memory usage
				const totalMem = os.totalmem();
				const freeMem = os.freemem();
				const usedMem = totalMem - freeMem;
				const ramUsage = {
					percent: (usedMem / totalMem) * 100,
					usedGB: usedMem / (1024 * 1024 * 1024),
				};

				const result = {
					ram: ramUsage,
				};

				return result;
			}
		} catch (error) {
			return {
				cpu: 0,
				ram: { percent: 0, usedGB: 0 },
				disk: 0,
			};
		}
	});
});

let previewWindow: BrowserWindow | null = null;

ipcMain.on("new-window", (_event, url) => {
	if (previewWindow && !previewWindow.isDestroyed()) {
		previewWindow.focus();
		return;
	}

	previewWindow = new BrowserWindow({
		width: 600,
		height: 400,
		autoHideMenuBar: true,
		closable: true,
		...(process.platform === "win32" ? { icon } : {}),
		...(process.platform === "linux" ? { icon } : {}),
		...(process.platform === "darwin" ? { icon: macosIcon } : {}),
	});

	previewWindow.loadURL(url);
	previewWindow.maximize();
	previewWindow.focus();

	previewWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});

	previewWindow.on("close", () => {
		console.log("Closing preview window...");
		previewWindow?.destroy();
	});

	previewWindow.on("closed", () => {
		previewWindow = null;
		console.log("Preview window destroyed");
	});
});

ipcMain.on("close-preview-window", () => {
	if (previewWindow) {
		previewWindow.destroy();
	}
});

ipcMain.handle("check-folder-size", async (_event, folderPath) => {
	const config = readConfig();
	const defaultFolder = config?.defaultBinFolder || path.join(app.getPath("userData"));

	if (!folderPath) {
		folderPath = path.join(defaultFolder, "bin", "cache");
	}

	if (!fs.existsSync(folderPath)) {
		console.warn(`Folder does not exist: ${folderPath}`);
		return "0.00";
	}

	async function getFolderSize(folderPath: string): Promise<number> {
		let totalSize = 0;

		async function walk(dir: string) {
			const files = await fs.promises.readdir(dir);

			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = await fs.promises.stat(filePath);

				if (stat.isDirectory()) {
					await walk(filePath);
				} else {
					totalSize += stat.size;
				}
			}
		}

		await walk(folderPath);
		return totalSize;
	}

	const sizeBytes = await getFolderSize(folderPath);
	const sizeGB = sizeBytes / (1024 * 1024 * 1024);
	return `${sizeGB.toFixed(2)}`;
});

ipcMain.handle("delete-folder", async (_event, folderPath) => {
	const config = readConfig()

	if (!folderPath) {
		folderPath = path.join(config?.defaultBinFolder || path.join(app.getPath("userData"), "bin", "cache"));
	}

	if (!fs.existsSync(folderPath)) {
		console.warn(`Folder does not exist: ${folderPath}`);
		return true;
	}

	try {
		await fs.promises.rm(folderPath, { recursive: true, force: true });
		return true;
	} catch (error) {
		console.error("Error deleting folder:", error);
		return false;
	}
});

// Quit the application when all windows are closed, except on macOS.
app.on("window-all-closed", async () => {
	await destroyPresence();
	if (process.platform !== "darwin") {
		app.quit();
	}
});

autoUpdater.on("update-available", () => {
	mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send("update_downloaded");
});
