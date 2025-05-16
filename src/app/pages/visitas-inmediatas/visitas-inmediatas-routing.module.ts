import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitasInmediatasPage } from './visitas-inmediatas.page';

const routes: Routes = [
  {
    path: '',
    component: VisitasInmediatasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitasInmediatasPageRoutingModule {}
