import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PosponerPageRoutingModule } from './posponer-routing.module';

import { PosponerPage } from './posponer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PosponerPageRoutingModule
  ],
  declarations: [PosponerPage]
})
export class PosponerPageModule {}
