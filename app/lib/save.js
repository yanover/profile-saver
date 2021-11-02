"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePrinters = exports.saveTaskbar = exports.saveSignature = exports.saveDesktop = exports.initSave = void 0;
var electron_1 = require("electron");
var fs = require("fs-extra");
var os = require("os");
var config_service_1 = require("../services/config-service");
var utils_service_1 = require("../services/utils-service");
var regedit = require("regedit");
function userInfo() {
    return os.userInfo();
}
/**
 * Check if save destination is reacheable, write to info file, destroy all data found in old save
 * @param win main windows, used to pushed confirm windows if a save already exist and will be override
 * @returns Promise<number>
 */
function initSave(win) {
    return __awaiter(this, void 0, void 0, function () {
        var response, finalDestination;
        return __generator(this, function (_a) {
            response = 0;
            try {
                finalDestination = config_service_1.getFullPath() + "\\" + config_service_1.Files.info;
                if (!fs.existsSync(config_service_1.getFullPath())) {
                    // Folder doesn't exist, creating
                    fs.mkdirSync(config_service_1.getFullPath());
                }
                else if (fs.readdirSync(config_service_1.getFullPath()).length > 0) {
                    // Carefull, there is already a save in the final destination (oui = 1)
                    response = electron_1.dialog.showMessageBoxSync(win, {
                        type: "warning",
                        buttons: ["Non", "Oui"],
                        title: "Confirmation",
                        message: "Attention, une sauvegarde est d\u00E9j\u00E0 pr\u00E9sente au r\u00E9pertoire \"" + config_service_1.getFullPath() + "\", \u00EAtes-vous certain de vouloir \u00E9craser son contenu ?",
                    });
                }
                else {
                    // Folder exist but is empty
                    response = 1;
                }
                if (response) {
                    // Create info file
                    if (!fs.existsSync(finalDestination)) {
                        fs.createFileSync(finalDestination);
                    }
                    // Write content - override if exists
                    fs.writeFileSync(finalDestination, "Projet : SaveProfile\n");
                    fs.appendFileSync(finalDestination, "Auteur : Yann Schoeni\n");
                    fs.appendFileSync(finalDestination, "Date de la sauvegarde : " + utils_service_1.getDateTime() + "\n");
                    // Empty all folder
                    Object.keys(config_service_1.Repertories).map(function (key) {
                        fs.rmSync(config_service_1.getFullPath() + "\\" + config_service_1.Repertories[key], { recursive: true, force: true });
                    });
                    // TODO --> remove content folder
                }
                // Return result
                return [2 /*return*/, response];
            }
            catch (err) {
                console.error(err);
                throw new Error("An error occured during initSave");
            }
            return [2 /*return*/];
        });
    });
}
exports.initSave = initSave;
/**
 * Description : Save desktop process, copy user's current desktop on backup folder
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function saveDesktop() {
    return __awaiter(this, void 0, void 0, function () {
        var desktopPath, finalDestination, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    desktopPath = userInfo().homedir + "\\" + config_service_1.Repertories.desktop;
                    finalDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.desktop;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Create folder
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                        fs.mkdirSync(finalDestination);
                    }
                    return [4 /*yield*/, fs.copy(desktopPath, finalDestination, { overwrite: true }).catch(function (err) {
                            console.error(err);
                            throw new Error("An error occured during desktop save");
                        })];
                case 2: 
                // Copy content
                return [2 /*return*/, _a.sent()];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    throw new Error("An error occured during desktop save");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveDesktop = saveDesktop;
/**
 * Description : Save signature process, copy user's current signature on backup folder
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function saveSignature() {
    return __awaiter(this, void 0, void 0, function () {
        var signaturePath, finalDestination, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signaturePath = userInfo().homedir + "\\AppData\\Roaming\\Microsoft\\" + config_service_1.Repertories.signature;
                    finalDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.signature;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Create folder
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                        fs.mkdirSync(finalDestination);
                    }
                    return [4 /*yield*/, fs.copy(signaturePath, finalDestination, { overwrite: true }).catch(function (err) {
                            console.error(err);
                            throw new Error("An error occured during signature save");
                        })];
                case 2: 
                // Copy content
                return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    throw new Error("An error occured during signature save");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveSignature = saveSignature;
/**
 * Description : Save taskbar process, TODO
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function saveTaskbar() {
    return __awaiter(this, void 0, void 0, function () {
        var finalDestination, registryKey, taskbarPath;
        return __generator(this, function (_a) {
            finalDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.taskbar;
            registryKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
            taskbarPath = userInfo().homedir + "\\AppData\\Roaming\\Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\TaskBar";
            regedit.list(registryKey, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new Error("An error occured during taskabr save");
                }
                try {
                    var regDestination = finalDestination + "\\" + config_service_1.Files.taskbar;
                    var contentDestination = finalDestination + "\\content";
                    // Create folder
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                        fs.mkdirSync(finalDestination);
                    }
                    // Create json file
                    if (!fs.existsSync(regDestination) || !fs.existsSync(contentDestination)) {
                        console.log("Destination file (" + regDestination + ") doesn't exist, creating");
                        fs.createFileSync(regDestination);
                    }
                    // Copy appData content
                    fs.copySync(taskbarPath, contentDestination, { overwrite: true });
                    // Write registry value in .json
                    fs.writeFileSync(regDestination, JSON.stringify(result, null, 2), "utf-8");
                    // Copy passte
                }
                catch (err) {
                    console.error(err);
                    throw new Error("An error occured during taskabr save");
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.saveTaskbar = saveTaskbar;
/**
 * Description : Save printer process, TODO
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function savePrinters(contents) {
    return __awaiter(this, void 0, void 0, function () {
        var printers, finalDestination, printersSorted, fileDestination;
        return __generator(this, function (_a) {
            printers = contents.getPrinters();
            finalDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.printers;
            printersSorted = [];
            try {
                fileDestination = finalDestination + "\\" + config_service_1.Files.printers;
                // Create folder
                if (!fs.existsSync(finalDestination)) {
                    console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                    fs.mkdirSync(finalDestination);
                }
                // Create json file
                if (!fs.existsSync(fileDestination)) {
                    console.log("Destination file (" + fileDestination + ") doesn't exist, creating");
                    fs.createFileSync(fileDestination);
                }
                // Sort data
                printers.forEach(function (printer) {
                    if (printer.name.includes("s2lprint3")) {
                        printersSorted.push(printer);
                    }
                });
                // Push to .json file
                fs.writeFileSync(fileDestination, JSON.stringify(printersSorted, null, 2), "utf-8");
            }
            catch (err) {
                console.error(err);
                throw new Error("An error occured during printers save");
            }
            return [2 /*return*/];
        });
    });
}
exports.savePrinters = savePrinters;
//# sourceMappingURL=save.js.map