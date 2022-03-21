import fs = require("fs-extra");
import os = require("os");
import { exec, spawn, SpawnOptions } from "child_process";
import { BrowserWindow, dialog } from "electron";
import { WarningException } from "../common";
import { ByteConvertor } from "./converter-service";
import { IStorageValue } from "../models/IStorageValue";
const fastFolderSize = require("fast-folder-size");
const convertor = new ByteConvertor();

/**
 * Define if the path passed in argument is accessible and writeable
 * @param path The file or directory to check
 * @returns true = ok, can access, read and write | false = permission denied
 */
export function isReacheable(path: string): boolean {
  if (fs.existsSync(path)) {
    try {
      fs.accessSync(path, fs.constants.W_OK);
      console.log(`Path : ${path} is reacheable`);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return false;
}

/**
 * Check if a folder is empty
 * @param path the path to check
 * @returns true = is empty | false = is not empty
 */
export function isEmpty(path: string): boolean {
  return fs.readdirSync(path).length === 0;
}

/**
 * Return current date and time whit format : jj-mm-aaaa : hh:mm:ss (29-10-2021 : 12:23:33)
 * @returns string
 */
export function getDateTime(): string {
  let today = new Date();
  let date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}

/**
 * Execute the command passed in parameter throught cmd.exe
 * @param command the command that needs to be executed
 */
export function spawn_cmd(command: string): void {
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

  if (stmt.stderr) {
    stmt.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  }
}

/**
 * Execute the command passed in parameter throught cmd.exe
 * @param command the command that needs to be executed
 */
export async function exec_cmd(command: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      // Return result
      resolve(stdout.trim());
    });
  });
}

export function userInfo(): os.UserInfo<string> {
  return os.userInfo();
}

export async function directoryPicker(win: BrowserWindow) {
  let file = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });

  if (file.canceled) {
    throw new WarningException("Folder picked closed");
  }

  return file.filePaths[0];
}

/**
 * Return the size used by a folder in the filesystem
 * @param path the path that needs to be inspected
 * @param format format must be a string ["KB", "MB", "GB"], default is MB
 */
export async function getFolderSize(path: string, format: string = "MB"): Promise<number> {
  return new Promise((res, rej) => {
    fastFolderSize(path, (err: any, bytes: number) => {
      res(Math.round((bytes / 1024 / 1024) * 100) / getFormat(format));
    });
  });
}

/**
 * Return the free space available on the location specified
 * @param path the path that needs to be inspected
 * @param format format must be a string ["KB", "MB", "GB"], default is MB
 */
export async function getFolderSpace(path: string): Promise<IStorageValue> {
  return new Promise((res, rej) => {
    exec_cmd(`dir ${path}`)
      .then((result) => {
        var regex = /\n.*$/;
        let match = regex.exec(result);
        let size = match[0]
          .slice(1)
          .split(" ")
          .filter((i) => i)[2]
          .split("'")
          .join("");

        // Add AUTO to convertor as an output feature
        let freeSpace: IStorageValue = convertor.convert(parseInt(size), "B", "GB");
        
        if (freeSpace.data) {
          res(freeSpace);
        } else {
          rej("Impossible de déterminer l'espace disponible");
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
}

function getFormat(format: string): number {
  let factor: number = 100;

  switch (format) {
    case "KB": {
      factor = 0.0001;
      break;
    }
    case "MB": {
      factor = 0.1;
      break;
    }
    case "GB": {
      factor = 100;
      break;
    }
    default: {
      console.log(`Invalid format supply : ${format}`);
      break;
    }
  }
  return factor;
}
