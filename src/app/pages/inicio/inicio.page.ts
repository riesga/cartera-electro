import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Observable } from 'rxjs';
import { ClientesService, SearchType } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Browser } from '@capacitor/browser';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})

export class InicioPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  userName = '';
  totales: Observable<any> | undefined;
  searchTerm: string = '';
  type: SearchType = SearchType.id_cobrador;
  resultCobros: any;
  resultVisitas: any;
  isDarkMode: boolean = false;

  constructor(
    private userData: UserDataService,
    private servicios: ClientesService,
    private UserService: UserDataService,
    private themeService: ThemeService,
    private alertController: AlertController
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() { 
     this.userName = this.userData.getUsername(); 
     this.totales = this.servicios.searchTotalRutaCobros(this.UserService.getUserId());
     this.resultCobros = this.servicios.searchCobrosInmediatos(this.UserService.getUserId());
     this.resultVisitas = this.servicios.searchVisitarInmediatos(this.UserService.getUserId());
     console.log("ete", this.resultCobros);
     console.log(this.resultVisitas);
  }


  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

  async openContacto() {
    const alert = await this.alertController.create({
      header: 'Contacto',
      message: '¿Desea llamar a servicio al cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Llamar',
          handler: () => {
            // Abre el marcador telefónico con el número de soporte
            window.open('tel:8853277', '_system');
          }
        }
      ]
    });

    await alert.present();
  }

  async openWhatsapp() {
    // Número de WhatsApp de soporte con código de país
    const phoneNumber = '573003517555'; // Reemplaza con el número real
    const message = 'Hola, necesito ayuda con la app de Electromuebles.';
    
    // URL para abrir WhatsApp con número y mensaje predefinido
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp usando Capacitor Browser
    await Browser.open({ url: whatsappUrl });
  }
}
