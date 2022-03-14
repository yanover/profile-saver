import { Component, OnDestroy, OnInit } from "@angular/core";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import { ElectronService } from "ngx-electron";
import { Subscription } from "rxjs";
import { IComputerInfo } from "../shared/models/IComputerInfo";
import { DataService } from "../shared/services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  faTools = faTools;

  info: IComputerInfo;
  subscription: Subscription;

  constructor(private _electronService: ElectronService, private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.getData().subscribe(async (computerInfo: IComputerInfo) => {
      if (computerInfo == undefined) {
        this.resetInfo();
        await this.process();
      } else {
        this.info = computerInfo;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async process(): Promise<void> {
    // Retrieve informations
    this.info = await this._electronService.ipcRenderer.invoke("retrieve-info");
    this.info.storage = await this._electronService.ipcRenderer.invoke("retrieve-storage");
    // Process total storage
    this.calcTotal();
    this.info.loaded = true;
    // Update subject
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
    console.log("CREATE EMPTY SHIT");
    this.info = {
      username: "",
      architecture: "",
      homedir: "",
      os: "",
      version: "",
      memory: 0,
      loaded: false,
      storage: {
        desktop: 0,
        documents: 0,
        downloads: 0,
        total: 0,
      },
    };
    console.log(this.info);
  }
}
