import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelacionCobrosPage } from './relacion-cobros.page';

const routes: Routes = [
  {
    path: '',
    component: RelacionCobrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelacionCobrosPageRoutingModule {}
