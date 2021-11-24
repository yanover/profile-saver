import { expect } from "chai";
import { SpectronClient } from "spectron";

import commonSetup from "./common-setup";
import saveSetup from "./save-setup";

describe("profil-saver App", function () {
  commonSetup.apply(this);

  let client: SpectronClient;

  beforeEach(function () {
    client = this.app.client;
  });

  it("creates initial windows", async function () {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });
});

describe("profil-saver save", function () {
  saveSetup.apply(this);

  let client: SpectronClient;

  beforeEach(function () {
    client = this.app.client;
  });

  it("creates initial windows", async function () {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });
});
