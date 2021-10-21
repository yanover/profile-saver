import { spawn, exec, SpawnOptions } from "child_process";
import fs = require("fs-extra");
import os = require("os");

import { Files, getFullPath, Repertories } from "./configService";

const regedit = require("regedit");

// Get fullPath from
const rootPath: string = getFullPath();

interface IitemToSave {
  desktop: boolean;
  signatures: boolean;
  taskbar: boolean;
  printers: boolean;
}

class registryItem {
  exists: boolean;
  keys: string[];
  values: [
    {
      value: string;
      type: string;
    }
  ];
  version: string;
}

/**
 * Description : Returns last save's date from info.txt file
 * @return Promise<string>
 * @throws CopyError | FileNotFoundException
 */
export async function getSave(): Promise<string> {
  let infoFile = `${rootPath}\\${Files.info}`;

  if (fs.existsSync(infoFile)) {
    try {
      const pattern = "Date";
      let data = fs.readFileSync(infoFile).toString();
      let index = data.indexOf(pattern);
      if (index > -1) {
        return data
          .slice(index, data.length)
          .split(":")
          .slice(1, data.length)
          .join(":");
      }
    } catch (err) {
      console.error(err);
      throw new Error("An error occured during desktop restoration");
    }
  } else {
    console.error(`File ${infoFile} not found`);
    throw new Error("An error occured during desktop restoration");
  }
}

/**
 * Description : Returns a litteral object that use IitemToSave with values that needs to be save
 * @return Promise<IitemToSave>
 */
export async function restore(): Promise<IitemToSave> {
  let itemToSave: IitemToSave = {
    desktop: false,
    printers: false,
    signatures: false,
    taskbar: false,
  };

  // We want to know how many options will be process
  if (fs.existsSync(rootPath)) {
    for (let key in itemToSave) {
      let path = `${rootPath}\\${key.charAt(0).toUpperCase() + key.slice(1)}`;
      fs.existsSync(path)
        ? (itemToSave[key] = true)
        : (itemToSave[key] = false);
    }
  } else {
    console.info(`File ${rootPath} not found`);
  }

  return itemToSave;
}

/**
 * Description : Restore desktop process, copy saved content on user's current desktop
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreDesktop(): Promise<void> {
  const rootPathSource = `${
    userInfo().homedir
  }\\${Repertories.desktop.toLowerCase()}`;

  const rootPathDestination = `${rootPath}\\${Repertories.desktop}`;

  if (fs.existsSync(rootPathDestination)) {
    // Copy content
    await fs
      .copy(rootPathDestination, rootPathSource, { overwrite: false })
      .catch((err: Error) => {
        console.error(err);
        throw new Error("An error occured during desktop restoration");
      });
  } else {
    console.error(
      `Error detected in restoreDesktop, folder ${rootPathDestination} not found`
    );
    throw new Error("An error occured during desktop restoration");
  }
}

/**
 * Description : Restore signature process, copy saved content on user's current signature's directory
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreSignature(): Promise<void> {
  const rootPathSource = `${
    userInfo().homedir
  }\\AppData\\Roaming\\Microsoft\\Signatures`;
  const rootPathDestination = `${rootPath}\\${Repertories.signature}`;

  if (fs.existsSync(rootPathDestination)) {
    // Copy content
    await fs
      .copy(rootPathDestination, rootPathSource, { overwrite: false })
      .catch((err) => {
        console.error(err);
        throw new Error("An error occured during signature restoration");
      });
  } else {
    console.error(
      `Error detected in restorSignatures, folder ${rootPathDestination} not found`
    );
    throw new Error("An error occured during signature restoration");
  }
}

/**
 * Description : Restore taskbar process, copy registry entry found in registry.json file
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreTaskbar(): Promise<void> {
  let registryName: string =
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
  let rootPathDestination: string = `${rootPath}\\${Repertories.taskbar}\\${Files.taskbar}`;
  let errorMessage: string = "";

  // Retrieve .json file
  if (fs.existsSync(rootPathDestination)) {
    let data: registryItem = JSON.parse(
      fs.readFileSync(rootPathDestination, "utf8")
    );

    // Use class to set proper object
    let item = new registryItem();
    item.values = data[registryName]["values"];

    try {
      for (let key in item.values) {
        const registryValue = {
          [registryName]: {
            [key]: {
              value: item.values[key]["value"],
              type: item.values[key]["type"],
            },
          },
        };

        regedit.putValue(registryValue, (err: Error) => {
          if (err) {
            throw new Error("An error occured during signature restoration");
          }
        });
      }
    } catch (err) {
      throw new Error("An error occured during signature restoration");
    }
  } else {
    console.error(
      `Error detected in restorTaskbar, folder ${rootPathDestination} not found`
    );
    throw new Error("An error occured during taskbar restoration");
  }
}

/**
 * Description : Restore printers process, copy printer from printers.json file, install with child_process
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restorePrinters(
  contents: Electron.WebContents
): Promise<void> {
  let rootPathDestination: string = `${rootPath}\\${Repertories.printers}\\${Files.printers}`;

  let errorMessage: string = "";
  let result: boolean = true;

  // Retrieve .json file
  if (fs.existsSync(rootPathDestination)) {
    // read json file && retrieve printers
    let printersSorted: Electron.PrinterInfo[] = [];
    let printersInstalled: Electron.PrinterInfo[] = contents.getPrinters();
    let printerSaved: registryItem = JSON.parse(
      fs.readFileSync(rootPathDestination, "utf8")
    );
    let count = 0;

    // retrieve printer to install
    for (let i in printerSaved) {
      count = 0;
      for (let j in printersInstalled) {
        if (printerSaved[i]["name"] == printersInstalled[j]["name"]) {
          break;
        } else {
          count = count + 1;
          if (count == printersInstalled.length) {
            printersSorted.push(printerSaved[i]);
          }
        }
      }
    }
    // Launch child_process execute function
    printersSorted.forEach((printer) => {
      execute(printer["name"]);
    });
  } else {
    console.error(
      `Error detected in restorePrinters, folder ${rootPathDestination} not found`
    );
    throw new Error("An error occured during printers restoration");
  }
}

function userInfo() {
  return os.userInfo();
}

function execute(command: string) {
  // command = `start ${command}`;
  console.log("Commande intercepted : " + command);

  // Build args
  let args = ["/s", "/c", "start", "", command];
  let opts: SpawnOptions = {
    shell: false,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  };

  // Execute statment
  let stmt = spawn("cmd.exe", args, opts);

  stmt.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
}
