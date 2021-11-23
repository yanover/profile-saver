import { Component, OnDestroy, OnInit } from "@angular/core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { ElectronService } from "ngx-electron";
import { Observable, Subscription } from "rxjs";
import { IComputerInfo } from "../shared/models/IComputerInfo";
import { DataService } from "../shared/services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  faSync = faSync;

  info: IComputerInfo;
  subscription: Subscription;

  constructor(private _electronService: ElectronService, private dataService: DataService) {}

  ngOnInit(): void {
    this.resetInfo();

    this.subscription = this.dataService.getData().subscribe(async (computerInfo: IComputerInfo) => {
      this.info = computerInfo;
      if (computerInfo == undefined) {
        console.log("Subject is empty");
        await this.process();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async process(): Promise<void> {
    this.info = await this._electronService.ipcRenderer.invoke("retrieve-info");
    this.info.storage = await this._electronService.ipcRenderer.invoke("retrieve-storage");
    this.calcTotal();
    this.info.loaded = true;
    this.dataService.setData(this.info);
  }

  calcTotal(): void {
    this.info.storage.total = 0;
    for (let key in this.info.storage) {
      if (key != "total") {
        this.info.storage.total = +((Math.round(this.info.storage.total + this.info.storage[key]) * 100) / 100);
      }
    }
  }

  resetInfo(): void {
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
  }
}
