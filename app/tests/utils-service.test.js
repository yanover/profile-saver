const { isReacheable, isEmpty, deleteFolderRecursive } = require("../services/utils-service");
const fs = require("fs-extra");
const path = require('path');
const { randomUUID } = require("crypto");

// Static variables
const TEST_PATH = path.join(__dirname, `_testFolder__${randomUUID()}`)
const UNREACHABLE_PATH = "I'm an unreacheable path";


beforeAll(() => {
  // Create test folder
  fs.mkdirSync(TEST_PATH);
});

afterAll(() => {
  try {
    // Remove test folder at the end
    fs.rmdirSync(TEST_PATH)
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

test("Test if deleteFolderRecursive() works", async () => {
  // Create folders & files tree 
  const folders = ["content", "config", "public"];
  const files = ["test.txt", "config.inc", "index.html"]

  folders.forEach((folder, idx) => {
    fs.mkdirSync(`${TEST_PATH}\\${folder}`)
    fs.createFileSync(`${TEST_PATH}\\${folder}\\${files[idx]}`)
  })

  // remove folder
  deleteFolderRecursive(TEST_PATH)

  // Check if folder still exist
  const result = fs.existsSync(TEST_PATH);
  expect(result).toBe(false);
})

test("Test if deleteFolderRecursive() throw an error in case of unreachable folder", async () => {
  expect(() => { deleteFolderRecursive(UNREACHABLE_PATH) }).toThrow(`An error occured while trying to remove ${UNREACHABLE_PATH} recusively`);
})

// TODO, test access (writable or not)
test("Test if isReacheable() return false if the drive is not accessible", () => {
  // Try to access unreachable drive
  const resultFalse = isReacheable(UNREACHABLE_PATH);
  expect(resultFalse).toBe(false);
});


// TODO --> test execute stuff
