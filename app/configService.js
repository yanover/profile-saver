"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullPath = exports.getFolderName = exports.getFolderPath = exports.Files = exports.Repertories = void 0;
// Initialize dotenv
require("dotenv").config();
// Enum for managing keys
var EnvKey;
(function (EnvKey) {
    EnvKey["folderPath"] = "DIRECTORY_PATH";
    EnvKey["folderName"] = "DIRECTORY_NAME";
})(EnvKey || (EnvKey = {}));
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
 * Return root path for profil
 * @returns string
 */
function getFolderPath() {
    return {
        folderPath: process.env[EnvKey.folderPath],
    };
}
exports.getFolderPath = getFolderPath;
/**
 * Return name of profil
 * @returns string
 */
function getFolderName() {
    return {
        folderPath: process.env[EnvKey.folderName],
    };
}
exports.getFolderName = getFolderName;
/**
 * Return full path
 * @returns string
 */
function getFullPath() {
    return process.env[EnvKey.folderPath] + process.env[EnvKey.folderName];
}
exports.getFullPath = getFullPath;
//# sourceMappingURL=configService.js.map