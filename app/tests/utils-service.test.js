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

// TODO, test access (writable or not)
test("Test if isReacheable() return false if the drive is not accessible", () => {
  // Try to access unreachable drive
  const resultFalse = isReacheable(UNREACHABLE_PATH);
  expect(resultFalse).toBe(false);
});


// TODO --> test execute stuff
