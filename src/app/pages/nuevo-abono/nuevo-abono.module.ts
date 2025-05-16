import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuevoAbonoPageRoutingModule } from './nuevo-abono-routing.module';

import { NuevoAbonoPage } from './nuevo-abono.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NuevoAbonoPageRoutingModule
  ],
  declarations: [NuevoAbonoPage]
})
export class NuevoAbonoPageModule {}
