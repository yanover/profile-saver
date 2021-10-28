"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullPath = exports.loadRootPath = exports.Files = exports.Repertories = exports.Default = void 0;
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
    // Check if default home directory is reacheable
    if (isReacheable(exports.Default.DIRECTORY_PATH)) {
        console.log("Repertory founded");
    }
    else if (isReacheable(os.userInfo().homedir + "\\Documents")) {
        // Swap for default document folder
        exports.Default.DIRECTORY_PATH = os.userInfo().homedir + "\\Documents";
    }
    else {
        throw Error("No valid directory were found");
    }
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
    fs.access(path, fs.constants.F_OK | fs.constants.W_OK, function (err) {
        if (err) {
            console.error(path + " " + (err.code === "ENOENT" ? "does not exist" : "is read-only"));
            return false;
        }
    });
    return true;
}
//# sourceMappingURL=config-service.js.map