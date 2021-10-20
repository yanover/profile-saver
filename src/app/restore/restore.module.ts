import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RestoreRoutingModule } from './restore-routing.module';
import { RestoreComponent } from './restore.component';

@NgModule({
  declarations: [RestoreComponent],
  imports: [CommonModule, SharedModule, RestoreRoutingModule]
})
export class RestoreModule { }
