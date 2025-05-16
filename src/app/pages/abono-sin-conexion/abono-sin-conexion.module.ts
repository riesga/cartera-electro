import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbonoSinConexionPageRoutingModule } from './abono-sin-conexion-routing.module';

import { AbonoSinConexionPage } from './abono-sin-conexion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AbonoSinConexionPageRoutingModule
  ],
  declarations: [AbonoSinConexionPage]
})
export class AbonoSinConexionPageModule {}
