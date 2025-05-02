import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleReciboPageRoutingModule } from './detalle-recibo-routing.module';
import { DetalleReciboPage } from './detalle-recibo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleReciboPageRoutingModule
  ],
  declarations: [DetalleReciboPage],
  providers: [DatePipe]
})
export class DetalleReciboPageModule {}
