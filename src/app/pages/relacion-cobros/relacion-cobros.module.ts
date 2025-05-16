import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RelacionCobrosPageRoutingModule } from './relacion-cobros-routing.module';
import { RelacionCobrosPage } from './relacion-cobros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelacionCobrosPageRoutingModule
  ],
  declarations: [RelacionCobrosPage],
  providers: [
  ],
})
export class RelacionCobrosPageModule {}
