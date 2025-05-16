import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosponerPage } from './posponer.page';

const routes: Routes = [
  {
    path: '',
    component: PosponerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosponerPageRoutingModule {}
