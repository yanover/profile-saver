import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG } from "../environments/environment";
import { slider } from "./common/animations/route-animation";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  animations: [slider],
})
export class AppComponent {
  constructor(private electronService: ElectronService, private translate: TranslateService) {
    this.translate.setDefaultLang("en");
    console.log("APP_CONFIG", APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log("Run in electron");
      console.log("Electron ipcRenderer", this.electronService.ipcRenderer);
      console.log("NodeJS childProcess", this.electronService.childProcess);
    } else {
      console.log("Run in browser");
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet);

    let o = outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
    return o;
  }
}
