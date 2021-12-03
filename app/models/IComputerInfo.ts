export interface IComputerInfo {
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
}
