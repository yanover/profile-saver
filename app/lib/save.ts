import { dialog } from "electron";
import fs = require("fs-extra");
import os = require("os");
import { Files, getFullPath, Repertories } from "../services/config-service";
import { getDateTime } from "../services/utils-service";

const regedit = require("regedit");

function userInfo() {
  return os.userInfo();
}

/**
 * Check if save destination is reacheable, write to info file, destroy all data found in old save
 * @param win main windows, used to pushed confirm windows if a save already exist and will be override
 * @returns Promise<number>
 */
export async function initSave(win: any): Promise<number> {
  let response: number = 0;

  try {
    let finalDestination = `${getFullPath()}\\${Files.info}`;

    if (!fs.existsSync(getFullPath())) {
      // Folder doesn't exist, creating
      fs.mkdirSync(getFullPath());
    } else if (fs.readdirSync(getFullPath()).length > 0) {
      // Carefull, there is already a save in the final destination (oui = 1)
      response = dialog.showMessageBoxSync(win, {
        type: "warning",
        buttons: ["Non", "Oui"],
        title: "Confirmation",
        message: `Attention, une sauvegarde est déjà présente au répertoire "${getFullPath()}", êtes-vous certain de vouloir écraser son contenu ?`,
      });
    } else {
      // Folder exist but is empty
      response = 1;
    }

    if (response) {
      // Create info file
      if (!fs.existsSync(finalDestination)) {
        fs.createFileSync(finalDestination);
      }
      // Write content - override if exists
      fs.writeFileSync(finalDestination, `Projet : SaveProfile\n`);
      fs.appendFileSync(finalDestination, `Auteur : Yann Schoeni\n`);
      fs.appendFileSync(finalDestination, `Date de la sauvegarde : ${getDateTime()}\n`);

      // Empty all folder
      Object.keys(Repertories).map((key) => {
        fs.rmSync(`${getFullPath()}\\${Repertories[key]}`, { recursive: true, force: true });
      });

      // TODO --> recursive true not working for now
      fs.rmSync(`${getFullPath()}\\${Repertories.taskbar}\\content`, { recursive: true });
    }

    // Return result
    return response;
  } catch (err) {
    console.error(err);
    throw new Error("An error occured during initSave");
  }
}

/**
 * Description : Save desktop process, copy user's current desktop on backup folder
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function saveDesktop(): Promise<void> {
  const desktopPath = `${userInfo().homedir}\\${Repertories.desktop}`;
  let finalDestination = `${getFullPath()}\\${Repertories.desktop}`;

  try {
    // Create folder
    if (!fs.existsSync(finalDestination)) {
      console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
      fs.mkdirSync(finalDestination);
    }

    // Copy content
    return await fs.copy(desktopPath, finalDestination, { overwrite: true }).catch((err) => {
      console.error(err);
      throw new Error("An error occured during desktop save");
    });
  } catch (err) {
    console.error(err);
    throw new Error("An error occured during desktop save");
  }
}

/**
 * Description : Save signature process, copy user's current signature on backup folder
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function saveSignature(): Promise<void> {
  const signaturePath = `${userInfo().homedir}\\AppData\\Roaming\\Microsoft\\${Repertories.signature}`;
  let finalDestination = `${getFullPath()}\\${Repertories.signature}`;

  try {
    // Create folder
    if (!fs.existsSync(finalDestination)) {
      console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
      fs.mkdirSync(finalDestination);
    }
    // Copy content
    return await fs.copy(signaturePath, finalDestination, { overwrite: true }).catch((err) => {
      console.error(err);
      throw new Error("An error occured during signature save");
    });
  } catch (err) {
    console.error(err);
    throw new Error("An error occured during signature save");
  }
}

/**
 * Description : Save taskbar process, TODO
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function saveTaskbar(): Promise<void> {
  let finalDestination = `${getFullPath()}\\${Repertories.taskbar}`;
  const registryKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
  const taskbarPath = `${
    userInfo().homedir
  }\\AppData\\Roaming\\Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\TaskBar`;

  regedit.list(registryKey, (err: any, result: any) => {
    if (err) {
      console.error(err);
      throw new Error("An error occured during taskabr save");
    }
    try {
      let regDestination = `${finalDestination}\\${Files.taskbar}`;
      let contentDestination = `${finalDestination}\\content`;

      // Create folder
      if (!fs.existsSync(finalDestination)) {
        console.log(`Destination folder (${finalDestination}) doesn't exist, creating`);
        fs.mkdirSync(finalDestination);
      }
      // Create json file
      if (!fs.existsSync(regDestination) || !fs.existsSync(contentDestination)) {
        console.log(`Destination file (${regDestination}) doesn't exist, creating`);
        fs.createFileSync(regDestination);
      }

      // Copy appData content
      fs.copySync(taskbarPath, contentDestination, { overwrite: true });

      // Write registry value in .json
      fs.writeFileSync(regDestination, JSON.stringify(result, null, 2), "utf-8");

      // Copy passte
    } catch (err) {
      console.error(err);
      throw new Error("An error occured during taskabr save");
    }
  });
}

/**
 * Description : Save printer process, TODO
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function savePrinters(contents: Electron.WebContents): Promise<void> {
  let printers: Electron.PrinterInfo[] = contents.getPrinters();
  let finalDestination = `${getFullPath()}\\${Repertories.printers}`;
  let printersSorted: Electron.PrinterInfo[] = [];

  try {
    let fileDestination = `${finalDestination}\\${Files.printers}`;

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
    throw new Error("An error occured during printers save");
  }
}