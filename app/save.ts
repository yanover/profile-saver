import { dialog } from "electron";
import fs = require("fs-extra");
import os = require("os");
import { getFullPath, Repertories } from "./config-service";

const regedit = require("regedit");

// Get fullPath from configService
const rootPath: string = getFullPath();

function userInfo() {
  return os.userInfo();
}

export async function save(win: any) {
  let response: number = 0;

  try {
    let finalDestination = `${rootPath}\\info.txt`;

    if (!fs.existsSync(rootPath)) {
      // Folder doesn't exist, creating
      fs.mkdirSync(rootPath);
    } else if (fs.readdirSync(rootPath).length > 0) {
      // Carefull, there is already a save in the final destination (oui = 1)
      response = dialog.showMessageBoxSync(win, {
        type: "warning",
        buttons: ["Non", "Oui"],
        title: "Confirmation",
        message: `Attention, une sauvegarde est déjà présente au répertoire "${rootPath}", êtes-vous certain de vouloir écraser son contenu ?`,
      });
    } else {
      // Folder exist but is empty
      response = 1;
    }

    if (response) {
      // Create info file
      if (!fs.existsSync(finalDestination)) {
        console.log(`Info file (${finalDestination}) doesn't exist, creating`);
        fs.createFileSync(finalDestination);
      }
      // Write content - override if exists
      fs.writeFileSync(finalDestination, `Projet : SaveProfile\n`);
      fs.appendFileSync(finalDestination, `Auteur : Yann Schoeni\n`);
      fs.appendFileSync(finalDestination, `Date de la sauvegarde : ${getDate()}\n`);

      // Empty all folder
      for (let item in Repertories) {
        await fs.rm(`${rootPath}\\${item}`, { recursive: true, force: true });
      }
    }

    // Return result
    return response;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function saveDesktop(): Promise<any> {
  const desktopPath = `${userInfo().homedir}\\${Repertories.desktop}`;
  let finalDestination = `${rootPath}\\Desktop`;

  try {
    // Create folder
    if (!fs.existsSync(finalDestination)) {
      console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
      fs.mkdirSync(finalDestination);
    }

    // Copy content
    return await fs
      .copy(desktopPath, finalDestination, { overwrite: true })
      .then(() => {
        return "Sucess !";
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function saveSignature() {
  const signaturePath = `${userInfo().homedir}\\AppData\\Roaming\\Microsoft\\${Repertories.signature}`;
  let finalDestination = `${rootPath}\\${Repertories.signature}`;

  try {
    // Create folder
    if (!fs.existsSync(finalDestination)) {
      console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
      fs.mkdirSync(finalDestination);
    }
    // Copy content
    return await fs
      .copy(signaturePath, finalDestination, { overwrite: true })
      .then(() => {
        return "Sucess !";
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function saveTaskbar() {
  let finalDestination = `${rootPath}\\${Repertories.taskbar}`;
  let registryKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";

  return regedit.list(registryKey, function (err: any, result: any) {
    try {
      let regDestination = `${finalDestination}\\regedit.json`;

      // Create folder
      if (!fs.existsSync(finalDestination)) {
        console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
        fs.mkdirSync(finalDestination);
      }
      // Create json file
      if (!fs.existsSync(regDestination)) {
        console.log(`Destination file (${regDestination}) doesn't exist, creating`);
        fs.createFileSync(regDestination);
      }

      // Write registry value in .json
      return fs.writeFileSync(regDestination, JSON.stringify(result, null, 2), "utf-8");
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });
}

export async function savePrinters(contents: Electron.WebContents) {
  let printers: Electron.PrinterInfo[] = contents.getPrinters();
  let finalDestination = `${rootPath}\\${Repertories.printers}`;
  let printersSorted: Electron.PrinterInfo[] = [];

  try {
    let fileDestination = `${finalDestination}\\printers.json`;

    // Create folder
    if (!fs.existsSync(finalDestination)) {
      console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
      fs.mkdirSync(finalDestination);
    }
    // Create json file
    if (!fs.existsSync(fileDestination)) {
      console.log(`Destination file (${fileDestination}) doesn't exist, creating`);
      fs.createFileSync(fileDestination);
    }
    // Sort data
    printers.forEach((printer: Electron.PrinterInfo) => {
      if (printer.name.includes("s2lprint3")) {
        printersSorted.push(printer);
      }
    });
    // Push to .json file
    fs.writeFileSync(fileDestination, JSON.stringify(printersSorted, null, 2), "utf-8");
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

function getDate(): string {
  let today = new Date();
  let date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}
