import { Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG } from "../environments/environment";
import { faCog, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  faCog = faCog;
  faQuestionCircle = faQuestionCircle;

  constructor(private electronService: ElectronService, private translate: TranslateService) {
    this.translate.setDefaultLang("en");
    console.log("APP_CONFIG", APP_CONFIG);

    /* if (electronService.isElectron) {
      console.log(process.env);
      console.log("Run in electron");
      console.log("Electron ipcRenderer", this.electronService.ipcRenderer);
      console.log("NodeJS childProcess", this.electronService.childProcess);
    } else {
      console.log("Run in browser");
    } */
  }

  openDialog() {
    this.electronService.ipcRenderer.send("get-info");
  }
}
