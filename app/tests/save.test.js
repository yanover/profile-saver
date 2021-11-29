const { setDirectoryPath } = require("../services/config-service");
const fs = require("fs-extra");
const path = require('path');
const { randomUUID } = require("crypto");
const { initSave } = require("../lib/save");

// Test folder path
const TEST_PATH = path.join(__dirname, `_testFolder__${randomUUID()}`)

beforeAll(() => {
    // Create test folder
    fs.mkdirSync(TEST_PATH);
    // Set new location for test save
    setDirectoryPath(TEST_PATH);
});

afterAll(() => {
    fs.rmdirSync(TEST_PATH, { recursive: true })
})

// TODO
test("Test initSave()", async () => {

    await initSave();

});



