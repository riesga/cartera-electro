import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitasInmediatasPageRoutingModule } from './visitas-inmediatas-routing.module';

import { VisitasInmediatasPage } from './visitas-inmediatas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitasInmediatasPageRoutingModule
  ],
  declarations: [VisitasInmediatasPage]
})
export class VisitasInmediatasPageModule {}
