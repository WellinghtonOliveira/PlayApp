const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    // ignora node_modules e arquivos temporários
    ignored: /node_modules|[\/\\]\./
});

const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('get-series', async () => {
  const baseDir = path.join(__dirname, 'renderer/videos');
  const seriesFolders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const result = {};
  for (const folder of seriesFolders) {
    const seriesPath = path.join(baseDir, folder);
    const episodes = fs.readdirSync(seriesPath)
      .filter(f => f.endsWith('.mp4'))
      .filter(f => f.endsWith('.mkv'))
      .sort();
    result[folder] = episodes;
  }

  return result;
});
