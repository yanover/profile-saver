"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.getFullPath = exports.loadRootPath = exports.Files = exports.Repertories = exports.Default = void 0;
var fs = require("fs-extra");
var os = require("os");
// Enum for managing path
exports.Default = {
    DIRECTORY_PATH: "m:\\",
    DIRECTORY_NAME: "Profil-Saver",
};
// Enum for managing folder name
var Repertories;
(function (Repertories) {
    Repertories["desktop"] = "Desktop";
    Repertories["signature"] = "Signatures";
    Repertories["taskbar"] = "Taskbar";
    Repertories["printers"] = "Printers";
})(Repertories = exports.Repertories || (exports.Repertories = {}));
var Files;
(function (Files) {
    Files["info"] = "info.txt";
    Files["printers"] = "printers.json";
    Files["taskbar"] = "regedit.json";
})(Files = exports.Files || (exports.Files = {}));
/**
 * This function is load during boot process, define the final directory for storing backup
 * @returns void
 * @throws Error - directory not found or permission denied
 */
function loadRootPath() {
    return new Promise(function (resolve, reject) {
        // Check if default home directory is reacheable
        if (isReacheable(exports.Default.DIRECTORY_PATH)) {
            console.log("Default repertory founded");
            resolve();
        }
        else if (isReacheable(os.userInfo().homedir + "\\Documents")) {
            console.log("Default repertory not founded, swap for document folder");
            // Swap for default document folder
            exports.Default.DIRECTORY_PATH = os.userInfo().homedir + "\\Documents";
            resolve();
        }
        reject();
    });
}
exports.loadRootPath = loadRootPath;
/**
 * Return the full builded path
 * @returns string
 */
function getFullPath() {
    return exports.Default.DIRECTORY_PATH + exports.Default.DIRECTORY_NAME;
}
exports.getFullPath = getFullPath;
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
/**
 * Check if a folder is empty
 * @param path the path to check
 * @returns true = is empty | false = is not empty
 */
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=config-service.js.map