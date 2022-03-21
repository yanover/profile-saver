import { Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG } from "../environments/environment";
import { faCog, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { DataService } from "./shared/services/data.service";
import { IFolderInfo } from "./shared/models/IFolderInfo";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  faCog = faCog;
  faQuestionCircle = faQuestionCircle;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private dataService: DataService,
    private _electronService: ElectronService
  ) {
    // To remove
    this.translate.setDefaultLang("en");
    // console.log("APP_CONFIG", APP_CONFIG);

    // Get default directory and info concerning it
    this._electronService.ipcRenderer
      .invoke(`get-default-location`)
      .then((result) => {
        if (result) {
          this.dataService.setDestinationInfo(result)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  openDialog() {
    this.electronService.ipcRenderer.send("get-info");
  }
}
