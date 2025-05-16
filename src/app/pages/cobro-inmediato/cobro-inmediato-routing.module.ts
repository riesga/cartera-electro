import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobroInmediatoPage } from './cobro-inmediato.page';

const routes: Routes = [
  {
    path: '',
    component: CobroInmediatoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobroInmediatoPageRoutingModule {}
