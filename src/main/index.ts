import fs from "node:fs";
import os from "node:os";
import path, { join } from "node:path";
import { defaultConfig, deleteConfig, readConfig, writeConfig } from "@/config";
import {
	destroyPresence,
	initializeDiscordPresence,
	updatePresence,
} from "@/discord/presence";
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
} from "@/security/secure-tokens";
import { initDefaultEnv } from "@/server/scripts/dependencies/environment";
import { start as startServer, stop as stopServer } from "@/server/server";
import logger, { getLogs } from "@/server/utils/logger";
import { exportDebugLogs } from "@/utils/export-logs";
import { getLocalNetworkIP } from "@/utils/network";
import {
	getCurrentTunnel,
	isTunnelActive,
	shortenUrl,
	startLocaltunnel,
	stopTunnel,
} from "@/utils/tunnel";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import macosIcon from "@resources/icon.icns?asset";
import icon from "@resources/icon.ico?asset";
import linuxIcon from "@resources/icon.png?asset";
import { config as dotenvConfig } from "dotenv";
import {
	BrowserWindow,
	Notification,
	Tray,
	app,
	dialog,
	globalShortcut,
	ipcMain,
	session,
	shell,
} from "electron";
import { autoUpdater } from "electron-updater";
import { machineIdSync } from "node-machine-id";
import si from "systeminformation";

dotenvConfig();

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient("dione");

// get icon path based on platform
function getIconPath(platform: string): string {
	try {
		switch (platform) {
			case "win32":
				return icon;
			case "darwin":
				return macosIcon;
			case "linux":
				return linuxIcon;
			default:
				return icon;
		}
	} catch (error) {
		logger?.error?.("Error getting icon path:", error) ||
			console.error("Error getting icon path:", error);
		// Fallback to a basic icon path
		const resourcesPath = app.isPackaged
			? path.join(process.resourcesPath)
			: path.join(__dirname, "../../resources");

		switch (platform) {
			case "win32":
				return path.join(resourcesPath, "icon.ico");
			case "darwin":
				return path.join(resourcesPath, "icon.icns");
			case "linux":
				return path.join(resourcesPath, "icon.png");
			default:
				return path.join(resourcesPath, "icon.ico");
		}
	}
}

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

const updateBackendPortState = (
	nextPort: number,
	options?: { broadcast?: boolean },
) => {
	process.env.DIONE_BACKEND_PORT = String(nextPort);
	if (options?.broadcast && mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.webContents.send("backend-port-changed", nextPort);
	}
};

const buildWindowOpenHandler = (
	_targetContents: Electron.WebContents | null | undefined,
): ((
	details: Electron.HandlerDetails,
) => Electron.WindowOpenHandlerResponse) => {
	return (details: Electron.HandlerDetails) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	};
};

const allowedMediaPermissions = new Set([
	"media",
	"audioCapture",
	"videoCapture",
]);

const getPermissionRequestOrigin = (
	details?:
		| Electron.PermissionRequest
		| Electron.FilesystemPermissionRequest
		| Electron.MediaAccessPermissionRequest
		| Electron.OpenExternalPermissionRequest,
) => {
	if (!details) return undefined;
	if ("securityOrigin" in details && typeof details.securityOrigin === "string") {
		return details.securityOrigin;
	}
	return details.requestingUrl;
};

const isTrustedMediaRequest = (requestingUrl?: string) => {
	if (!requestingUrl) return true;
	try {
		const url = new URL(requestingUrl);
		return (
			url.protocol === "https:" ||
			url.hostname === "localhost" ||
			url.hostname === "127.0.0.1"
		);
	} catch (error) {
		logger.warn("Failed to parse requestingUrl for media permission:", error);
		return false;
	}
};

const configurePermissionHandlers = () => {
	const sessionsToConfigure = [
		session.defaultSession,
		session.fromPartition("persist:webview"),
	];

	for (const targetSession of sessionsToConfigure) {
		try {
			targetSession.setPermissionRequestHandler(
				(_webContents, permission, callback, details) => {
					if (
						allowedMediaPermissions.has(permission) &&
						isTrustedMediaRequest(getPermissionRequestOrigin(details))
					) {
						callback(true);
						return;
					}

					callback(false);
				},
			);
		} catch (error) {
			logger.warn("Failed to set permission handler for session:", error);
		}
	}
};

// Creates the main application window with specific configurations.
function createWindow() {
	try {
		logger.info("Creating main window...");
		mainWindow = new BrowserWindow({
			width: 1200,
			height: 800,
			minWidth: 1200,
			minHeight: 800,
			show: false,
			center: true,
			autoHideMenuBar: true,
			titleBarStyle: process.platform === "darwin" ? "default" : "hidden",
			fullscreenable: true,
			maximizable: true,
			fullscreen: false,
			frame: process.platform === "darwin",
			// vibrancy: "fullscreen-ui", // macos
			backgroundColor: "rgba(0, 0, 0, 0.88)",
			...(process.platform === "win32"
				? { backgroundMaterial: "acrylic" }
				: {}),
			...(process.platform === "win32" ? { icon: getIconPath("win32") } : {}),
			...(process.platform === "linux"
				? { icon: getIconPath("linux"), vibrancy: "hud", roundedCorners: true }
				: {}),
			...(process.platform === "darwin"
				? { icon: getIconPath("darwin"), vibrancy: "hud" }
				: {}),
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
		logger.info("Main window created successfully");
	} catch (error) {
		logger.error("Error creating main window:", error);
		// Try to create a simpler window without icons
		mainWindow = new BrowserWindow({
			width: 1200,
			height: 800,
			show: false,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				preload: join(__dirname, "../preload/index.js"),
			},
		});
		logger.info("Fallback window created");
	}

	// Remove default menu from the window
	mainWindow.removeMenu();
	mainWindow.center();
	mainWindow.webContents.once("did-fail-load", () => {
		logger.error("Failed to load the main window content.");
		dialog.showErrorBox("Error", "Failed to load the main window content.");
	});

	// show the window when its ready
	mainWindow.once("ready-to-show", () => {
		logger.info("Main window ready to show");
		try {
			mainWindow.show();
			mainWindow.focus();
			logger.info("Main window shown and focused");
		} catch (error) {
			logger.error("Error showing main window:", error);
		}

		// check for updates
		autoUpdater.checkForUpdates();

		autoUpdater.on("update-available", () => {
			logger.info("New update available");
			mainWindow.webContents.send("update_available");
		});
		autoUpdater.on("update-downloaded", () => {
			logger.info("New update downloaded");
			mainWindow.webContents.send("update_downloaded");
		});
		autoUpdater.on("error", (err) => {
			logger.error("Error in autoUpdater", err);
		});

		const config = readConfig();
		const root = app.isPackaged
			? path.join(path.dirname(app.getPath("exe")))
			: path.join(process.cwd());

		if (config?.defaultBinFolder.toLowerCase() === root.toLowerCase()) {
			logger.warn(
				"Default bin folder is set to the current working directory. This may cause issues.",
			);
			dialog.showMessageBox({
				type: "warning",
				title: "Warning!",
				message:
					"To avoid potential errors when updating, please do not use on defaultBinFolder the same path as the Dione executable.",
			});
		}

		if (config?.defaultInstallFolder.toLowerCase() === root.toLowerCase()) {
			logger.warn(
				"Default install folder is set to the current working directory. This may cause issues.",
			);
			dialog.showMessageBox({
				type: "warning",
				title: "Warning!",
				message:
					"To avoid potential errors when updating, please do not use on defaultInstallFolder the same path as the Dione executable.",
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
			contents.setWindowOpenHandler(buildWindowOpenHandler(contents));
			contents.session.on("will-download", (_event, item) => {
				const fileName = item.getFilename() || "download";
				const savePath = dialog.showSaveDialogSync(mainWindow, {
					title: "Save File",
					buttonLabel: "Save",
					defaultPath: path.join(app.getPath("downloads"), fileName),
				});

				if (savePath) {
					item.setSavePath(savePath);
				} else {
					item.cancel();
				}
			});
		}
	});

	mainWindow.webContents.on("will-navigate", (event, url) => {
		if (url !== mainWindow.webContents.getURL()) {
			event.preventDefault();
			shell.openExternal(url);
		}
	});

	mainWindow.webContents.setWindowOpenHandler(
		buildWindowOpenHandler(mainWindow.webContents),
	);

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
	configurePermissionHandlers();

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
					details.requestHeaders?.origin?.[0] ||
					details.requestHeaders?.Origin?.[0];
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
				// biome-ignore lint/performance/noDelete: <explanation>
				delete headers["Access-Control-Allow-Origin"];
				// biome-ignore lint/performance/noDelete: <explanation>
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

	autoUpdater.autoInstallOnAppQuit = false;
	// autoUpdater.forceDevUpdateConfig = true;
	autoUpdater.logger = logger;
	autoUpdater.setFeedURL({
		provider: "github",
		owner: "dioneapp",
		repo: "dioneapp",
		private: false,
	});

	const config = readConfig();
	if (!config?.disableAutoUpdates) {
		autoUpdater.autoDownload = true;
		autoUpdater.autoRunAppAfterInstall = true;
	}

	// initialize rpc safety
	try {
		await initializeDiscordPresence();
	} catch (error) {
		logger.error("Failed to initialize Discord presence:", error);
	}

	// set tray icon safety
	app.setName("Dione");
	let appIcon: Tray | null = null;
	try {
		const iconPath = getIconPath(os.platform());
		appIcon = new Tray(iconPath);
		electronApp.setAppUserModelId("Dione");
		appIcon.setToolTip("Dione");
	} catch (error) {
		logger.error("Failed to create tray icon:", error);
	}

	// start backend
	port = await startServer();
	updateBackendPortState(port);

	// create window
	await createWindow();

	// Register global shortcuts
	globalShortcut.register("Control+R", () => {
		if (mainWindow.isFocused()) {
			console.log("Ctrl+R shortcut triggered");
			mainWindow.reload();
		}
	});

	if (!app.isPackaged) {
		globalShortcut.register("Control+Shift+I", () => {
			console.log("Ctrl+Shift+I shortcut triggered");
			if (BrowserWindow.getFocusedWindow()?.webContents.isDevToolsOpened()) {
				BrowserWindow.getFocusedWindow()?.webContents.closeDevTools();
			} else {
				BrowserWindow.getFocusedWindow()?.webContents.openDevTools({
					mode: "undocked",
				});
			}
		});
	}

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
		} else {
			if (config.defaultBinFolder !== config.defaultInstallFolder) {
				writeConfig({
					...config,
					defaultBinFolder: config.defaultInstallFolder,
					defaultInstallFolder: config.defaultInstallFolder,
				});
			}
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

	// remove temp files on exit
	app.on("before-quit", () => {
		try {
			logger.info("Removing temp files on exit...");
			const config = readConfig();
			const binFolder = path.join(
				config?.defaultBinFolder || path.join(app.getPath("userData")),
				"bin",
			);
			const tempFolder = path.join(binFolder, "temp");
			if (fs.existsSync(tempFolder)) {
				fs.rmSync(tempFolder, {
					recursive: true,
					force: true,
				});
			}
		} catch (error) {
			logger.error("Error removing temp files on exit:", error);
		}
	});

	ipcMain.on("ping", () => console.log("pong"));

	ipcMain.handle("app:close", async () => {
		mainWindow.hide();
		// close ollama (if running)
		await fetch(`http://localhost:${port}/ai/ollama/stop`, {
			method: "POST",
		});
		// close server
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

		// reject paths that contain whitespace characters
		if (typeof dirValue === "string" && /\s/.test(dirValue)) {
			logger.warn("Directory contains whitespace which is not allowed.");
			return false;
		}

		if (dirValue.toLowerCase() === root.toLowerCase()) {
			logger.warn(
				"Directory is set to the current working directory. This may cause issues.",
			);
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

		if (!fs.existsSync(path.join(updatedConfig.defaultInstallFolder, "apps"))) {
			fs.mkdirSync(path.join(updatedConfig.defaultInstallFolder, "apps"), {
				recursive: true,
			});
		}

		if (!fs.existsSync(path.join(updatedConfig.defaultBinFolder, "bin"))) {
			console.log("not exists");
			fs.mkdirSync(path.join(updatedConfig.defaultBinFolder, "bin"), {
				recursive: true,
			});
		}

		writeConfig(updatedConfig);
		logger.info("Config updated successfully");
		return updatedConfig;
	});

	ipcMain.handle("init-env", () => {
		logger.info("Starting with default env...");
		initDefaultEnv();
	});

	// open dir
	ipcMain.handle("open-dir", async (_event, path: string) => {
		await shell.openPath(path);
	});

	// Open external links
	ipcMain.handle("open-external-link", (_event, url) => {
		shell.openExternal(url);
	});

	ipcMain.handle("check-update", () => {
		autoUpdater.checkForUpdates();
	});

	ipcMain.handle("check-update-and-notify", () => {
		autoUpdater.checkForUpdatesAndNotify();
	});

	// export debug logs
	ipcMain.handle("export-debug-logs", async () => {
		try {
			// show save dialog
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const result = await dialog.showSaveDialog({
				title: "Save Debug Logs",
				defaultPath: `dione-debug-${timestamp}.zip`,
				filters: [
					{ name: "Zip Files", extensions: ["zip"] },
					{ name: "All Files", extensions: ["*"] },
				],
			});

			// if user cancelled, return
			if (result.canceled || !result.filePath) {
				return { success: false, canceled: true };
			}

			// export logs to the selected path
			const zipPath = await exportDebugLogs(result.filePath);

			// show the file in explorer/finder
			shell.showItemInFolder(zipPath);

			return { success: true, path: zipPath };
		} catch (error) {
			logger.error("Error exporting debug logs:", error);
			return { success: false, error: String(error) };
		}
	});

	ipcMain.on("restart_app", () => {
		autoUpdater.quitAndInstall();
	});

	ipcMain.on("quit_and_install", () => {
		autoUpdater.quitAndInstall();
	});

	ipcMain.on("download_and_restart", () => {
		autoUpdater.downloadUpdate();
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
			let data: any = null;
			try {
				const contentType = response.headers.get("content-type") || "";
				if (contentType.includes("application/json")) {
					data = await response.json();
				} else {
					const bodyText = await response.text();
					logger.warn(
						`/db/events returned non-JSON (${
							contentType || "unknown"
						}). Body: ${bodyText.slice(0, 200)}`,
					);
					data = { raw: bodyText };
				}
			} catch (e: any) {
				logger.error(`Failed to parse /db/events response: ${e?.message || e}`);
			}
			if (response.ok && response.status === 200) {
				if (data || data.id) {
					logger.info(`Session started with ID: ${data.id}`);
					sessionId = data.id;
				} else {
					logger.warn(
						"Session start response lacked an ID; skipping sessionId set.",
					);
				}
			} else {
				if (data && data.error === "Database connection not available") {
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

	// Get network address for sharing
	ipcMain.handle(
		"get-network-address",
		async (_event, requestedPort?: number) => {
			const networkIP = getLocalNetworkIP();
			const resolvedPort = requestedPort ?? port;

			if (!networkIP || !resolvedPort) {
				return null;
			}

			return {
				ip: networkIP,
				port: resolvedPort,
				url: `http://${networkIP}:${resolvedPort}`,
			};
		},
	);

	// Start tunnel (Localtunnel)
	ipcMain.handle(
		"start-tunnel",
		async (_event, type: "localtunnel", requestedPort?: number) => {
			try {
				const resolvedPort = requestedPort ?? port;
				if (!resolvedPort) {
					throw new Error("Server port not available");
				}

				logger.info(`Starting ${type} tunnel...`);

				const tunnelInfo = await startLocaltunnel(resolvedPort);

				logger.info(`Tunnel started: ${tunnelInfo.url}`);
				return tunnelInfo;
			} catch (error) {
				logger.error("Failed to start tunnel:", error);
				throw error;
			}
		},
	);

	// Stop tunnel
	ipcMain.handle("stop-tunnel", async () => {
		try {
			await stopTunnel();
			logger.info("Tunnel stopped successfully");
			return true;
		} catch (error) {
			logger.error("Failed to stop tunnel:", error);
			throw error;
		}
	});

	// Get current tunnel info
	ipcMain.handle("get-current-tunnel", () => {
		return getCurrentTunnel();
	});

	// Check if tunnel is active
	ipcMain.handle("is-tunnel-active", () => {
		return isTunnelActive();
	});

	// Shorten URL
	ipcMain.handle("shorten-url", async (_event, url: string) => {
		try {
			return await shortenUrl(url);
		} catch (error) {
			logger.error("Failed to shorten URL:", error);
			return null;
		}
	});

	ipcMain.handle("send-discord-report", async (_, data) => {
		if (is.dev) {
			return "dev-mode";
		}
		try {
			const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
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
			port = await startServer();
			updateBackendPortState(port, { broadcast: true });
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
		...(process.platform === "win32" ? { icon: getIconPath("win32") } : {}),
		...(process.platform === "linux" ? { icon: getIconPath("linux") } : {}),
		...(process.platform === "darwin" ? { icon: getIconPath("darwin") } : {}),
	});

	previewWindow.loadURL(url);
	previewWindow.maximize();
	previewWindow.focus();

	previewWindow.webContents.setWindowOpenHandler(
		buildWindowOpenHandler(previewWindow.webContents),
	);

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
	const defaultFolder =
		config?.defaultBinFolder ||
		config?.defaultInstallFolder ||
		path.join(app.getPath("userData"));

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
			let files: string[];
			try {
				files = await fs.promises.readdir(dir);
			} catch (err) {
				// Directory might have been deleted between readdir and stat
				console.warn(`Failed to read directory: ${dir}`, err);
				return;
			}

			for (const file of files) {
				const filePath = path.join(dir, file);
				let stat;
				try {
					stat = await fs.promises.stat(filePath);
				} catch (err) {
					// File might have been deleted between readdir and stat
					console.warn(`Failed to stat file: ${filePath}`, err);
					continue;
				}

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

	try {
		const sizeBytes = await getFolderSize(folderPath);
		const sizeGB = sizeBytes / (1024 * 1024 * 1024);
		return `${sizeGB.toFixed(2)}`;
	} catch (err) {
		console.error("Error occurred in handler for 'check-folder-size':", err);
		return "0.00";
	}
});

ipcMain.handle("delete-folder", async (_event, folderPath) => {
	const config = readConfig();

	if (!folderPath) {
		folderPath = path.join(
			config?.defaultBinFolder ||
				config?.defaultInstallFolder ||
				path.join(app.getPath("userData"), "bin", "cache"),
		);
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

ipcMain.handle("capture-screenshot", async (event, options = {}) => {
	const win = BrowserWindow.fromWebContents(event.sender);
	if (!win) return;

	const image = await win.webContents.capturePage(options?.rect);
	const buffer = image.toJPEG(100);
	const name = `screenshot_${Date.now()}.jpg`;

	const { canceled, filePath } = await dialog.showSaveDialog(win, {
		defaultPath: name,
		filters: [{ name: "JPEG", extensions: ["jpg", "jpeg"] }],
	});

	if (canceled || !filePath) return null;

	await fs.promises.writeFile(filePath, buffer);
	return filePath;
});

// Quit the application when all windows are closed, except on macOS.
app.on("window-all-closed", async () => {
	await destroyPresence();
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// Ensure global shortcuts are released on quit
app.on("will-quit", () => {
	try {
		globalShortcut.unregisterAll();
		logger.info("All global shortcuts unregistered");
	} catch (e) {
		logger.warn("Failed to unregister shortcuts on quit", e);
	}
});

autoUpdater.on("update-available", () => {
	mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send("update_downloaded");
});
