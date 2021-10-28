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
