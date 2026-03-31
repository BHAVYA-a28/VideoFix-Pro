import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "VideoFix Pro - Enterprise Management",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required for IPC in one-click setup
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Native System Installation Bridge (One-Click Execute)
ipcMain.handle('execute-installer', async (_event, filePath) => {
  console.log(`[VFP-Native] SILENT EXECUTION: ${filePath}`);
  
  return new Promise((resolve) => {
    let command = '';
    if (filePath.endsWith('.msi')) {
      command = `msiexec /i "${filePath}" /passive`;
    } else if (filePath.endsWith('.exe')) {
      command = `"${filePath}" /S`; // Professional silent flag attempt
    } else {
      command = `"${filePath}"`;
    }

    exec(command, (error, stdout) => {
      if (error) {
        console.error(`[VFP-Native] Execution Error: ${error.message}`);
        resolve({ success: false, error: error.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
});

// System Hardware Diagnostics (Bypassing Browser restrictions)
ipcMain.handle('get-system-detailed', async () => {
  return {
    isNative: true,
    platform: process.platform,
    arch: process.arch,
    processor: process.env.PROCESSOR_IDENTIFIER || 'Advanced CPU'
  };
});
