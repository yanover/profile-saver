import fs = require("fs-extra");
import os = require("os");
import { exec, spawn, SpawnOptions } from "child_process";

/**
 * Define if the path passed in argument is accessible and writeable
 * @param path The file or directory to check
 * @returns true = ok, can access, read and write | false = permission denied
 */
export function isReacheable(path: string): boolean {
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
export function execute(command: string, mode?: string): void {
  if (mode === "spawn") {
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
  } else {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // TODO
      }
    });
  }
}

export function deleteFolderRecursive(path): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) {
            // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
}

export function userInfo(): os.UserInfo<string> {
  return os.userInfo();
}
