"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullPath = exports.loadRootPath = exports.Files = exports.Repertories = exports.Default = void 0;
var os = require("os");
var utils_service_1 = require("./utils-service");
// Enum for managing paths name
exports.Default = {
    DIRECTORY_PATH: "m:\\",
    DIRECTORY_NAME: "Profile-Saver",
    PRINT_SERVER: "s2lprint3"
};
// Enum for managing folders name
var Repertories;
(function (Repertories) {
    Repertories["desktop"] = "Desktop";
    Repertories["signature"] = "Signatures";
    Repertories["taskbar"] = "Taskbar";
    Repertories["printers"] = "Printers";
    Repertories["browser"] = "Browser";
})(Repertories = exports.Repertories || (exports.Repertories = {}));
// Enum for managing files name
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
        if (utils_service_1.isReacheable(exports.Default.DIRECTORY_PATH)) {
            console.log("Default repertory founded");
            resolve();
        }
        else if (utils_service_1.isReacheable(os.userInfo().homedir + "\\Documents")) {
            console.log("Default repertory not founded, swap for document folder");
            // Swap for default document folder
            exports.Default.DIRECTORY_PATH = os.userInfo().homedir + "\\Documents\\";
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
//# sourceMappingURL=config-service.js.map