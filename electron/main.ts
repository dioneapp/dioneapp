import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { start as startServer, stop as stopServer } from './server/server'
import logger from './server/utils/logger'
import { getCurrentPort } from './server/utils/getPort'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let loadingWin: BrowserWindow | null
 
function createLoadingWindow() {
  loadingWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 1200,
    height: 800,
    minWidth: 700,
    minHeight: 700,
    title: 'Loading Dione',
    center: true,
    titleBarStyle: 'hidden'
  })

  if (VITE_DEV_SERVER_URL) {
    loadingWin.loadURL(`${VITE_DEV_SERVER_URL}loading`)
  } else {
    // win.loadFile('dist/index.html')
    loadingWin.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  loadingWin.removeMenu()
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 1200,
    height: 800,
    minWidth: 700,
    minHeight: 700,
    title: 'Dione',
    center: true,
    titleBarStyle: 'hidden'
  })

  if (win) {
    win.webContents.on('console-message', (message, line, sourceId) => {
      console.log(`[Renderer Console] ${message} (at ${sourceId}:${line})`);
    });
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.removeMenu()
  if (process.env.DEV) {
    win.webContents.openDevTools()
  }
}

app.setName('Dione')

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  logger.info('Starting app...');
  createLoadingWindow();
  startServer();

  // listen shortcuts
  globalShortcut.register('Control+R', () => {
    console.log('Ctrl+R shortcut triggered');
    win?.reload();
  })

  ipcMain.on('socket-ready', () => {
    logger.info('server started successfully');
    if (loadingWin) {
      loadingWin.close();
    }
    createWindow();
    logger.info('App started successfully');
  });

  ipcMain.on('socket-error', () => {
    logger.error('Socket connection failed');
    win?.close();
    createLoadingWindow();
  });

  // IPC listener
  ipcMain.on('app:close', () => {
    stopServer();
    app.quit();
    logger.info('App stopped successfully');
  });
  ipcMain.on('app:minimize', () => {
    if (win) {
      win.minimize();
    } else {
      loadingWin?.minimize();
    }
  });


  // get actual port
  async function getPort() {
    const port = await getCurrentPort();
    return port;
  }

  ipcMain.handle('get-current-port', async () => {
    console.log('getting current port...');
    const port = await getPort();
    console.log('current port:', port);
    return port
  });

  // open external link
  ipcMain.on('open-external-link', (_event, url) => {
    shell.openExternal(url)
  })

});
