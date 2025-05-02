import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleReciboPage } from './detalle-recibo.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleReciboPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleReciboPageRoutingModule {}
