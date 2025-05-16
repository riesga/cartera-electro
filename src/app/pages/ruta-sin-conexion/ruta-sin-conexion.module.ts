import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaSinConexionPageRoutingModule } from './ruta-sin-conexion-routing.module';

import { RutaSinConexionPage } from './ruta-sin-conexion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaSinConexionPageRoutingModule
  ],
  declarations: [RutaSinConexionPage]
})
export class RutaSinConexionPageModule {}
