import os = require("os");
import { IComputerInfo } from "../models/IComputerInfo";
import { IStorageValue } from "../models/IStorageValue";
import { ByteConvertor } from "../services/converter-service";

const fastFolderSize = require("fast-folder-size");
const convertor = new ByteConvertor();

let info: IComputerInfo;

// Initialize default object
info = {} as IComputerInfo;
info.storage = { desktop: 0, documents: 0, downloads: 0, total: { data: 0, unit: "" } };

export async function retrieveInfo() {
  // Get general informations
  info.username = os.userInfo().username;
  info.os = os.version();
  info.version = os.release();
  info.memory = convertor.convert(os.totalmem(), "b", "gb").data;
  info.architecture = os.arch();

  // Get storage informations
  return info;
}

export async function retrieveStorage(): Promise<any> {
  info.homedir = os.userInfo().homedir;

  let promises = new Array<Promise<any>>();

  for (let key in info.storage) {
    promises.push(
      new Promise((resolve, reject) => {
        fastFolderSize(`${info.homedir}\\${key}`, (err: any, bytes: number) => {
          info.storage[key] = convertor.convert(bytes, "B", "MB");
          resolve(1);
        });
      })
    );
  }

  return Promise.all(promises).then((result) => {
    if (result) {
      // Get total
      info.storage.total.data = 0;
      for (let key in info.storage) {
        if (key != "total") {
          info.storage.total.data = info.storage.total.data + info.storage[key].data;
        }
      }
      // Minimize to GB if > 1024 MB
      if (info.storage.total.data) info.storage.total = convertor.convert(info.storage.total.data, "MB", "GB");
      return info.storage;
    }
  });
}
