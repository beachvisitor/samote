const electron = require('electron');
const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = electron;
const path = require('path');

process.env.ROOT_PATH = path.join(__dirname, app.isPackaged ? '../../../.' : '');
process.env.RESOURCES_PATH = path.join(app.getPath('userData'), 'resources');
process.env.STATIC_PATH = path.join(process.env.ROOT_PATH, app.isPackaged ? 'resources' : '');

require('./logger');

const onError = (e) => {
    dialog.showErrorBox('An error occurred', e.stack)
    !e.silent && console.error(e);
};

process.on('uncaughtException', onError);
process.on('unhandledRejection', onError);
if (!app.requestSingleInstanceLock()) app.quit();

const extension = require('./extensions');
const api = require('./api');
const events = require('./events');

api.update({ electron });
extension.load().then();

let win;
let tray;

function createWindow () {
    const options = {
        width: 900,
        height: 600,
        autoHideMenuBar: true,
        frame: false,
        show: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    };

    events.wait('window:create', options)
        .then((options) => {
            win = new BrowserWindow(options);

            win.loadURL(process.env.DEV ? 'http://localhost:5173' : path.join(process.env.STATIC_PATH, 'host/build/index.html'));
            win.webContents.once('did-finish-load', () => process.env.DEV && win.webContents.openDevTools());
            win.once('ready-to-show', () => !process.argv.includes('--hidden') && win.show());

            win.on('close', (e) => {
                if (app.isQuitting) return;
                e.preventDefault();
                win.hide();
            });

            ipcMain.on('minimize', () => win.minimize());
            ipcMain.on('close', () => win.close());
            ipcMain.on('quit', () => app.quit());
        });
}

function createTray() {
    const iconPath = path.join(__dirname, '../logo.ico');
    tray = new Tray(iconPath);

    const template = [
        {

            label: 'Open',
            click: () => {
                if (win === null) createWindow();
                win.show();
            }
        },
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ];

    tray.setToolTip('Samote');
    tray.setContextMenu(Menu.buildFromTemplate(template));
    ipcMain.on('tray', (e, labels) => {
        const copy = [ ...template ];
        Object.keys(labels).forEach(key => {
            const index = Number(key);
            if (copy[index]) copy[index].label = labels[key] || template[index].label;
        });
        tray.setContextMenu(Menu.buildFromTemplate(copy));
    });
    tray.on('click', () => win.isVisible() ? win.hide() : win.show());
}

app.whenReady().then(() => {
    const server = require('./server');
    createTray();
    server.once('listening', () => createWindow());
    app.on('second-instance', () => win.show());
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

const update = (promise) => promise.then(data => {
    // If the program is not packaged, ignore these settings,
    // because Electron will open its own window not related
    // to our program at system startup.
    if (!app.isPackaged || [data?.open, data?.hide].some(item => typeof item !== 'boolean')) return;
    app.setLoginItemSettings({
        openAtLogin: data.open,
        args: data.hide ? ['--hidden'] : [],
        path: app.getPath('exe')
    });
});

events.once('settings:get', update);
events.on('settings:set', update);

// https://github.com/electron/electron/issues/9433#issuecomment-960635576
let done = false;

app.on('before-quit', async (e) => {
    app.isQuitting = true;
    if (done) return;
    e.preventDefault();
    extension.unload().finally(() => {
        done = true;
        app.quit()
    });
});