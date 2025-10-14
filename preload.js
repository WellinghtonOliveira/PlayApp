const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSeries: () => ipcRenderer.invoke('get-series')
});
