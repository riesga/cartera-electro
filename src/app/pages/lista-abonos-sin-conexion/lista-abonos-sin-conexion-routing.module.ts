import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaAbonosSinConexionPage } from './lista-abonos-sin-conexion.page';

const routes: Routes = [
  {
    path: '',
    component: ListaAbonosSinConexionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaAbonosSinConexionPageRoutingModule {}
