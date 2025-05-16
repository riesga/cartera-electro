import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoralGestionesPage } from './historal-gestiones.page';

const routes: Routes = [
  {
    path: '',
    component: HistoralGestionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoralGestionesPageRoutingModule {}
