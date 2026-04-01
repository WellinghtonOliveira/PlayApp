const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store').default;

// Definindo defaults para evitar undefined
const store = new Store({
  defaults: {
    PATH: null
  }
});

// Função para obter o baseDir de forma segura
function getBaseDir() {
  const savedPath = store.get('PATH');

  if (savedPath && fs.existsSync(savedPath)) {
    return savedPath;
  }

  // Usa pasta do usuário no appData (userData)
  return path.join(app.getPath('userData'), 'videos');
}

let baseDir = getBaseDir();

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

Menu.setApplicationMenu(null);
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'renderer/assets/icon.ico'),
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
  const videoExtensions = [
    '.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv', '.wmv'
  ];

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
      .filter(file => {
        const fullPath = path.join(folderPath, file);
        const ext = path.extname(file).toLowerCase();

        return fs.statSync(fullPath).isFile() &&
          videoExtensions.includes(ext);
      })
      .sort()
      .map(file => ({
        name: file,
        path: path.join(folderPath, file)
      }));

    series[folder] = files;
  }

  return series;
});