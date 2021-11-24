const APPLICATION = require("spectron").Application;
const PATH = require("path");

let electronPath = PATH.join(__dirname, "../node_modules", ".bin", "electron");
const appPath = PATH.join(__dirname, "../dist");

if (process.platform === "win32") {
  electronPath += ".cmd";
}

export default function setup(): void {
  beforeEach(async function () {
    this.app = new APPLICATION({
      path: electronPath,
      args: [appPath],
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true,
        NODE_ENV: "development",
      },
      startTimeout: 20000,
      chromeDriverLogPath: "../chromedriverlog.txt",
    });

    await this.app.start();
  });

  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }
  });
}
