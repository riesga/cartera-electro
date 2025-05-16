import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutacobroPageRoutingModule } from './rutacobro-routing.module';

import { RutacobroPage } from './rutacobro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutacobroPageRoutingModule
  ],
  declarations: [RutacobroPage]
})
export class RutacobroPageModule {}
