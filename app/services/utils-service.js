"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolderRecursive = exports.getDateTime = exports.isEmpty = exports.isReacheable = void 0;
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
/**
 * Retourne la date et l'heure courante au format : jj-mm-aaaa : hh:mm:ss (29-10-2021 : 12:23:33)
 * @returns string
 */
function getDateTime() {
    var today = new Date();
    var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
}
exports.getDateTime = getDateTime;
function deleteFolderRecursive(path) {
    return new Promise(function (resolve, reject) {
        try {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function (file, index) {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) {
                        // recurse
                        deleteFolderRecursive(curPath);
                    }
                    else {
                        // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        }
        catch (err) {
            reject(err);
        }
        resolve();
    });
}
exports.deleteFolderRecursive = deleteFolderRecursive;
//# sourceMappingURL=utils-service.js.map