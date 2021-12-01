import { Component, OnInit } from "@angular/core";
import { faArrowLeft, faFolder } from "@fortawesome/free-solid-svg-icons";
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
    this._electronService.ipcRenderer.invoke(`get-default-location`).then((result) => {
      if (result) {
        this.defaultLocation = result;
      }
    });
  }

  fileChangeEvent(event: any) {
    if (event.target.files.length > 0) {
      let files = event.target.files;

      for (var i = 0; i < files.length; ++i) {
        if (!(files[i].webkitRelativePath.split("/").length > 2)) {
          console.log(files[i]);
        }
      }
    }
  }
}
