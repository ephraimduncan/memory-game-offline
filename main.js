const electron = require("electron");

const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
  win.maximize();
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
