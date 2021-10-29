import fs = require("fs-extra");

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
 * Retourne la date et l'heure courante au format : jj-mm-aaaa : hh:mm:ss (29-10-2021 : 12:23:33)
 * @returns string
 */
export function getDateTime(): string {
  let today = new Date();
  let date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}
