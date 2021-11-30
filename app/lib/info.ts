import os = require("os");

const fastFolderSize = require("fast-folder-size");

let info: {
  username: string;
  os: string;
  version: string;
  homedir: string;
  architecture: string;
  memory: number;
  storage: {
    desktop: number;
    downloads: number;
    documents: number;
  };
};

export async function retrieveInfo() {
  info = {
    username: "",
    os: "",
    version: "",
    homedir: "",
    architecture: "",
    memory: 0,
    storage: { desktop: 0, downloads: 0, documents: 0 },
  };

  // Get general informations
  info.username = os.userInfo().username;
  info.os = os.version();
  info.version = os.release();
  info.memory = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  info.architecture = os.arch();

  // Get storage informations
  return info;
}

export function retrieveStorage(): Promise<any> {
  info = {
    username: "",
    os: "",
    version: "",
    homedir: "",
    architecture: "",
    memory: 0,
    storage: { desktop: 0, downloads: 0, documents: 0 },
  };

  info.homedir = os.userInfo().homedir;

  let promises = new Array<Promise<any>>();

  for (let key in info.storage) {
    /* console.log(`Checking size of : ${info.homedir}\\${key}`); */
    promises.push(
      new Promise((resolve, reject) => {
        fastFolderSize(`${info.homedir}\\${key}`, (err: any, bytes: number) => {
          info.storage[key] = Math.round((bytes / 1024 / 1024) * 100) / 100;
          resolve(1);
        });
      })
    );
  }

  return Promise.all(promises).then((result) => {
    if (result) {
      return info.storage;
    }
  });
}
