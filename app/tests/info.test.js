const { retrieveInfo } = require("../lib/info");
const os = require("os");
const { ByteConvertor } = require("../services/converter-service");
const convertor = new ByteConvertor();

test("Test retrieveInfo() function", async () => {
    // Retrieve data from function
    let data = await retrieveInfo();
    // Build test data
    let expected = {
        username: os.userInfo().username,
        version: os.version(),
        version: os.release(),
        memory: convertor.convert(os.totalmem(), "B", "GB").data,
        architecture: os.arch()
    }
    // Test data
    expect(data).toBeDefined();
    expect(data).toMatchObject(expected)
});