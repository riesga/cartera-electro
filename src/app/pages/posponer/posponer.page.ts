import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Posponer } from '../../interfaces/Posponer';
import { UserDataService } from '../../services/user-data.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-posponer',
  templateUrl: './posponer.page.html',
  styleUrls: ['./posponer.page.scss'],
  standalone: false,
})
export class PosponerPage implements OnInit {

  posponer: Posponer = {
    codigo: 0,
    id_usuario: 0,
    Fecha: new Date(),
    Observacion: "",
    Comentario: "",
  };

  register: Observable<any> | undefined;
  resultObservaciones : Observable<any> | undefined;
  codigo = "";
  informacion = "";
  
  isDarkMode: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private ClientesService: ClientesService,
    private UserService: UserDataService,
    public alertController: AlertController,
    public router: Router,
    public navController: NavController,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  async Almacenar() {
    const alert = await this.alertController.create({
      header: 'Posponer',
      message: 'Está seguro de posponer el cobro?',
      buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: () => {
            // No hacemos nada, simplemente cerramos el alert
            console.log('Operación cancelada');
          }
        },
        {
          text: 'Confirmar',
          cssClass: 'alertButton',
          handler: () => {
            // Guardamos la observación
            this.ClientesService.createObservacion(this.posponer).subscribe({
              next: () => {
                // Mostramos el mensaje de éxito y luego navegamos
                this.Almacenado();
                this.router.navigate(['/abonos/'+this.codigo]);
              },
              error: (err) => {
                console.error('Error al guardar:', err);
                // Aquí podrías mostrar un mensaje de error
              }
            });
          }
      }]
    });   
    await alert.present();    
  };


  async Almacenado() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Esta app dice:',
      message: 'Registro almacenado con exito',
      buttons: [{
        text: 'Aceptar'
      },]
    });

    await alert.present();
  }

  async Verificar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Acuerdo de pago encontrado:',
      message: this.informacion,
      buttons: [{
        text: 'Aceptar',
        role:'cancel',
        handler: data => {
          this.router.navigate(['/abonos/'+this.codigo])
        }        
      },]
    });

    await alert.present();
  }

  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.register = this.ClientesService.searchAbonos(this.codigo);
    this.posponer.codigo = Number(this.codigo);
    this.posponer.id_usuario = Number(this.UserService.getUserId());
    
    // Limpiamos los campos del formulario
    this.posponer.Fecha = new Date();
    this.posponer.Observacion = "";
    this.posponer.Comentario = "";
    
    // Ejecutamos la validación
    this.validar();
    
    this.resultObservaciones = this.ClientesService.SearchConceptos();
  }

  async validar() {
    const val = await this.ClientesService.searchObservacion(this.UserService.getUserId(),this.codigo).toPromise();
    this.informacion = val.Observacion
    if (this.informacion != null) 
    {
      this.Verificar();
    }       
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }
}
