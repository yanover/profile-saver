"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullPath = exports.getFolderName = exports.getFolderPath = exports.Files = exports.Repertories = void 0;
// Enum for managing path
var Default;
(function (Default) {
    Default["DIRECTORY_PATH"] = "m:\\";
    Default["DIRECTORY_NAME"] = "Profil-Saver";
})(Default || (Default = {}));
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
        folderPath: Default.DIRECTORY_PATH,
    };
}
exports.getFolderPath = getFolderPath;
/**
 * Return name of profil
 * @returns string
 */
function getFolderName() {
    return {
        folderPath: Default.DIRECTORY_NAME,
    };
}
exports.getFolderName = getFolderName;
/**
 * Return full path
 * @returns string
 */
function getFullPath() {
    return Default.DIRECTORY_PATH + Default.DIRECTORY_NAME;
}
exports.getFullPath = getFullPath;
//# sourceMappingURL=configService.js.map