import {
	app,
	shell,
	BrowserWindow,
	ipcMain,
	Tray,
	globalShortcut,
} from "electron";
import path, { join } from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.ico?asset";
import logger from "./server/utils/logger";
import { start as startServer, stop as stopServer } from "./server/server";
import { getCurrentPort } from "./server/utils/getPort";
import os from "node:os";
import { readConfig, defaultConfig, writeConfig } from "./config";
import { Notification } from "electron";
import { autoUpdater } from "electron-updater";
import dotenv from "dotenv";

// load env variables
dotenv.config();

// set default protocol client
if (process.defaultApp) {
	if (process.argv.length >= 2) {
		app.setAsDefaultProtocolClient("dione", process.execPath, [
			path.resolve(process.argv[1]),
		]);
	} else {
		app.setAsDefaultProtocolClient("dione");
	}
}

// define main window
let mainWindow;
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
		autoUpdater.forceDevUpdateConfig = true;
		autoUpdater.logger = logger;
		autoUpdater.autoDownload = true;
		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.setFeedURL({
			provider: "github",
			owner: "dioneapp",
			repo: "dioneapp",
			private: true,
			token: process.env.GITHUB_TOKEN,
		})
		autoUpdater.checkForUpdatesAndNotify();
	});

	// Show the window when ready
	mainWindow.webContents.once("did-finish-load", () => {
		mainWindow.show();
	});


	// Prevent opening new windows and handle external links
	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	if (process.platform === "linux") app.commandLine.appendSwitch("no-sandbox");

	const handleDeepLink = (url) => {
		try {
			const cleanUrl = url.replace(/^dione:\/\//, "");
			const authMatch = cleanUrl.match(/auth=([^&]+)/);
			if (authMatch) {
				const authToken = authMatch[1];
				mainWindow.webContents.send("auth-token", authToken);
			} else {
				console.error("Not found auth token in deep link");
			}
			const refreshMatch = cleanUrl.match(/refresh=([^&]+)/);
			if (refreshMatch) {
				const refreshToken = refreshMatch[1];
				mainWindow.webContents.send("refresh-token", refreshToken);
			} else {
				console.error("Not found refresh token in deep link");
			}

			const downloadMatch = cleanUrl.match(/download=([^&]+)/);
			if (downloadMatch) {
				const downloadUrl = downloadMatch[1];
				mainWindow.webContents.send("download", downloadUrl);
			} else {
				console.error("Not found download in deep link");
			}
		} catch (error) {
			logger.error("Error handling deep link:", error);
		}
	};

	app.on("open-url", handleDeepLink);

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

			handleDeepLink(commandLine.pop());
		});
	}

	// Load renderer content (URL in development, HTML file in production)
	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
}

// Sets up the application when ready.
app.whenReady().then(() => {
	logger.info("Starting app...");

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
	startServer();

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
		} else {
			config = readConfig();
			return false;
		}
	});

	ipcMain.on("socket-ready", () => {
		logger.info("Server started successfully");
	});

	ipcMain.on("socket-error", () => {
		logger.error("Socket connection failed");
	});

	ipcMain.on("ping", () => console.log("pong"));

	ipcMain.handle("app:close", () => {
		stopServer();
		app.quit();
		logger.info("App stopped successfully");
	});

	ipcMain.handle("app:minimize", () => {
		BrowserWindow.getFocusedWindow()?.minimize();
	});

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

	ipcMain.on('restart_app', () => {
		autoUpdater.quitAndInstall();
	});

	// Create the main application window
	createWindow();

	// Handle reactivation of the app (e.g., clicking the dock icon on macOS)
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit the application when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
