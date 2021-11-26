const { isReacheable, isEmpty } = require("../services/utils-service");
const fs = require("fs-extra");
const path = require('path');
const { randomUUID } = require("crypto");

// Test folder path
const TEST_PATH = path.join(__dirname, `XX_${randomUUID()}_testFolder_`)

beforeAll(() => {
  // Create test folder
  fs.mkdirSync(TEST_PATH);
});

// TODO, test access (writable or not)
test("Test if test drive is reacheable", () => {
  const d = TEST_PATH;
  const resultTrue = isReacheable(d);
  expect(resultTrue).toBe(true);
});

test("Test if test drive is empty", () => {
  const d = TEST_PATH;
  const resultTrue = isEmpty(d);
  // This folder should be empty to validate the test
  expect(resultTrue).toBe(true);
});

// TODO, test access (writable or not)
test("Test if local drive is unreacheable", () => {
  fs.rmdirSync(TEST_PATH);
  // Test access again
  const d = TEST_PATH
  const resultFalse = isReacheable(d);
  // Folder has been deleted, it should not be reacheable
  expect(resultFalse).toBe(false);
});


