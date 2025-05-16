import { Component, OnInit } from '@angular/core';
import { AbonoSinConexion } from '../../interfaces/abono-sin-conexion';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ClientesService } from './../../services/clientes.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-lista-abonos-sin-conexion',
  templateUrl: './lista-abonos-sin-conexion.page.html',
  styleUrls: ['./lista-abonos-sin-conexion.page.scss'],
  standalone: false
})
export class ListaAbonosSinConexionPage implements OnInit {

  results: AbonoSinConexion[] = [];
  infoAlerta = '';
  isDarkMode: boolean = false;

  AbonoSinConexion: AbonoSinConexion = {
    codigo_credito: null,
    valor: 0,
    fecha_pago: new Date,
    id_usuario: null,
    rec_menbrete: null,
    latitud: 0,    // Añadiendo la propiedad latitud
    longitud: 0    // Añadiendo la propiedad longitud
  };

  constructor(route: ActivatedRoute,
    public loadingController: LoadingController,
    private clientesService: ClientesService,
    private alertController: AlertController,    
    public navController: NavController,
    private themeService: ThemeService,
    private router: Router,) {
    route.params.subscribe(val => {
      const abonosData = localStorage.getItem('abonos');
      this.results = abonosData ? JSON.parse(abonosData) : [];
    });
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.infoAlerta = ''
  }

  almacenarabonosSinconexion() {
    if (this.results != null) {
      this.results.forEach(element => {
        this.AbonoSinConexion.codigo_credito = element.codigo_credito
        this.AbonoSinConexion.fecha_pago = element.fecha_pago
        this.AbonoSinConexion.id_usuario = element.id_usuario
        this.AbonoSinConexion.valor = element.valor
        this.AbonoSinConexion.rec_menbrete = element.rec_menbrete
        this.AbonoSinConexion.latitud = element.latitud || 0    // Copiando la latitud
        this.AbonoSinConexion.longitud = element.longitud || 0  // Copiando la longitud

        this.clientesService.createAbonoSinConexion(this.AbonoSinConexion).pipe(catchError(err => {
          this.infoAlerta = 'Error de conexion';
          this.AlertaInformacion();
          return throwError(err);          
        })).subscribe(() => {
          localStorage.removeItem('abonos');
          this.infoAlerta = 'sincronizacion terminada';
          this.AlertaInformacion();
        });
      });

    }
    else {
      this.infoAlerta = 'No hay datos para sincronizar';
      this.AlertaInformacion();
    }
  }

  async AlertaInformacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ALERTA IMPORTANTE',
      message: this.infoAlerta,
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          this.router.navigate(['/inicio'])
        }
      },]
    });
    await alert.present();
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }
}
