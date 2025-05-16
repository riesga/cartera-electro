import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaSinConexionPage } from './ruta-sin-conexion.page';

const routes: Routes = [
  {
    path: '',
    component: RutaSinConexionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaSinConexionPageRoutingModule {}
