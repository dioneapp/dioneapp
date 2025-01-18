import { app, shell, BrowserWindow, ipcMain, Tray, globalShortcut } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import logger from './server/utils/logger'
import { start as startServer, stop as stopServer } from './server/server'
import { getCurrentPort } from './server/utils/getPort'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
      sandbox: false
    }
  })

  // remove menu
  mainWindow.removeMenu();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  logger.info('Starting app...');

  // set tray
  app.setName('Dione');
  const appIcon = new Tray(path.join(__dirname, '../../resources/icon.ico'));
  electronApp.setAppUserModelId('Dione')
  appIcon.setToolTip("Dione");

  // start server
  startServer();

  // shortcuts
  globalShortcut.register('Control+R', () => {
    console.log('Ctrl+R shortcut triggered');
    BrowserWindow.getFocusedWindow()?.reload();
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // socket stuff
  ipcMain.on('socket-ready', () => {
    logger.info('server started successfully');
  });

  ipcMain.on('socket-error', () => {
    logger.error('Socket connection failed');
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // IPC listener
  ipcMain.handle('app:close', () => {
    stopServer();
    app.quit();
    logger.info('App stopped successfully');
  });
  ipcMain.handle('app:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  // utils
  // get actual port
  async function getPort() {
    const port = await getCurrentPort();
    return port;
  }
  ipcMain.handle('get-current-port', async () => {
    const port = await getPort();
    return port
  });

  // open external link
  ipcMain.handle('open-external-link', (_event, url) => {
    shell.openExternal(url)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
