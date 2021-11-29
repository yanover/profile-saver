const { Default, getFullPath, loadRootPath, setDirectoryPath, calculateSquare } = require("../services/config-service");
const os = require("os");

test("Test if getFullPath() return the right value", () => {
    const path = Default.DIRECTORY_PATH + '\\' + Default.DIRECTORY_NAME;
    expect(getFullPath()).toBe(path);
});

test("Check if loadRootPath() return the right value", () => {
    loadRootPath();
    const expected = "m:"
    expect(Default.DIRECTORY_PATH).toBe(expected)
});

test("Check if loadRootPath() return document if default folder is unreachable", () => {
    // change default value to be an unreachable folder
    Default.DIRECTORY_PATH = "K:"
    loadRootPath();
    expect(Default.DIRECTORY_PATH).toBe(`${os.userInfo().homedir}\\Documents`)
});

test("Test if DIRECTORY_PATH setter works", () => {
    let testValue = "c:";
    // Set new reacheable value
    setDirectoryPath(testValue);
    expect(Default.DIRECTORY_PATH).toBe(testValue)
});

test("Test if DIRECTORY_PATH throw error if param is not reacheable", () => {
    expect(() => { setDirectoryPath("unreachablePath") }).toThrow('Default directory provided is unreachable');
});