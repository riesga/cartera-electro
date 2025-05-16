import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoralGestionesPageRoutingModule } from './historal-gestiones-routing.module';

import { HistoralGestionesPage } from './historal-gestiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoralGestionesPageRoutingModule
  ],
  declarations: [HistoralGestionesPage]
})
export class HistoralGestionesPageModule {}
