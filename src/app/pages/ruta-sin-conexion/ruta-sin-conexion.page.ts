import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';
import { RutaSinConexion } from 'src/app/interfaces/ruta-sin-conexion';
import { AlertController, NavController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-ruta-sin-conexion',
  templateUrl: './ruta-sin-conexion.page.html',
  styleUrls: ['./ruta-sin-conexion.page.scss'],
  standalone: false
})
export class RutaSinConexionPage implements OnInit {
  results: RutaSinConexion[] = [];
  fechaRuta = new Date();
  isDarkMode: boolean = false;

  constructor(route: ActivatedRoute,    
    public router: Router,
    private alertController: AlertController,
    public navController: NavController,
    private themeService: ThemeService) 
    {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
    route.params.subscribe(val => { 
      const rutaCobrosData = localStorage.getItem('Rutacobros');
      this.results = rutaCobrosData ? JSON.parse(rutaCobrosData) : [];  
      if(this.results)
      {
        const fechaDescargaRutaCobros = localStorage.getItem('fechaDescargaRutaCobros');
        this.fechaRuta = fechaDescargaRutaCobros ? new Date(fechaDescargaRutaCobros) : new Date();
        var fechaRutaSinTiempo = new Date(this.fechaRuta);
        fechaRutaSinTiempo.setHours(0,0,0,0);
        var hoy = new Date();
        hoy.setHours(0,0,0,0);
        
        if(hoy.getTime() > fechaRutaSinTiempo.getTime())
        {
          this.AlertarFecha();
        }
      }
  });

   }

  ngOnInit() {
  }
  
  async AlertarFecha() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'Debe descargar nuevamente la ruta de cobro',
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          this.router.navigate(['/rutacobro'])
        }
      }]
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
