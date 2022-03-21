import { IStorageValue } from "./IStorageValue";

export interface IComputerInfo {
  username: string;
  os: string;
  version: string;
  homedir: string;
  architecture: string;
  memory: number;
  loaded: boolean;
  storage: {
    desktop: IStorageValue;
    downloads: IStorageValue;
    documents: IStorageValue;
    total: IStorageValue;
  };
}
