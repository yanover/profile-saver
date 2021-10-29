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
exports.restorePrinters = exports.restoreTaskbar = exports.restoreSignature = exports.restoreDesktop = exports.restore = exports.getSave = void 0;
var child_process_1 = require("child_process");
var fs = require("fs-extra");
var os = require("os");
var config_service_1 = require("../services/config-service");
var utils_service_1 = require("../services/utils-service");
var regedit = require("regedit");
var registryItem = /** @class */ (function () {
    function registryItem() {
    }
    return registryItem;
}());
/**
 * Description : Returns last save's date from info.txt file
 * @return Promise<string>
 * @throws CopyError | FileNotFoundException
 */
function getSave() {
    return __awaiter(this, void 0, void 0, function () {
        var infoFile, pattern, data, index;
        return __generator(this, function (_a) {
            infoFile = config_service_1.getFullPath() + "\\" + config_service_1.Files.info;
            if (fs.existsSync(infoFile)) {
                try {
                    pattern = "Date";
                    data = fs.readFileSync(infoFile).toString();
                    index = data.indexOf(pattern);
                    if (index > -1) {
                        return [2 /*return*/, data.slice(index, data.length).split(":").slice(1, data.length).join(":")];
                    }
                }
                catch (err) {
                    console.error(err);
                    throw new Error("An error occured during desktop restoration");
                }
            }
            else {
                console.error("File " + infoFile + " not found");
                throw new Error("An error occured during desktop restoration");
            }
            return [2 /*return*/];
        });
    });
}
exports.getSave = getSave;
/**
 * Description : Returns a litteral object with items th
 * @return Promise<IitemToSave>
 */
function restore() {
    return __awaiter(this, void 0, void 0, function () {
        var itemToSave, key, path;
        return __generator(this, function (_a) {
            itemToSave = {
                desktop: false,
                printers: false,
                signatures: false,
                taskbar: false,
            };
            // We want to know how many options will be process
            if (fs.existsSync(config_service_1.getFullPath())) {
                for (key in itemToSave) {
                    path = config_service_1.getFullPath() + "\\" + (key.charAt(0).toUpperCase() + key.slice(1));
                    if (fs.existsSync(path) && !utils_service_1.isEmpty(path)) {
                        itemToSave[key] = true;
                    }
                    else {
                        itemToSave[key] = false;
                    }
                }
            }
            else {
                console.info("File " + config_service_1.getFullPath() + " not found");
            }
            return [2 /*return*/, itemToSave];
        });
    });
}
exports.restore = restore;
/**
 * Description : Restore desktop process, copy saved content on user's current desktop
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function restoreDesktop() {
    return __awaiter(this, void 0, void 0, function () {
        var rootPathSource, rootPathDestination;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rootPathSource = userInfo().homedir + "\\" + config_service_1.Repertories.desktop.toLowerCase();
                    rootPathDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.desktop;
                    if (!fs.existsSync(rootPathDestination)) return [3 /*break*/, 2];
                    // Copy content
                    return [4 /*yield*/, fs.copy(rootPathDestination, rootPathSource, { overwrite: false }).catch(function (err) {
                            console.error(err);
                            throw new Error("An error occured during desktop restoration");
                        })];
                case 1:
                    // Copy content
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.error("Error detected in restoreDesktop, folder " + rootPathDestination + " not found");
                    throw new Error("An error occured during desktop restoration");
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.restoreDesktop = restoreDesktop;
/**
 * Description : Restore signature process, copy saved content on user's current signature's directory
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function restoreSignature() {
    return __awaiter(this, void 0, void 0, function () {
        var rootPathSource, rootPathDestination;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rootPathSource = userInfo().homedir + "\\AppData\\Roaming\\Microsoft\\Signatures";
                    rootPathDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.signature;
                    if (!fs.existsSync(rootPathDestination)) return [3 /*break*/, 2];
                    // Copy content
                    return [4 /*yield*/, fs.copy(rootPathDestination, rootPathSource, { overwrite: false }).catch(function (err) {
                            console.error(err);
                            throw new Error("An error occured during signature restoration");
                        })];
                case 1:
                    // Copy content
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.error("Error detected in restorSignatures, folder " + rootPathDestination + " not found");
                    throw new Error("An error occured during signature restoration");
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.restoreSignature = restoreSignature;
/**
 * Description : Restore taskbar process, copy registry entry found in registry.json file
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function restoreTaskbar() {
    return __awaiter(this, void 0, void 0, function () {
        var registryName, rootPathDestination, data, item, key, registryValue;
        var _a, _b;
        return __generator(this, function (_c) {
            registryName = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband";
            rootPathDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.taskbar + "\\" + config_service_1.Files.taskbar;
            // Retrieve .json file
            if (fs.existsSync(rootPathDestination)) {
                data = JSON.parse(fs.readFileSync(rootPathDestination, "utf8"));
                item = new registryItem();
                item.values = data[registryName]["values"];
                try {
                    for (key in item.values) {
                        registryValue = (_a = {},
                            _a[registryName] = (_b = {},
                                _b[key] = {
                                    value: item.values[key]["value"],
                                    type: item.values[key]["type"],
                                },
                                _b),
                            _a);
                        regedit.putValue(registryValue, function (err) {
                            if (err) {
                                throw new Error("An error occured during signature restoration");
                            }
                        });
                    }
                }
                catch (err) {
                    throw new Error("An error occured during signature restoration");
                }
            }
            else {
                console.error("Error detected in restorTaskbar, folder " + rootPathDestination + " not found");
                throw new Error("An error occured during taskbar restoration");
            }
            return [2 /*return*/];
        });
    });
}
exports.restoreTaskbar = restoreTaskbar;
/**
 * Description : Restore printers process, copy printer from printers.json file, install with child_process
 * @return Promise<void>
 * @throws CopyError | FileNotFoundException
 */
function restorePrinters(contents) {
    return __awaiter(this, void 0, void 0, function () {
        var rootPathDestination, errorMessage, result, printersSorted, printersInstalled, printerSaved, count, i, j;
        return __generator(this, function (_a) {
            rootPathDestination = config_service_1.getFullPath() + "\\" + config_service_1.Repertories.printers + "\\" + config_service_1.Files.printers;
            errorMessage = "";
            result = true;
            // Retrieve .json file
            if (fs.existsSync(rootPathDestination)) {
                printersSorted = [];
                printersInstalled = contents.getPrinters();
                printerSaved = JSON.parse(fs.readFileSync(rootPathDestination, "utf8"));
                count = 0;
                // retrieve printer to install
                for (i in printerSaved) {
                    count = 0;
                    for (j in printersInstalled) {
                        if (printerSaved[i]["name"] == printersInstalled[j]["name"]) {
                            break;
                        }
                        else {
                            count = count + 1;
                            if (count == printersInstalled.length) {
                                printersSorted.push(printerSaved[i]);
                            }
                        }
                    }
                }
                // Launch child_process execute function
                printersSorted.forEach(function (printer) {
                    try {
                        execute(printer["name"]);
                    }
                    catch (err) {
                        console.error(err);
                        // Swallow
                    }
                });
            }
            else {
                console.error("Error detected in restorePrinters, folder " + rootPathDestination + " not found");
                throw new Error("An error occured during printers restoration");
            }
            return [2 /*return*/];
        });
    });
}
exports.restorePrinters = restorePrinters;
function execute(command) {
    // command = `start ${command}`;
    console.log("Commande intercepted : " + command);
    // Build args
    var args = ["/s", "/c", "start", "", command];
    var opts = {
        shell: false,
        detached: true,
        stdio: "ignore",
        windowsHide: true,
    };
    // Execute statment
    var stmt = child_process_1.spawn("cmd.exe", args, opts);
    stmt.stderr.on("data", function (data) {
        console.error("stderr: " + data);
    });
}
function userInfo() {
    return os.userInfo();
}
//# sourceMappingURL=restore.js.map