const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "GNR-SMURFS-1.0",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  // Em desenvolvimento, carregamos o servidor da Vite
  // Em produção, carregamos o arquivo dist/index.html
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  const isDev = !app.isPackaged;
  const { fork } = require('child_process');
  
  // Caminho para o servidor backend
  const serverPath = path.join(__dirname, 'backend_server.js');
  
  console.log('Iniciando backend em:', serverPath);

  // Iniciamos o servidor backend como um processo forkeado
  // Isso usa o próprio binário do Electron para correr o Node
  serverProcess = fork(serverPath, [], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      PORT: '3002',
      NODE_ENV: isDev ? 'development' : 'production'
    }
  });

  serverProcess.on('error', (err) => {
    console.error('Falha crítica no Servidor Backend:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Servidor Backend saiu com código ${code}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
