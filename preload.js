const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSeries: () => ipcRenderer.invoke('get-series'),
  setPath: () => ipcRenderer.invoke('set-path')
});