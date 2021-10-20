import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgProgressModule } from 'ngx-progressbar';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingDotComponent } from './components/loading-dot/loading-dot.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, LoadingComponent, LoadingDotComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, FontAwesomeModule, NgProgressModule, LoadingComponent, LoadingDotComponent]
})
export class SharedModule { }
