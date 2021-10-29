"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.isReacheable = void 0;
var fs = require("fs-extra");
/**
 * Define if the path passed in argument is accessible and writeable
 * @param path The file or directory to check
 * @returns true = ok, can access, read and write | false = permission denied
 */
function isReacheable(path) {
    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
        console.log(path + " is both readable and writable");
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isReacheable = isReacheable;
/**
 * Check if a folder is empty
 * @param path the path to check
 * @returns true = is empty | false = is not empty
 */
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=utils-service.js.map