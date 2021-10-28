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
export function loadRootPath(): void {
  // Check if default home directory is reacheable
  if (isReacheable(Default.DIRECTORY_PATH)) {
    console.log("Repertory founded");
  } else if (isReacheable(`${os.userInfo().homedir}\\Documents`)) {
    // Swap for default document folder
    Default.DIRECTORY_PATH = `${os.userInfo().homedir}\\Documents`;
  } else {
    throw Error("No valid directory were found");
  }
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
  fs.access(path, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(`${path} ${err.code === "ENOENT" ? "does not exist" : "is read-only"}`);
      return false;
    }
  });
  return true;
}
