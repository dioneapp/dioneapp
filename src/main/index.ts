import os from "node:os";
import path, { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import dotenv from "dotenv";
import {
	BrowserWindow,
	Tray,
	app,
	dialog,
	globalShortcut,
	ipcMain,
	shell,
} from "electron";
import { Notification } from "electron";
import { autoUpdater } from "electron-updater";
import icon from "../../resources/icon.ico?asset";
import { defaultConfig, readConfig, writeConfig } from "./config";
import {
	destroyPresence,
	initializeDiscordPresence,
	updatePresence,
} from "./discord/presence";
import { sendErrorToDiscord } from "./discordWebhookService";
import { start as startServer, stop as stopServer } from "./server/server";
import { getCurrentPort } from "./server/utils/getPort";
import logger from "./server/utils/logger";

// load env variables
dotenv.config();

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
		autoHideMenuBar: true,
		titleBarStyle: "hidden",
		icon: icon,
		fullscreenable: false,
		maximizable: false,
		fullscreen: false,
		frame: false,
		// window effects
		vibrancy: "fullscreen-ui", // macos
		backgroundMaterial: "acrylic", // windows 11
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
	});

	// Remove default menu from the window
	mainWindow.removeMenu();

	mainWindow.once("ready-to-show", () => {
		// autoUpdater.forceDevUpdateConfig = true;
		autoUpdater.logger = logger;
		autoUpdater.autoDownload = true;
		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.setFeedURL({
			provider: "github",
			owner: "dioneapp",
			repo: "dioneapp",
			private: true,
			token: process.env.GH_TOKEN,
		});
		autoUpdater.checkForUpdatesAndNotify();
	});

	// Show the window when ready
	mainWindow.webContents.once("did-finish-load", () => {
		mainWindow.show();
		mainWindow.focus();
	});

	// Prevent opening new windows and handle external links
	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
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
}

// Sets up the application when ready.
app.whenReady().then(async () => {
	logger.info("Starting app...");

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

	// Register global shortcuts
	globalShortcut.register("Control+R", () => {
		console.log("Ctrl+R shortcut triggered");
		if (BrowserWindow.getFocusedWindow()) {
			BrowserWindow.getFocusedWindow()?.reload();
		}
	});

	globalShortcut.register('CommandOrControl+Shift+R', () => {
		logger.info('Global shortcut CommandOrControl+Shift+R triggered for reporting an issue.');
		if (mainWindow) {
			// Focus the main window
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();

			// Send IPC message to renderer to open the report dialog/page
			mainWindow.webContents.send('open-report-page');
		} else {
			logger.warn('Main window not available to open report page via shortcut.');
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

	ipcMain.on("socket-ready", () => {
		logger.info("Server started successfully");
	});

	ipcMain.on("socket-error", () => {
		logger.error("Socket connection failed");
	});

	ipcMain.on("ping", () => console.log("pong"));

	ipcMain.handle("app:close", async () => {
		mainWindow.hide();
		await destroyPresence();
		await handleEndSession();
		await stopServer();
		app.quit();
		logger.info("App stopped successfully");
	});

	ipcMain.handle("app:minimize", () => {
		BrowserWindow.getFocusedWindow()?.minimize();
	});

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
		const result = await dialog.showOpenDialog({
			defaultPath: path,
			properties: ["openDirectory"],
			title: "Select a directory",
			message: "Select a directory",
			securityScopedBookmarks: true,
		});

		return result;
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
			if (response.ok && response.status === 200) {
				const data = await response.json();
				logger.info(`Session started with ID: ${data.id}`);
				sessionId = data.id;
			} else {
				logger.error("Failed to start session");
				logger.error(response.statusText);
			}
		}
	}

	async function handleEndSession() {
		if (sessionId) {
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
	ipcMain.handle("end-session", async () => {
		const result = await handleEndSession();
		return result;
	});

	ipcMain.handle('manual-report-error', async (_event, reportPayload) => {
		logger.info('Received manual error report from renderer:', reportPayload);

		const error = new Error(reportPayload.message || 'User reported an issue.');
		error.name = reportPayload.name || 'ManualReport';
		if (reportPayload.stack) {
			error.stack = reportPayload.stack;
		}

		// Use componentStack as additionalInfo if present
		const additionalInfo = reportPayload.componentStack
			? `Component Stack:
\`\`\`
${reportPayload.componentStack}
\`\`\``
			: undefined;

		try {
			await sendErrorToDiscord(error, additionalInfo, reportPayload.userDescription);
			return { success: true };
		} catch (e) {
			logger.error('Failed to send manual report to Discord:', e);
			// It's important to throw an error here if the renderer is awaiting a response
			// and needs to know if the operation failed.
			// The invoke call in the renderer will catch this rejection.
			throw new Error('Failed to send report to Discord.');
		}
	});

	// Create the main application window
	createWindow();

	// handle protocols
	if (process.env.NODE_ENV !== "development") {
		app.setAsDefaultProtocolClient("dione");
	}

	// Handle reactivation of the app (e.g., clicking the dock icon on macOS)
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit the application when all windows are closed, except on macOS.
app.on("window-all-closed", async () => {
	await destroyPresence();
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

autoUpdater.on("update-available", () => {
	mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send("update_downloaded");
});

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  sendErrorToDiscord(error, 'Unhandled Synchronous Error (Uncaught Exception)');
  // It's generally recommended to restart the process after an uncaught exception
  // For now, we'll just log and send to Discord. Consider process.exit(1) in production.
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason instanceof Error) {
    sendErrorToDiscord(reason, 'Unhandled Asynchronous Error (Unhandled Rejection)');
  } else {
    sendErrorToDiscord(new Error(String(reason)), 'Unhandled Asynchronous Error (Unhandled Rejection - Non-Error Reason)');
  }
});
