const { retrieveInfo } = require("../lib/info");
const os = require("os");

test("Test retrieveInfo() function", async () => {
    // Retrieve data from function
    let data = await retrieveInfo();
    // Build test data
    let expected = {
        username: os.userInfo().username,
        version: os.version(),
        version: os.release(),
        memory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
        architecture: os.arch()
    }
    // Test data
    expect(data).toBeDefined();
    expect(data).toMatchObject(expected)
});