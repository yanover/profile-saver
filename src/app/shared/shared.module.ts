import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { WebviewDirective } from "./directives/";

// Components
import { LoadingComponent } from "./components/";
import { LoadingDotComponent } from "./components/";

// Services
import { DataService } from "./services/data.service";
import { ByteConvertorPipe } from "./pipe/byte-convertor.pipe";

@NgModule({
  declarations: [WebviewDirective, LoadingComponent, LoadingDotComponent, ByteConvertorPipe],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, FontAwesomeModule, LoadingComponent, LoadingDotComponent, ByteConvertorPipe],
  providers: [DataService],
})
export class SharedModule {}
