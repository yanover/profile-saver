"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfo = exports.deleteFolderRecursive = exports.execute = exports.getDateTime = exports.isEmpty = exports.isReacheable = void 0;
var fs = require("fs-extra");
var os = require("os");
var child_process_1 = require("child_process");
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
 * Return current date and time whit format : jj-mm-aaaa : hh:mm:ss (29-10-2021 : 12:23:33)
 * @returns string
 */
function getDateTime() {
    var today = new Date();
    var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
}
exports.getDateTime = getDateTime;
/**
 * Execute the command passed in parameter throught cmd.exe
 * @param command the command that needs to be executed
 */
function execute(command, mode) {
    if (mode === "spawn") {
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
        if (stmt.stderr) {
            stmt.stderr.on("data", function (data) {
                console.error("stderr: " + data);
            });
        }
    }
    else {
        child_process_1.exec(command, function (error, stdout, stderr) {
            if (error) {
                // TODO
            }
        });
    }
}
exports.execute = execute;
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
function userInfo() {
    return os.userInfo();
}
exports.userInfo = userInfo;
//# sourceMappingURL=utils-service.js.map