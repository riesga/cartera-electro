import { ClientesService, SearchType } from './../../services/clientes.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: false,
})
export class ClientesPage implements OnInit {

  results: Observable<any> | undefined;
  searchTerm: string = '';
  type: SearchType = SearchType.nro_identificacion;

  constructor(
    private clientesService: ClientesService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async searchChanged() {    
    // Mostrar el toast cuando se ejecuta la búsqueda
    const toast = await this.toastController.create({
      id: 'searchToast',
      message: 'Consultando datos, por favor espere...',
      duration: 10000 // Duración larga para asegurarnos de que no se cierre antes de recibir resultados
    });
    await toast.present();
    
    // Realizar la búsqueda
    const searchObservable = this.clientesService.searchTerceros(
      this.type == SearchType.nro_identificacion ? this.searchTerm : "",
      this.type == SearchType.nombre ? this.searchTerm : "",
      this.type == SearchType.codigo ? this.searchTerm : ""
    );
    
    // Asignar el observable a la propiedad results para la vista
    this.results = searchObservable;
    
    // Suscribirse al observable para cerrar el toast cuando lleguen los resultados
    searchObservable.pipe(first()).subscribe({
      next: (data) => {
        // Cerrar el toast cuando tengamos los resultados
        toast.dismiss();
      },
      error: (error) => {
        // También cerrar el toast en caso de error
        toast.dismiss();
      }
    });
  }
}
