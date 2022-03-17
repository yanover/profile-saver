import { Component, OnInit } from "@angular/core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ElectronService } from "ngx-electron";
import { IFolderInfo } from "../shared/models/IFolderInfo";
import { DataService } from "../shared/services/data.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  faArrowLeft = faArrowLeft;

  defaultLocation: IFolderInfo;

  constructor(private _electronService: ElectronService, private dataService: DataService) {}

  ngOnInit(): void {
    this.loadCurrentDirectory();
  }

  loadCurrentDirectory() {
    this.dataService.getDestinationInfo().subscribe((result) => {
      this.defaultLocation = result;
    });
  }

  async setDefaultDirectory() {
    this._electronService.ipcRenderer
      .invoke("set-default-location")
      .then(() => {
        this._electronService.ipcRenderer.invoke("get-default-location").then((data) => {
          this.dataService.setDestinationInfo(data as IFolderInfo);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
