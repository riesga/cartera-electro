import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReciboTemporalPageRoutingModule } from './recibo-temporal-routing.module';
import { ReciboTemporalPage } from './recibo-temporal.page';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReciboTemporalPageRoutingModule
  ],
  declarations: [ReciboTemporalPage],
  providers: [    
    DatePipe
  ]
})
export class ReciboTemporalPageModule {}
