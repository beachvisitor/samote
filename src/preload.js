const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize'),
    close: () => ipcRenderer.send('close'),
    quit: () => ipcRenderer.send('quit'),
    tray: (labels) => ipcRenderer.send('tray', labels)
});