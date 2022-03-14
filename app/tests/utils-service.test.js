const { isReacheable, isEmpty, getFolderSize } = require("../services/utils-service");
const fs = require("fs-extra");
const path = require('path');
const { randomUUID } = require("crypto");

// Static variables
const TEST_PATH = path.join(__dirname, `_testFolder__${randomUUID()}`)
const TEST_FILE = `${TEST_PATH}\\test.txt`
const UNREACHABLE_PATH = "I'm an unreacheable path";


beforeAll(() => {
  // Create test folder
  fs.mkdirSync(TEST_PATH);
});

afterAll(() => {
  try {
    // Remove test file
    // Remove test folder at the end
    fs.rmdirSync(TEST_PATH, { recursive: true });
  } catch (err) {
    // Swallow
  }
})

// TODO, test access (writable or not)
test("Test if test drive is reacheable", () => {
  const resultTrue = isReacheable(TEST_PATH);
  // This folder should be reacheable to validate the test
  expect(resultTrue).toBe(true);
});

test("Test if test drive is empty", () => {
  const resultTrue = isEmpty(TEST_PATH);
  // This folder should be empty to validate the test
  expect(resultTrue).toBe(true);
});

test("Test if test drive is not empty", () => {
  fs.createFileSync(TEST_FILE)
  const resultFalse = isEmpty(TEST_PATH);
  // This folder shouldn't be empty to validate the test
  expect(resultFalse).toBe(false);
});

test("Test if size is correct", async () => {
  // Create random file to have a size to check
  file = fs.openSync(TEST_FILE, 'w')
  // Write 100ko to the file
  fs.writeSync(file, Buffer.alloc(1), 0, 1, 102400 - 1);
  fs.closeSync(file);
  // Retrieve the folders' size
  let size = await getFolderSize(TEST_PATH, "MB")
  // Folder size should be 100 MB
  expect(size).toBe(100)
});

// TODO, test access (writable or not)
test("Test if isReacheable() return false if the drive is not accessible", () => {
  // Try to access unreachable drive
  const resultFalse = isReacheable(UNREACHABLE_PATH);
  expect(resultFalse).toBe(false);
});

// TODO --> test execute stuff
