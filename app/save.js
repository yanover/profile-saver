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
exports.savePrinters = exports.saveTaskbar = exports.saveSignature = exports.saveDesktop = exports.save = void 0;
var electron_1 = require("electron");
var fs = require("fs-extra");
var os = require("os");
var config_service_1 = require("./config-service");
var regedit = require("regedit");
// Get fullPath from configService
var rootPath = config_service_1.getFullPath();
function userInfo() {
    return os.userInfo();
}
function save(win) {
    return __awaiter(this, void 0, void 0, function () {
        var response, finalDestination, _a, _b, _i, item, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    response = 0;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    finalDestination = rootPath + "\\info.txt";
                    if (!fs.existsSync(rootPath)) {
                        // Folder doesn't exist, creating
                        fs.mkdirSync(rootPath);
                    }
                    else if (fs.readdirSync(rootPath).length > 0) {
                        // Carefull, there is already a save in the final destination (oui = 1)
                        response = electron_1.dialog.showMessageBoxSync(win, {
                            type: "warning",
                            buttons: ["Non", "Oui"],
                            title: "Confirmation",
                            message: "Attention, une sauvegarde est d\u00E9j\u00E0 pr\u00E9sente au r\u00E9pertoire \"" + rootPath + "\", \u00EAtes-vous certain de vouloir \u00E9craser son contenu ?",
                        });
                    }
                    else {
                        // Folder exist but is empty
                        response = 1;
                    }
                    if (!response) return [3 /*break*/, 5];
                    // Create info file
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Info file (" + finalDestination + ") doesn't exist, creating");
                        fs.createFileSync(finalDestination);
                    }
                    // Write content - override if exists
                    fs.writeFileSync(finalDestination, "Projet : SaveProfile\n");
                    fs.appendFileSync(finalDestination, "Auteur : Yann Schoeni\n");
                    fs.appendFileSync(finalDestination, "Date de la sauvegarde : " + getDate() + "\n");
                    _a = [];
                    for (_b in config_service_1.Repertories)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    item = _a[_i];
                    return [4 /*yield*/, fs.rm(rootPath + "\\" + item, { recursive: true, force: true })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // Return result
                return [2 /*return*/, response];
                case 6:
                    err_1 = _c.sent();
                    console.error(err_1);
                    throw new Error(err_1);
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.save = save;
function saveDesktop() {
    return __awaiter(this, void 0, void 0, function () {
        var desktopPath, finalDestination, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    desktopPath = userInfo().homedir + "\\" + config_service_1.Repertories.desktop;
                    finalDestination = rootPath + "\\Desktop";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Create folder
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                        fs.mkdirSync(finalDestination);
                    }
                    return [4 /*yield*/, fs
                            .copy(desktopPath, finalDestination, { overwrite: true })
                            .then(function () {
                            return "Sucess !";
                        })
                            .catch(function (err) {
                            console.error(err);
                            throw new Error(err);
                        })];
                case 2: 
                // Copy content
                return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    console.error(err_2);
                    throw new Error(err_2);
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveDesktop = saveDesktop;
function saveSignature() {
    return __awaiter(this, void 0, void 0, function () {
        var signaturePath, finalDestination, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signaturePath = userInfo().homedir + "\\AppData\\Roaming\\Microsoft\\" + config_service_1.Repertories.signature;
                    finalDestination = rootPath + "\\" + config_service_1.Repertories.signature;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Create folder
                    if (!fs.existsSync(finalDestination)) {
                        console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                        fs.mkdirSync(finalDestination);
                    }
                    return [4 /*yield*/, fs
                            .copy(signaturePath, finalDestination, { overwrite: true })
                            .then(function () {
                            return "Sucess !";
                        })
                            .catch(function (err) {
                            console.error(err);
                            throw new Error(err);
                        })];
                case 2: 
                // Copy content
                return [2 /*return*/, _a.sent()];
                case 3:
                    err_3 = _a.sent();
                    console.error(err_3);
                    throw new Error(err_3);
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveSignature = saveSignature;
function saveTaskbar() {
    return __awaiter(this, void 0, void 0, function () {
        var finalDestination, registryKey;
        return __generator(this, function (_a) {
            finalDestination = rootPath + "\\" + config_service_1.Repertories.taskbar;
            registryKey = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
            return [2 /*return*/, regedit.list(registryKey, function (err, result) {
                    try {
                        var regDestination = finalDestination + "\\regedit.json";
                        // Create folder
                        if (!fs.existsSync(finalDestination)) {
                            console.log("Destination folder (" + finalDestination + ") doesn't exist, creating");
                            fs.mkdirSync(finalDestination);
                        }
                        // Create json file
                        if (!fs.existsSync(regDestination)) {
                            console.log("Destination file (" + regDestination + ") doesn't exist, creating");
                            fs.createFileSync(regDestination);
                        }
                        // Write registry value in .json
                        return fs.writeFileSync(regDestination, JSON.stringify(result, null, 2), "utf-8");
                    }
                    catch (err) {
                        console.error(err);
                        throw new Error(err);
                    }
                })];
        });
    });
}
exports.saveTaskbar = saveTaskbar;
function savePrinters(contents) {
    return __awaiter(this, void 0, void 0, function () {
        var printers, finalDestination, printersSorted, fileDestination;
        return __generator(this, function (_a) {
            printers = contents.getPrinters();
            finalDestination = rootPath + "\\" + config_service_1.Repertories.printers;
            printersSorted = [];
            try {
                fileDestination = finalDestination + "\\printers.json";
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
                throw new Error(err);
            }
            return [2 /*return*/];
        });
    });
}
exports.savePrinters = savePrinters;
function getDate() {
    var today = new Date();
    var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
}
//# sourceMappingURL=save.js.map