import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RestoreComponent } from './restore.component';

const routes: Routes = [
  {
    path: 'restore',
    component: RestoreComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestoreRoutingModule { }
