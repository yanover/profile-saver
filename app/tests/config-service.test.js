const { Default, getFullPath, loadRootPath } = require("../services/config-service");
const os = require("os");

beforeAll(() => {

});

test("Test if getFullPath() return the right value", () => {
    const path = Default.DIRECTORY_PATH + Default.DIRECTORY_NAME;
    expect(getFullPath()).toBe(path);
});

test("Check if loadRootPath() return the right value", () => {
    loadRootPath();
    expect(Default.DIRECTORY_PATH).toBe(Default.DIRECTORY_PATH)
});

test("Check if loadRootPath() return document if default folder is unreachable", () => {
    // change default value to be an unreachable folder
    Default.DIRECTORY_PATH = "K:"
    loadRootPath();
    expect(Default.DIRECTORY_PATH).toBe(`${os.userInfo().homedir}\\Documents\\`)
});