const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  // ignora node_modules e arquivos temporários
  ignored: /node_modules|[\/\\]\./
});

const fs = require('fs');

const baseDir = app.isPackaged
  ? path.join(process.resourcesPath, 'videos')
  : path.join(__dirname, 'renderer/videos');

// 2. Função para garantir que a pasta exista
function ensureVideoFolder() {
  if (!fs.existsSync(baseDir)) {
    console.log("Pasta não encontrada. Criando em:", baseDir);
    fs.mkdirSync(baseDir, { recursive: true });
  }
}

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

// Inicializa o app e verifica a pasta
app.whenReady().then(() => {
  ensureVideoFolder(); // Cria a pasta assim que o app abre
  createWindow();
});

ipcMain.handle('get-series', async () => {
  // Garantia extra: se o usuário deletar a pasta com o app aberto, ela recria aqui
  ensureVideoFolder();

  const seriesFolders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const result = {};
  for (const folder of seriesFolders) {
    const seriesPath = path.join(baseDir, folder);

    // Busca arquivos .mp4 ou .mkv
    const episodes = fs.readdirSync(seriesPath)
      .filter(f => f.endsWith('.mp4') || f.endsWith('.mkv'))
      .sort();

    result[folder] = episodes;
  }

  return result;
});