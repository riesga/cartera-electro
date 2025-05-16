import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AbonoSinConexion } from '../../interfaces/abono-sin-conexion';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-abono-sin-conexion',
  templateUrl: './abono-sin-conexion.page.html',
  styleUrls: ['./abono-sin-conexion.page.scss'],
  standalone: false
})
export class AbonoSinConexionPage implements OnInit {
  // Cambia la inicialización para garantizar que siempre tenga un valor
  numeroRecibo: string = 'temp-' + Date.now().toString();
  fecha_pago = new Date();
  isDarkMode: boolean = false;
  latitud: number = 0;
  longitud: number = 0;

  abonoForm = new UntypedFormGroup({
    noCodigo: new UntypedFormControl(this.activatedRoute.snapshot.paramMap.get('id'), [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]),
    valor: new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1000), Validators.max(1000000)])
  });

  constructor(public router: Router,
    private UserService: UserDataService,
    private activatedRoute: ActivatedRoute,
    public navController: NavController,
    private toastController: ToastController,
    public alertController: AlertController,
    private themeService: ThemeService
      ) { 
        this.themeService.darkMode$.subscribe((isDark) => {
          this.isDarkMode = isDark;
        });
      }

  ngOnInit() {
    // Genera un código de recibo predeterminado al iniciar
    this.generarCodRecibo();
    
    // Intenta obtener la ubicación al iniciar
    this.obtenerUbicacion();
  }

  // Método para obtener la ubicación
  async obtenerUbicacion() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitud = position.coords.latitude;
      this.longitud = position.coords.longitude;
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      // Establecer valores predeterminados
      this.latitud = 0;
      this.longitud = 0;
    }
  }

  submitForm()
  {
    // Actualiza el código de recibo antes de guardar
    this.generarCodRecibo();

    let abono: AbonoSinConexion = { 
      codigo_credito: this.abonoForm.get('noCodigo')?.value || '',
      valor: Number(this.abonoForm.get('valor')?.value || 0),
      fecha_pago: this.fecha_pago,
      id_usuario: Number(this.UserService.getUserId() || 0), // Asegura que sea número y nunca null
      rec_menbrete: this.numeroRecibo, // Nunca será null
      latitud: this.latitud,
      longitud: this.longitud
    };
    
    this.addAbonoLocalStorage(abono);
    this.router.navigate(['/abonos-sin-conexion']);
  }
  
  // Mejora el método para asegurar que siempre devuelve un string
  generarCodRecibo() {
    try {
      this.numeroRecibo = (new Date(this.fecha_pago)).getTime().toString();
    } catch (error) {
      console.error('Error al generar código de recibo:', error);
      this.numeroRecibo = 'fallback-' + Date.now().toString();
    }
  }

  private addAbonoLocalStorage(abono: AbonoSinConexion) {
    let abonos: AbonoSinConexion[];
    const abonosData = localStorage.getItem('abonos');
    abonos = abonosData ? JSON.parse(abonosData) : [];
    if (!abonos) {
      abonos = [];
    }
    abonos.push(abono);
    localStorage.setItem('abonos', JSON.stringify(abonos));
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

  async registrarAbonoConUbicacion() {

    const toast = await this.toastController.create({
      id: 'searchToast',
      message: 'Obteniendo datos para abono, por favor espere...',
      duration: 10000 // Duración larga para asegurarnos de que no se cierre antes de recibir resultados
    });
    await toast.present();

    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Puedes guardar lat y lng en tu objeto abono o enviarlos al backend
      this.latitud = lat;
      this.longitud = lng;

      // Cerrar el toast antes de continuar con el registro del abono
      await toast.dismiss();
      
      // Luego continúa con el registro del abono
      this.submitForm();
    } catch (error) {
      await toast.dismiss();
      console.error('Error al obtener la ubicación', error);  
      //this.crearAbono();    
      this.presentErrorAlert('Error al obtener datos para el abono');
    }
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'error-alert',
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Getter para acceder al control 'valor' del formulario
  get valor() {
    return this.abonoForm.get('valor');
  }
}
