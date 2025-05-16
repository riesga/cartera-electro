import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbonoSinConexionPage } from './abono-sin-conexion.page';

const routes: Routes = [
  {
    path: '',
    component: AbonoSinConexionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbonoSinConexionPageRoutingModule {}
