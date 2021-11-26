import os = require("os");
import { isReacheable } from "./utils-service";

// Enum for managing paths name
export const Default = {
  DIRECTORY_PATH: "m:\\", // Make sure this location is reachable if you change it
  DIRECTORY_NAME: "Profile-Saver",
  PRINT_SERVER: "printserver", // Adapte this value to you needs
};

// Enum for managing folders name
export enum Repertories {
  desktop = "Desktop",
  signature = "Signatures",
  taskbar = "Taskbar",
  printers = "Printers",
  browser = "Browser",
}

// Enum for managing files name
export enum Files {
  info = "info.txt",
  printers = "printers.json",
  taskbar = "regedit.json",
}

/**
 * This function is load during boot process, define the final directory for storing backup
 * If the directory defined in Default.DIRECTORY_PATH is unreachable, default location will be user's document folder
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
      Default.DIRECTORY_PATH = `${os.userInfo().homedir}\\Documents\\`;
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
