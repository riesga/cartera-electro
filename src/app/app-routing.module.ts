import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'creditos',
    loadChildren: () => import('./pages/creditos/creditos.module').then( m => m.CreditosPageModule)
  },
  {
    path: 'creditos/:id',
    loadChildren: () => import('./pages/creditos/creditos.module').then( m => m.CreditosPageModule)
  },
  {
    path: 'abonos/:id',
    loadChildren: () => import('./pages/abonos/abonos.module').then( m => m.AbonosPageModule)
  },
  {
    path: 'recibos/:id',
    loadChildren: () => import('./pages/recibos/recibos.module').then( m => m.RecibosPageModule)
  },
  {
    path: 'detalle-recibo/:id/:product',
    loadChildren: () => import('./pages/detalle-recibo/detalle-recibo.module').then( m => m.DetalleReciboPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
