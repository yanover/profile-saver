import { Component, Input, OnInit } from "@angular/core";
import { ElectronService } from "ngx-electron";
import {
  faThumbsUp,
  faArrowLeft,
  faCheck,
  faFolderOpen,
  faRocket,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-save",
  templateUrl: "./save.component.html",
  styleUrls: ["./save.component.scss"],
})
export class SaveComponent implements OnInit {
  faFolderOpen = faFolderOpen;
  faArrowLeft = faArrowLeft;
  faRocket = faRocket;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;
  faThumbsUp = faThumbsUp;

  @Input() progress: number;
  @Input() total: number;

  progressVisibility: boolean;
  progressMessage: string;
  progressError: string | boolean;
  color: string;

  options: {
    desktop: {
      description: string;
      isSelected: boolean;
      isSaved: boolean;
    };
    printers: {
      description: string;
      isSelected: boolean;
      isSaved: boolean;
    };
    signature: {
      description: string;
      isSelected: boolean;
      isSaved: boolean;
    };
    taskbar: {
      description: string;
      isSelected: boolean;
      isSaved: boolean;
    };
    browser: {
      description: string;
      isSelected: boolean;
      isSaved: boolean;
    };
  };

  constructor(private _electronService: ElectronService) {}

  ngOnInit(): void {
    this.options = {
      desktop: { description: "Bureau", isSaved: false, isSelected: true },
      taskbar: { description: "Barre des tâches", isSaved: false, isSelected: true },
      signature: { description: "Signature(s) Outlook", isSaved: false, isSelected: true },
      printers: { description: "Imprimantes réseaux", isSaved: false, isSelected: true },
      browser: { description: "Navigateur (Edge)", isSaved: false, isSelected: true },
    };
    this.progressMessage = "";
    this.progressError = false;
    this.progressVisibility = false;
    //if we don't have progress, set it to 0.
    if (!this.progress) {
      this.progress = 0;
    }
    //if we don't have a total aka no requirement, it's 100%.
    if (this.total === 0) {
      this.total = this.progress;
    } else if (!this.total) {
      this.total = 100;
    }
    //if the progress is greater than the total, it's also 100%.
    if (this.progress > this.total) {
      this.progress = 100;
      this.total = 100;
    }
  }

  setProgressMessage(text: string) {
    this.progressMessage = text;
  }

  async process() {
    this.progress = 0;
    let parameters: number = this.getOptionLength();

    if (parameters > 0) {
      // Check if save already exist and create file info
      if (await this._electronService.ipcRenderer.invoke(`save`)) {
        // Init progressBar increment
        let progressIncrement: number = 100 / parameters;

        // Enable progressBar
        this.progressVisibility = true;

        // Loop over each item
        for (let key in this.options) {
          if (this.options[key].isSelected) {
            // Refresh progressBar message
            this.setProgressMessage(`Saving ${key.charAt(0).toUpperCase() + key.slice(1)}`);
            try {
              // Save process
              await this._electronService.ipcRenderer.invoke(`save-${key}`);
              // Change option's state
              this.options[key].isSaved = true;
            } catch (err) {
              // Error occured backend side
              if (err.toString().indexOf("WarningException") >= 0) {
                this.progressError = "warning";
                this.setProgressMessage(err.toString().split(":")[4]);
              } else {
                this.progressError = true;
                this.setProgressMessage(err.toString().split(":")[3]);
              }
              // Wait 3 secondes
              await new Promise((resolve) => setTimeout(resolve, 3000));
              // Jump to next iteration
              continue;
            } finally {
              // Update progress
              this.progress = this.progress + progressIncrement;
              // Set progressError to default value
              this.progressError = false;
            }
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

  getProgressErrorColor(): string {
    if (!this.progressError) {
      // No error
      return "#363636";
    } else if (this.progressError == "warning") {
      // Warning exception
      return "#ffb300";
    } else {
      // All errors
      return "#d84315";
    }
  }
}
