import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CobroInmediatoPageRoutingModule } from './cobro-inmediato-routing.module';

import { CobroInmediatoPage } from './cobro-inmediato.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CobroInmediatoPageRoutingModule
  ],
  declarations: [CobroInmediatoPage]
})
export class CobroInmediatoPageModule {}
