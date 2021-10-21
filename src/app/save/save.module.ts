import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/shared.module";
import { SaveComponent } from "./save.component";
import { SaveRoutingModule } from "./save-routing.module";

@NgModule({
  declarations: [SaveComponent],
  imports: [CommonModule, SharedModule, SaveRoutingModule],
})
export class SaveModule {}
