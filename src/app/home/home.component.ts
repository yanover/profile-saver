import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ElectronService } from "ngx-electron";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  info: {
    username: string;
    os: string;
    version: string;
    homedir: string;
    architecture: string;
    memory: number;
    loaded: boolean;
    storage: {
      desktop: number;
      downloads: number;
      documents: number;
      total: number;
    };
  };

  constructor(private _electronService: ElectronService) {}

  ngOnInit(): void {
    this.info = {
      username: "",
      os: "",
      version: "",
      homedir: "",
      architecture: "",
      memory: 0,
      loaded: false,
      storage: { desktop: 0, downloads: 0, documents: 0, total: 0 },
    };
    this.process();
  }

  async process() {
    this.info = await this._electronService.ipcRenderer.invoke("retrieve-info");
    this.info.storage = await this._electronService.ipcRenderer.invoke(
      "retrieve-storage"
    );
    this.calcTotal();
    this.info.loaded = true;
  }

  calcTotal() {
    this.info.storage.total = 0;
    for (let key in this.info.storage) {
      if (key != "total") {
        this.info.storage.total = +(
          (Math.round(this.info.storage.total + this.info.storage[key]) * 100) /
          100
        );
      }
    }
  }
}
