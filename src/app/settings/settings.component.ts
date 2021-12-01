import { Component, OnInit } from "@angular/core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ElectronService } from "ngx-electron";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  defaultLocation: string;

  constructor(private _electronService: ElectronService) {}

  ngOnInit(): void {
    this.loadCurrentDirectory();
  }

  loadCurrentDirectory() {
    this._electronService.ipcRenderer.invoke(`get-default-location`).then((result) => {
      if (result) {
        this.defaultLocation = result;
      }
    });
  }

  async setDefaultDirectory() {
    this._electronService.ipcRenderer
      .invoke("set-default-location")
      .then(() => {
        this.loadCurrentDirectory();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
