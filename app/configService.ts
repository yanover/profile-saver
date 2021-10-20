// Initialize dotenv
require("dotenv").config();

// Interface for managing return values
interface IConfig {
  folderPath?: string;
  folderName?: string;
}

// Enum for managing keys
enum EnvKey {
  folderPath = "DIRECTORY_PATH",
  folderName = "DIRECTORY_NAME",
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
    folderPath: process.env[EnvKey.folderPath],
  };
}

/**
 * Return name of profil
 * @returns string
 */
export function getFolderName(): IConfig {
  return {
    folderPath: process.env[EnvKey.folderName],
  };
}

/**
 * Return full path
 * @returns string
 */
export function getFullPath(): string {
  return process.env[EnvKey.folderPath] + process.env[EnvKey.folderName];
}
