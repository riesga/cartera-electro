import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Abono } from '../../interfaces/abono';
import { UserDataService } from '../../services/user-data.service';
import { FormControl, Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nuevo-abono',
  templateUrl: './nuevo-abono.page.html',
  styleUrls: ['./nuevo-abono.page.scss'],
  standalone: false
})
export class NuevoAbonoPage implements OnInit {

  ListaTarjetas: boolean = true;
  ListaBancos: boolean = true;
  CodComprobante: boolean = true;
  formaPago: string = "";
  tipo_tarjeta: string = "";
  id_banco: number = 0;
  id_comprobante: number = 0;

  get valorCtrl() {
    return this.registrationForm.get('valorCtrl');
  }

  get numero_aurotizacion() {
    return this.registrationForm.get('numero_autorizacion');
  }

  get tipoTarjetaCtrl() {
    return this.registrationForm.get('tipo_tarjeta');
  }

  get idBancoCtrl() {
    return this.registrationForm.get('id_banco');
  }

  get idComprobanteCtrl() {
    return this.registrationForm.get('id_comprobante');
  }

  public errorMessages = {
    valorCtrl: [
      { type: 'required', message: 'Ingrese valor' },
      { type: 'min', message: 'El valor debe ser mínimo de 10.000' },
      { type: 'max', message: 'El valor debe ser máximo de 1.000.000' }
    ],
    tipo_tarjeta: [
      { type: 'required', message: 'Seleccione tipo de tarjeta' }
    ],
    id_banco: [
      { type: 'required', message: 'Seleccione banco' }
    ],
    id_comprobante: [
      { type: 'required', message: 'Ingrese número de autorización' }
    ]
  };

  registrationForm = this.formBuilder.group({
    valorCtrl: ['', [Validators.required, Validators.min(10000), Validators.max(1000000)]],
    tipo_tarjeta: [''],
    forma_abono: ['', [Validators.required]],
    numero_autorizacion: [0],
    id_banco: [0],
    numero_cheque: [0],
    id_comprobante: ['']
  });

  abono: Abono = {
    id_usuario: 0,
    codigo_credito: 0,
    valor: 0,
    forma_abono: "",
    tipo_tarjeta: "",
    numero_autorizacion: 0,
    id_banco: 0,
    numero_cheque: 0,
    latitud: 0,
    longitud: 0,
  };

  results: Observable<any> | any;
  Tarjetas: Observable<any> | any;
  Bancos: Observable<any> | any;
  articulos: Observable<any> | any;
  codigo = "";
  valor: 0 | any;
  numero_autorizacion: 0 | any;
  
  numero_cheque: 0 | any;
  product: Observable<any> | any;

  isDarkMode = false;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private clientesService: ClientesService,
    private LIstProduct: ClientesService,
    public alertController: AlertController,
    private UserService: UserDataService,
    public navController: NavController,
    private toastController: ToastController,
    private themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  public submin() {
    console.log(this.registrationForm.value);
  }

  onChange() {
    this.abono.forma_abono = this.formaPago = this.registrationForm.get('forma_abono')?.value;
    
    // Reiniciar validaciones
    this.registrationForm.get('tipo_tarjeta')?.clearValidators();
    this.registrationForm.get('id_banco')?.clearValidators();
    this.registrationForm.get('id_comprobante')?.clearValidators();
    this.registrationForm.get('numero_cheque')?.clearValidators();
    
    // Resetear valores cuando cambia forma de pago
    this.registrationForm.get('tipo_tarjeta')?.setValue('');
    this.registrationForm.get('id_banco')?.setValue(0);
    this.registrationForm.get('id_comprobante')?.setValue('');
    this.registrationForm.get('numero_cheque')?.setValue(0);
    
    // Configuración de campos y validaciones según forma de pago
    if (this.abono.forma_abono == "Efectivo") {
      this.ListaTarjetas = false;
      this.ListaBancos = false;
      this.CodComprobante = false;
    } 
    else if (this.abono.forma_abono == "Tarjeta de Credito" || this.abono.forma_abono == "Tarjeta debito") {
      this.ListaTarjetas = true;
      this.CodComprobante = true;
      this.ListaBancos = false;

      // Añadir validaciones requeridas
      this.registrationForm.get('tipo_tarjeta')?.setValidators([Validators.required]);
      this.registrationForm.get('id_comprobante')?.setValidators([Validators.required, Validators.minLength(4)]);
    } 
    else if (this.abono.forma_abono == "Trasferencia") {
      this.ListaTarjetas = false;
      this.ListaBancos = true;
      this.CodComprobante = true;
      
      // Añadir validaciones requeridas
      this.registrationForm.get('id_banco')?.setValidators([Validators.required]);
      this.registrationForm.get('id_comprobante')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else if (this.abono.forma_abono == "Tarjeta debito") {
      this.ListaTarjetas = true;
      this.ListaBancos = false;
      this.CodComprobante = true;
      
      // Añadir validaciones requeridas
      this.registrationForm.get('tipo_tarjeta')?.setValidators([Validators.required]);
      this.registrationForm.get('id_comprobante')?.setValidators([Validators.required, Validators.minLength(4)]);
    }
    
    // Actualizar el estado de las validaciones
    this.registrationForm.get('tipo_tarjeta')?.updateValueAndValidity();
    this.registrationForm.get('id_banco')?.updateValueAndValidity();
    this.registrationForm.get('id_comprobante')?.updateValueAndValidity();
    this.registrationForm.get('numero_cheque')?.updateValueAndValidity();
  }

  onComprobante() {
    this.abono.numero_autorizacion = this.registrationForm.get('id_comprobante')?.value;
  }

  onTarjetas() {
    // Actualizar tipo de tarjeta cuando cambia
    this.abono.tipo_tarjeta = this.registrationForm.get('tipo_tarjeta')?.value;
  }

  onBancos() {
    // Actualizar banco cuando cambia
    this.abono.id_banco = this.registrationForm.get('id_banco')?.value;
  }

  async crearAbono() {
      this.abono.valor =  this.registrationForm.get('valorCtrl')?.value;
      const alert = await this.alertController.create({
        header: 'Realizar Abono',
        subHeader: 'Esta Seguro de realizar el abono de:',
        message: '$' + (this.valorCtrl?.value || 0).toLocaleString('es-CO'),
        buttons: [{
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alertCancel',
            handler: (blah) => {
              this.router.navigate(['/abonos/' + this.codigo])
              }
            },
            {
            text: 'Confirmar',
            cssClass: 'alertButton',
            handler: (blah) => {
            this.clientesService.createAbono(this.abono)
            .subscribe({
              next: (response) => {
              console.log('Respuesta del servicio:', response);
              this.router.navigate(['/recibos/' + this.codigo]);
                },
                error: (error) => {
                console.error('Error al crear abono:', error);
                let errorMessage = 'Error al procesar el abono';
                
                // Check if the error has a proper response with the Message property
                if (error.error && error.error.Message) {
              errorMessage = error.error.Message;
                }                
                this.presentErrorAlert(errorMessage);
              }
            });
          }
        }]
      });

    await alert.present();
    const { role } = await alert.onDidDismiss();
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

  volver() {
    this.navController.back();
  }

  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.codigo = idParam || "";
    this.results = this.clientesService.searchAbonos(this.codigo);
    this.product = this.LIstProduct.searchProductos(this.codigo);
    this.abono.codigo_credito = Number(this.codigo);
    this.abono.id_usuario = Number(this.UserService.getUserId());
    this.Tarjetas = this.clientesService.SearchTarjetas();
    this.Bancos = this.clientesService.SearchBancos();
    this.ListaTarjetas = false;
    this.ListaBancos = false;
    this.CodComprobante = false;
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
      this.abono.latitud = lat;
      this.abono.longitud = lng;

      // Cerrar el toast antes de continuar con el registro del abono
      await toast.dismiss();
      
      // Luego continúa con el registro del abono
      this.crearAbono();
    } catch (error) {
      await toast.dismiss();
      console.error('Error al obtener la ubicación', error);  
      //this.crearAbono();    
      this.presentErrorAlert('Error al obtener datos para el abono');
    }
  }
  
  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }
}
