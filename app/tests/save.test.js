const { userInfo } = require("../services/utils-service");
const { setDirectoryPath, Files, getFullPath, Repertories } = require("../services/config-service");
const fs = require("fs-extra");
const path = require('path');
const { randomUUID } = require("crypto");
const { initSave, saveDesktop } = require("../lib/save");

// Test folder path
const TEST_PATH = path.join(__dirname, `_testFolder__${randomUUID()}`)

beforeAll(() => {
    // Create test folder
    fs.mkdirSync(TEST_PATH);
    // Set new location for default save directory
    setDirectoryPath(TEST_PATH);
});

afterAll(() => {
    // Remove test folder at the end
    fs.rmdirSync(TEST_PATH, { recursive: true })
})

test("Test initSave() function", async () => {
    // Execute initSave with default parameters
    let test = await initSave();
    console.log(`InitSave Result : ${test}`)
    // Check if only info.txt has been created
    let content = fs.readdirSync(getFullPath());
    expect(["info.txt"]).toEqual(content);
    // Check if info file has been created
    let infoFile = fs.existsSync(getFullPath() + '\\' + Files.info)
    expect(infoFile).toBe(true)
});

test("Test saveDesktop() function", async () => {
    await saveDesktop();
    // Compare desktop content and backup
    const backupFolder = fs.readdirSync(`${getFullPath()}\\${Repertories.desktop}`);
    const desktop = fs.readdirSync(`${userInfo().homedir}\\${Repertories.desktop}`);
    expect(backupFolder).toEqual(desktop);
});
