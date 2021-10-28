import fs = require("fs-extra");
import os = require("os");

// Enum for managing path
export const Default = {
  DIRECTORY_PATH: "m:\\",
  DIRECTORY_NAME: "Profil-Saver",
};

// Enum for managing folder name
export enum Repertories {
  desktop = "Desktop",
  signature = "Signatures",
  taskbar = "Taskbar",
  printers = "Printers",
}

export enum Files {
  info = "info.txt",
  printers = "printers.json",
  taskbar = "regedit.json",
}

/**
 * This function is load during boot process, define the final directory for storing backup
 * @returns void
 * @throws Error - directory not found or permission denied
 */
export function loadRootPath(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if default home directory is reacheable
    if (isReacheable(Default.DIRECTORY_PATH)) {
      console.log("Default repertory founded");
      resolve();
    } else if (isReacheable(`${os.userInfo().homedir}\\Documents`)) {
      console.log("Default repertory not founded, swap for document folder");
      // Swap for default document folder
      Default.DIRECTORY_PATH = `${os.userInfo().homedir}\\Documents`;
      resolve();
    }
    reject();
  });
}

/**
 * Return the full builded path
 * @returns string
 */
export function getFullPath(): string {
  return Default.DIRECTORY_PATH + Default.DIRECTORY_NAME;
}

/**
 * Define if the path passed in argument is accessible and writeable
 * @param path The file or directory to check
 * @returns true = ok, can access, read and write | false = permission denied
 */
function isReacheable(path: string): boolean {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
    console.log(`${path} is both readable and writable`);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Check if a folder is empty
 * @param path the path to check
 * @returns true = is empty | false = is not empty
 */
export function isEmpty(path: string): boolean {
  return fs.readdirSync(path).length === 0;
}
