import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReciboTemporalPage } from './recibo-temporal.page';

const routes: Routes = [
  {
    path: '',
    component: ReciboTemporalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReciboTemporalPageRoutingModule {}
