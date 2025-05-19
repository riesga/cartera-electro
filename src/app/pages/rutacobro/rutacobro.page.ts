import { Component, OnInit } from '@angular/core';
import { ClientesService, SearchType } from './../../services/clientes.service';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute } from '@angular/router'
import { LoadingController } from '@ionic/angular';
import { RutaSinConexion } from '../../interfaces/ruta-sin-conexion';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';
import { OrdenarRuta } from 'src/app/interfaces/ordernar-ruta';


@Component({
  selector: 'app-rutacobro',
  templateUrl: './rutacobro.page.html',
  styleUrls: ['./rutacobro.page.scss'],
  standalone: false
})
export class RutacobroPage implements OnInit {

  results: any;
  searchTerm: string = '';
  type: SearchType = SearchType.id_cobrador;
  rutaDescargada: RutaSinConexion[] = [];
  isDarkMode: boolean = false;

  // Propiedad para controlar el estado del reordenamiento
  reorderEnabled: boolean = false;

  constructor(private RutaCobro: ClientesService,
    private UserService: UserDataService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    public navController: NavController,
    private themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(val => {
      this.presentLoading();
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando informacion...',

    });
    await loading.present();

    this.RutaCobro.searchRutaCobros(this.UserService.getUserId()).subscribe(data => {
      this.results = data;
      loading.dismiss();
    });
  }

  async AlertarDatosNoEncontrados() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'No hay datos para descargar',
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          this.router.navigate(['/inicio'])
        }
      },]
    });

    await alert.present();
  }

  async DescargaCulminada() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'Se ha descargado Correctamente la ruta de cobros',
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          this.router.navigate(['/ruta-sin-conexion'])
        }
      },]
    });

    await alert.present();
  }

  async AlertarRutaDescargada() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Informacion importante',
      message: 'Ya ha sido descargada una ruta anteriormente. ¿Desea Eliminarla?',
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          localStorage.removeItem('Rutacobros');
          localStorage.removeItem('fechaDescargaRutaCobros');
        }
      },]
    });

    await alert.present();
  }

  async Downloading() {
    const rutaCobrosData = localStorage.getItem('Rutacobros');
    this.rutaDescargada = rutaCobrosData ? JSON.parse(rutaCobrosData) : null;
    //const Ruta1 = await this.RutaCobro.searchRutaCobros(this.UserService.getUserId()).toPromise();
    if (this.results == '') {
      this.AlertarDatosNoEncontrados();
    }
    else 
    {
      if (this.rutaDescargada == null) 
      {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Descargando informacion...',
        });
        await loading.present();
        this.RutaCobro.searchRutaCobros(this.UserService.getUserId()).subscribe(data => {
          const Ruta = data;          
          this.addRutaLocalStorage(Ruta);
          loading.dismiss();
          this.DescargaCulminada();
        });
      }
      else 
      {
        this.AlertarRutaDescargada();
      }
    }
  }


  private addRutaLocalStorage(ruta: RutaSinConexion[]) {
    var date = new Date();
    localStorage.setItem('fechaDescargaRutaCobros', date.toISOString());
    localStorage.setItem('Rutacobros', JSON.stringify(ruta));
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

  /**
   * Manejador del evento de reordenamiento
   */
  handleReorder(ev: any) {
    // Finalizar el reordenamiento y actualizar el orden visual
    ev.detail.complete();
    
    // Obtener el elemento movido
    const itemToMove = this.results.splice(ev.detail.from, 1)[0];
    // Insertar en la nueva posición
    this.results.splice(ev.detail.to, 0, itemToMove);
    
    // Aquí puedes implementar la lógica para guardar el nuevo orden en la base de datos
    // por ejemplo, actualizar una propiedad 'orden' en cada elemento
    //console.log('Nuevo orden:', this.results);
    
    // Opcional: Guardar en localStorage para persistir el orden incluso sin conexión
    //this.saveReorderedList();
  }
  
  /**
   * Activa/desactiva el modo de reordenamiento
   */
  toggleReorder() {
    this.reorderEnabled = !this.reorderEnabled;
    
    // Si se desactiva el reordenamiento y se hicieron cambios, guardar
    if (!this.reorderEnabled) {
      this.saveReorderedList();
    }
  }
  
  /**
   * Guarda la lista reordenada
   */
  private saveReorderedList() {
    // Aquí puedes implementar tu lógica para guardar la lista reordenada
    // Por ejemplo, guardar en localStorage
    // Actualizar con índices para mantener el orden
    const reorderedItems = this.results.map((item: any, index: any) => {
      return { ...item, orderIndex: index };
    });
    
    // Guardar la lista reordenada en localStorage
    localStorage.setItem('rutaCobroOrdenada', JSON.stringify(reorderedItems));
    

    // Usar la interfaz en el mapeo para tener tipado correcto
    const orderData: OrdenarRuta[] = this.results.map((item: any, index: number) => {
      return {
        id_usuario: Number(this.UserService.getUserId()),
        codigo_credito: item.id_credito,
        orderIndex: index,
      };
    });

    console.log('Datos de orden:', orderData);
    // Enviar el nuevo orden al servidor
    this.RutaCobro.updateRutaCobroOrder(orderData)
      .subscribe({
        next: (response: any) => {
          console.log('Orden actualizado en el servidor:', response);
        },
        error: (error: any) => {
          console.error('Error al actualizar el orden:', error);
          // Opcionalmente, guardar localmente para sincronizar más tarde
          localStorage.setItem('pendingOrderUpdates', JSON.stringify(orderData));
        }
      });
  }
}

