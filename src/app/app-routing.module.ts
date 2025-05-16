import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
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
  {
    path: 'nuevo-abono/:id',
    loadChildren: () => import('./pages/nuevo-abono/nuevo-abono.module').then( m => m.NuevoAbonoPageModule)
  },
  {
    path: 'posponer/:id',
    loadChildren: () => import('./pages/posponer/posponer.module').then( m => m.PosponerPageModule)
  },
  {
    path: 'historal-gestiones/:id',
    loadChildren: () => import('./pages/historal-gestiones/historal-gestiones.module').then( m => m.HistoralGestionesPageModule)
  },
  {
    path: 'abonos-sin-conexion',
    loadChildren: () => import('./pages/lista-abonos-sin-conexion/lista-abonos-sin-conexion.module').then( m => m.ListaAbonosSinConexionPageModule)
  },
  {
    path: 'rutacobro',
    loadChildren: () => import('./pages/rutacobro/rutacobro.module').then( m => m.RutacobroPageModule)
  },
  {
    path: 'abono-sin-conexion/:id',
    loadChildren: () => import('./pages/abono-sin-conexion/abono-sin-conexion.module').then( m => m.AbonoSinConexionPageModule)
  },
  {
    path: 'ruta-sin-conexion',
    loadChildren: () => import('./pages/ruta-sin-conexion/ruta-sin-conexion.module').then( m => m.RutaSinConexionPageModule)
  },
  {
    path: 'recibo-temporal/:id',
    loadChildren: () => import('./pages/recibo-temporal/recibo-temporal.module').then( m => m.ReciboTemporalPageModule)
  },
  {
    path: 'relacion-cobros',
    loadChildren: () => import('./pages/relacion-cobros/relacion-cobros.module').then( m => m.RelacionCobrosPageModule)
  },
  {
    path: 'cobro-inmediato',
    loadChildren: () => import('./pages/cobro-inmediato/cobro-inmediato.module').then( m => m.CobroInmediatoPageModule)
  },
  {
    path: 'visitas-inmediatas',
    loadChildren: () => import('./pages/visitas-inmediatas/visitas-inmediatas.module').then( m => m.VisitasInmediatasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
