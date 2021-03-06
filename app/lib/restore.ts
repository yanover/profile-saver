import fs = require("fs-extra");
import { Files, getFullPath, Repertories } from "../services/config-service";
import { isEmpty, spawn_cmd, userInfo } from "../services/utils-service";

const regedit = require("regedit");

interface IitemToSave {
  desktop: boolean;
  signatures: boolean;
  taskbar: boolean;
  printers: boolean;
  browser: boolean;
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
  let infoFile = `${getFullPath()}\\${Files.info}`;

  if (fs.existsSync(infoFile)) {
    try {
      const pattern = "Date";
      let data = fs.readFileSync(infoFile).toString();
      let index = data.indexOf(pattern);
      if (index > -1) {
        return data.slice(index, data.length).split(":").slice(1, data.length).join(":");
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
 * Description : Returns a litteral object with items th
 * @return Promise<IitemToSave>
 */
export async function restore(): Promise<IitemToSave> {
  let itemToSave: IitemToSave = {
    desktop: false,
    printers: false,
    signatures: false,
    taskbar: false,
    browser: false,
  };

  // We want to know how many options will be process
  if (fs.existsSync(getFullPath())) {
    for (let key in itemToSave) {
      let path = `${getFullPath()}\\${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (fs.existsSync(path) && !isEmpty(path)) {
        itemToSave[key] = true;
      } else {
        itemToSave[key] = false;
      }
    }
  } else {
    console.info(`File ${getFullPath()} not found`);
  }

  return itemToSave;
}

/**
 * Description : Restore desktop process, copy saved content on user's current desktop
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreDesktop(): Promise<void> {
  const rootPathSource = `${userInfo().homedir}\\${Repertories.desktop.toLowerCase()}`;
  const rootPathDestination = `${getFullPath()}\\${Repertories.desktop}`;

  if (fs.existsSync(rootPathDestination)) {
    // Copy content
    await fs.copy(rootPathDestination, rootPathSource, { overwrite: false }).catch((err: Error) => {
      console.error(err);
      throw new Error("An error occured during desktop restoration");
    });
  } else {
    console.error(`Error detected in restoreDesktop, folder ${rootPathDestination} not found`);
    throw new Error("An error occured during desktop restoration");
  }
}

/**
 * Description : Restore signature process, copy saved content on user's current signature's directory
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreSignature(): Promise<void> {
  const rootPathSource = `${userInfo().homedir}\\AppData\\Roaming\\Microsoft\\Signatures`;
  const rootPathDestination = `${getFullPath()}\\${Repertories.signature}`;

  if (fs.existsSync(rootPathDestination)) {
    // Copy content
    await fs.copy(rootPathDestination, rootPathSource, { overwrite: false }).catch((err) => {
      console.error(err);
      throw new Error("An error occured during signature restoration");
    });
  } else {
    console.error(`Error detected in restorSignatures, folder ${rootPathDestination} not found`);
    throw new Error("An error occured during signature restoration");
  }
}

/**
 * Description : Restore taskbar process, copy registry entry found in registry.json file
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restoreTaskbar(): Promise<void> {
  const registryKey: string = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
  let finalDestination: string = `${getFullPath()}\\${Repertories.taskbar}`;
  const taskbarPath = `${
    userInfo().homedir
  }\\AppData\\Roaming\\Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\TaskBar`;

  // Retrieve .json file
  if (fs.existsSync(finalDestination)) {
    let regDestination = `${finalDestination}\\${Files.taskbar}`;
    let contentDestination = `${finalDestination}\\content`;
    let data: registryItem = JSON.parse(fs.readFileSync(regDestination, "utf8"));

    // Use class to set proper object
    let item = new registryItem();
    item.values = data[registryKey]["values"];

    try {
      // Push new registry item
      for (let key in item.values) {
        const registryValue = {
          [registryKey]: {
            [key]: {
              value: item.values[key]["value"],
              type: item.values[key]["type"],
            },
          },
        };
        regedit.putValue(registryValue, (err: Error) => {
          if (err) {
            throw new Error("An error occured during taskbar restoration");
          }
        });
      }
      // Copy shortcuts
      if (fs.existsSync(contentDestination)) {
        fs.copySync(contentDestination, taskbarPath, { overwrite: true });
      }
    } catch (err) {
      throw new Error("An error occured during taskbar restoration");
    }
  } else {
    console.error(`Error detected in restorTaskbar, folder ${finalDestination} not found`);
    throw new Error("An error occured during taskbar restoration");
  }
}

/**
 * Description : Restore printers process, copy printer from printers.json file, install with child_process
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
export async function restorePrinters(contents: Electron.WebContents): Promise<void> {
  let rootPathDestination: string = `${getFullPath()}\\${Repertories.printers}\\${Files.printers}`;

  // Retrieve .json file
  if (fs.existsSync(rootPathDestination)) {
    // read json file && retrieve printers
    let printersSorted: Electron.PrinterInfo[] = [];
    let printersInstalled: Electron.PrinterInfo[] = contents.getPrinters();
    let printerSaved: registryItem = JSON.parse(fs.readFileSync(rootPathDestination, "utf8"));
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
    // Launch child_process spawn function
    printersSorted.forEach((printer) => {
      try {
        spawn_cmd(printer["name"]);
      } catch (err) {
        console.error(err);
        // Swallow
      }
    });
  } else {
    console.error(`Error detected in restorePrinters, folder ${rootPathDestination} not found`);
    throw new Error("An error occured during printers restoration");
  }
}

/**
 * Description : Restore browser process, copy registry item and edge's folder
 *               This process is only available with edge chromium
 * @return Promise<void>
 * @throws TODO
 */
export async function restoreBrowser(): Promise<void> {
  const rootPathSource = `${userInfo().homedir}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default`;
  const rootPathDestination = `${getFullPath()}\\${Repertories.browser}`;

  if (fs.existsSync(rootPathDestination)) {
    //  Build command
    let cmd = `xcopy /Y ${rootPathDestination}\\Bookmarks "${rootPathSource}"`;
    // Run builded command
    try {
      spawn_cmd(cmd);
    } catch (err) {
      throw err;
    }
  } else {
    console.error(`Error detected in restoreBrowser, folder ${rootPathDestination} not found`);
    throw new Error("An error occured during browser restoration");
  }
}
