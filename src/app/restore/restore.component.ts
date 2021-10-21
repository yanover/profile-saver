import { Component, Input, OnInit } from "@angular/core";
import {
  faArrowRight,
  faCheck,
  faFolderOpen,
  faRocket,
  faThumbsUp,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ElectronService } from "ngx-electron";

@Component({
  selector: "app-restore",
  templateUrl: "./restore.component.html",
  styleUrls: ["./restore.component.scss"],
})
export class RestoreComponent implements OnInit {
  faFolderOpen = faFolderOpen;
  faArrowRight = faArrowRight;
  faRocket = faRocket;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  faThumbsUp = faThumbsUp;

  @Input() progress: number;
  @Input() total: number;

  progressVisibility: boolean;
  progressMessage: string;
  progressError: boolean;

  color: string;
  saveLoaded: boolean;
  lastSaveInfo: string;

  options: {
    annuaire: { isSelected: boolean; isSaved: boolean };
  };

  itemToRestore: {
    desktop: boolean;
    printers: boolean;
    signatures: boolean;
    taskbar: boolean;
  };

  constructor(private _electronService: ElectronService) {}

  ngOnInit(): void {
    this.saveLoaded = false;
    this.options = { annuaire: { isSelected: true, isSaved: false } };
    this.itemToRestore = {
      desktop: false,
      printers: false,
      signatures: false,
      taskbar: false,
    };
    this.progressMessage = "";
    this.progressVisibility = false;
    this.progressError = false;
    this.lastSaveInfo = "Fichier info.txt introuvable";
    this.getSave();
  }

  async setProgressMessage(text: string) {
    this.progressMessage = text;
  }

  async process() {
    this.progress = 0;
    let parameters: number = this.getItemLength() + this.getOptionLength();

    if (parameters > 0) {
      // Init progressBar increment
      let progressIncrement: number = 100 / parameters;

      // Enable progressBar
      this.progressVisibility = true;

      // Loop over each item
      for (let key in this.itemToRestore) {
        this.progressError = false;
        if (this.itemToRestore[key]) {
          // Refresh progressBar message
          this.progressError = false;
          this.setProgressMessage(
            `Restoring ${key.charAt(0).toUpperCase() + key.slice(1)}`
          );
          try {
            // Restore process
            await this._electronService.ipcRenderer.invoke(`restore-${key}`);
          } catch (err) {
            // Error occured backend side
            this.progressError = true;
            this.setProgressMessage(err.toString().split(":")[3]);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          } finally {
            // Update progress
            this.progress = this.progress + progressIncrement;
          }
        }
      }

      // Loop over each options
      for (let key in this.options) {
        if (this.options[key].isSelected) {
          // Refresh progressBar message
          this.setProgressMessage(
            `Saving ${key.charAt(0).toUpperCase() + key.slice(1)}`
          );
          // Save process
          //await this._electronService.ipcRenderer.invoke(`restore-${key}`);
          // Update progress
          this.progress = this.progress + progressIncrement;
          // Change option's state
          this.options[key].isSaved = true;
        }
      }
    }

    // Set final message
    this.setProgressMessage("Work done !");

    // End process
    setTimeout(() => {
      for (let key in this.options) {
        this.options[key].isSaved = false;
      }
      this.progressVisibility = false;
    }, 1500);
  }

  async getSave(): Promise<boolean> {
    let result: boolean = false;

    try {
      this.itemToRestore = await this._electronService.ipcRenderer.invoke(
        "restore",
        this.options
      );

      let check: boolean = false;
      Object.keys(this.itemToRestore).forEach((key) => {
        if (this.itemToRestore[key]) {
          check = true;
        }
      });

      if (check) {
        // Get information date
        this.lastSaveInfo = await this._electronService.ipcRenderer.invoke(
          "get-save",
          this.options
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.saveLoaded = true;
      return result;
    }
  }

  toggleOption(key: string): void {
    this.options[key].isSelected = !this.options[key].isSelected;
  }

  getOption(key: string, field: string): boolean {
    return this.options[key][field];
  }

  getOptionLength(): number {
    let count: number = 0;
    for (let key in this.options) {
      this.options[key].isSelected ? (count = count + 1) : null;
    }
    return count;
  }

  getItem(key: string): boolean {
    return this.itemToRestore[key];
  }

  getItemLength(): number {
    let count: number = 0;
    for (let key in this.itemToRestore) {
      this.itemToRestore[key] ? (count = count + 1) : null;
    }
    return count;
  }
}
