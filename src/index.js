const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const events = require(path.join(__dirname, 'server/events'));

process.env.ROOT_PATH = path.join(__dirname, app.isPackaged ? '../../../.' : '');
process.env.RESOURCES_PATH = path.join(process.env.ROOT_PATH, app.isPackaged ? '' : 'server/resources');
process.env.STATIC_PATH = path.join(process.env.ROOT_PATH, app.isPackaged ? 'resources' : '');

const update = (promise) => promise.then(data => {
    app.setLoginItemSettings({
        openAtLogin: data.open,
        path: app.getPath('exe')
    });
});

events.once('settings:get', update);
events.on('settings:set', update);

let win;

function createWindow () {
    win = new BrowserWindow({
        width: 900,
        height: 600,
        autoHideMenuBar: true,
        frame: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadURL(process.env.DEV ? 'http://localhost:5173' : path.join(process.env.STATIC_PATH, 'host/build/index.html'));
    win.webContents.once('did-finish-load', () => process.env.DEV && win.webContents.openDevTools());

    ipcMain.on('minimize', () => win && !win.isDestroyed() && win.minimize());
    ipcMain.on('close', () => win && !win.isDestroyed() && win.close());
}

app.whenReady().then(() => {
    // const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // process.env.WIDTH = String(width);
    // process.env.HEIGHT = String(height);
    const server = require(path.join(__dirname, 'server'));
    server.once('listening', () => createWindow());
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});