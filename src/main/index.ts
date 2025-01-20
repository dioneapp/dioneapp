import { app, shell, BrowserWindow, ipcMain, Tray, globalShortcut, dialog } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.ico?asset';
import logger from './server/utils/logger';
import { start as startServer, stop as stopServer } from './server/server';
import { getCurrentPort } from './server/utils/getPort';

// set default protocol client
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('dione', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('dione');
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
    titleBarStyle: 'hidden',
    icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  // Remove default menu from the window
  mainWindow.removeMenu();

  // Show the window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  // Prevent opening new windows and handle external links
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  const handleDeepLink = (url) => {
    try {
      const cleanUrl = url.replace(/^dione:\/\//, '');
      const authMatch = cleanUrl.match(/auth=([^&]+)/);
      if (authMatch) {
        const authToken = authMatch[1];
        mainWindow.webContents.send('auth-token', authToken);
      } else {
        console.error('Not found auth token in deep link');
      }
  
      const refreshMatch = cleanUrl.match(/refresh=([^&]+)/);
      if (refreshMatch) {
        const refreshToken = refreshMatch[1];
        mainWindow.webContents.send('refresh-token', refreshToken);
      } else {
        console.error('Not found refresh token in deep link');
      }
  
    } catch (error) {
      logger.error('Error handling deep link:', error);
    }
  };

  app.on('open-url', handleDeepLink);

  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    process.exit(0);
  } else {
    app.on('second-instance', (_event, commandLine) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }

      handleDeepLink(commandLine.pop());
    });
  }

  // Load renderer content (URL in development, HTML file in production)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}


// Sets up the application when ready.
app.whenReady().then(() => {
  logger.info('Starting app...');

  // Set up tray icon
  app.setName('Dione');
  const appIcon = new Tray(path.join(__dirname, '../../resources/icon.ico'));
  electronApp.setAppUserModelId('Dione');
  appIcon.setToolTip('Dione');

  // Start the server
  startServer();

  // Register global shortcuts
  globalShortcut.register('Control+R', () => {
    console.log('Ctrl+R shortcut triggered');
    BrowserWindow.getFocusedWindow()?.reload();
  });

  // Automatically manage development shortcuts and production optimizations
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Set up IPC handlers
  ipcMain.on('socket-ready', () => {
    logger.info('Server started successfully');
  });

  ipcMain.on('socket-error', () => {
    logger.error('Socket connection failed');
  });

  ipcMain.on('ping', () => console.log('pong'));

  ipcMain.handle('app:close', () => {
    stopServer();
    app.quit();
    logger.info('App stopped successfully');
  });

  ipcMain.handle('app:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  // Retrieve the current port
  ipcMain.handle('get-current-port', async () => {
    const port = await getCurrentPort();
    return port;
  });

  // Open external links
  ipcMain.handle('open-external-link', (_event, url) => {
    shell.openExternal(url);
  });

  // Create the main application window
  createWindow();

  // Handle reactivation of the app (e.g., clicking the dock icon on macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the application when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
