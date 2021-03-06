import { app, BrowserWindow, screen, ipcMain } from "electron";
import { initSave, saveDesktop, savePrinters, saveSignature, saveTaskbar, saveBrowser } from "./lib/save";
import {
  getSave,
  restore,
  restoreDesktop,
  restorePrinters,
  restoreSignature,
  restoreTaskbar,
  restoreBrowser,
} from "./lib/restore";
import { retrieveInfo, retrieveStorage } from "./lib/info";
import { loadRootPath, getDirectoryPath, setDirectoryPath, Repertories } from "./services/config-service";
import fs = require("fs-extra");
import * as path from "path";
import * as url from "url";
import { directoryPicker, userInfo } from "./services/utils-service";
import { changeDefaultLocation } from "./lib/settings";

// Initialize remote module
require("@electron/remote/main").initialize();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const iconPath = "src/assets/icons/favicon.png";

  // Create the browser window.
  win = new BrowserWindow({
    width: 960,
    height: 540,
/*     width: 1920,
    height: 1080, */
    autoHideMenuBar: true,
    icon: iconPath,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
      enableRemoteModule: true, // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {
    win.webContents.openDevTools();
    require("electron-reload")(__dirname, {
      electron: require(path.join(__dirname, "/../node_modules/electron")),
    });
    win.loadURL("http://localhost:4200");
  } else {
    // Path when running electron executable
    let pathIndex = "./index.html";
    
    if (fs.existsSync(path.join(__dirname, "../dist/index.html"))) {
      // Path when running electron in local folder
      pathIndex = "../dist/index.html";
    }

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
} finally {
  // Set root path
  loadRootPath().catch((err) => {
    throw new Error(err);
  });
}

// ========== catch event from GUI ========== //

// MAIN

ipcMain.handle("retrieve-info", async () => {
  return await retrieveInfo();
});

ipcMain.handle("retrieve-storage", async () => {
  return retrieveStorage().then((result) => {
    return result;
  });
});

// SAVE EVENT

ipcMain.handle("save", async () => {
  return await initSave(win);
});

ipcMain.handle("save-desktop", async () => {
  return await saveDesktop();
});

ipcMain.handle("save-signature", async () => {
  return await saveSignature();
});

ipcMain.handle("save-taskbar", async () => {
  return await saveTaskbar();
});

ipcMain.handle("save-printers", async () => {
  return await savePrinters(win.webContents);
});

ipcMain.handle("save-browser", async () => {
  return await saveBrowser();
});

// RESTORE EVENTS

ipcMain.handle("get-save", async () => {
  return await getSave();
});

ipcMain.handle("restore", async () => {
  return await restore();
});

ipcMain.handle("restore-desktop", async () => {
  return await restoreDesktop();
});

ipcMain.handle("restore-signatures", async () => {
  return await restoreSignature();
});

ipcMain.handle("restore-taskbar", async () => {
  return await restoreTaskbar();
});

ipcMain.handle("restore-printers", async () => {
  return await restorePrinters(win.webContents);
});

ipcMain.handle("restore-browser", async () => {
  return await restoreBrowser();
});

// SETTINGS EVENTS

ipcMain.handle("get-default-location", async () => {
  return await getDirectoryPath();
});

ipcMain.handle("set-default-location", async () => {
  return await changeDefaultLocation(win);
});
