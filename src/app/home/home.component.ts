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
    this.subscription = this.dataService.getComputerInfo().subscribe(async (computerInfo: IComputerInfo) => {
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
    this.info.loaded = true;
    // Update subject
    this.dataService.setComputerInfo(this.info);
  }

  resetInfo(): void {
    this.info = {
      username: "",
      architecture: "",
      homedir: "",
      os: "",
      version: "",
      memory: 0,
      loaded: false,
      storage: {
        desktop: { data: 0, unit: "" },
        documents: { data: 0, unit: "" },
        downloads: { data: 0, unit: "" },
        total: { data: 0, unit: "" },
      },
    };
  }
}
