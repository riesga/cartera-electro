import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoAbonoPage } from './nuevo-abono.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoAbonoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoAbonoPageRoutingModule {}
