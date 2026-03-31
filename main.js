const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store').default;

const store = new Store();

let baseDir = store.get('PATH') || path.join(__dirname, 'renderer/videos');

if (!app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: /node_modules|[\/\\]\./
  });
}

function ensureVideoFolder() {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
}

function createWindow() {

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.maximize();
  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  ensureVideoFolder();
  createWindow();
});


// escolher pasta
ipcMain.handle("set-path", async () => {

  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (result.canceled) return null;

  baseDir = result.filePaths[0];

  store.set("PATH", baseDir);

  return baseDir;
});


// listar séries
ipcMain.handle("get-series", async () => {

  if (!baseDir || !fs.existsSync(baseDir)) {
    return {};
  }

  const series = {};

  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folder of folders) {

    const folderPath = path.join(baseDir, folder);

    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith(".mp4") || f.endsWith(".mkv"))
      .sort()
      .map(file => ({
        name: file,
        path: path.join(folderPath, file)
      }));

    series[folder] = files;
  }

  return series;
});