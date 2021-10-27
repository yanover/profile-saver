// Interface for managing return values
interface IConfig {
  folderPath?: string;
  folderName?: string;
}

// Enum for managing path
enum Default {
  DIRECTORY_PATH = "m:\\",
  DIRECTORY_NAME = "Profil-Saver",
}

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
 * Return root path for profil
 * @returns string
 */
export function getFolderPath(): IConfig {
  return {
    folderPath: Default.DIRECTORY_PATH,
  };
}

/**
 * Return name of profil
 * @returns string
 */
export function getFolderName(): IConfig {
  return {
    folderPath: Default.DIRECTORY_NAME,
  };
}

/**
 * Return full path
 * @returns string
 */
export function getFullPath(): string {
  return Default.DIRECTORY_PATH + Default.DIRECTORY_NAME;
}
