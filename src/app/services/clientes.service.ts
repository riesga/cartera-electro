import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Abono } from '../interfaces/abono';
import { AbonoSinConexion } from '../interfaces/abono-sin-conexion';
import { Posponer } from '../interfaces/Posponer';
import { OrdenarRuta } from '../interfaces/ordernar-ruta';

export enum SearchType {
  nro_identificacion = 'nro_identificacion',
  nombre = 'nombre',
  codigo = 'codigo',
  id_cobrador = 'id_cobrador',
  id_usuario = 'id_usuario',
  id_abono = 'id_abono'
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Basic ' + localStorage.getItem('ks5T6jnrRKneVjA')
    })
  };

  constructor(private http: HttpClient,
    public alertController: AlertController) {
  }

  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Error de comunicación',
      message: 'Por favor revise su conexion de internet e intente nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

  searchTerceros(nro_identificacion: string, nombre: string,codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}tercero?nro_identificacion=${nro_identificacion}&nombre=${nombre}&codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchCreditos(nro_identificacion: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}creditos?nro_identificacion=${nro_identificacion}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchAbonos(codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}estadoindividual?codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  
  searchRecibos(codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}abonos?codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  
  searchRutaCobros(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}RutaCobroes?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  createAbono(abono: Abono): Observable<any> {
    return this.http.post(`${environment.apiUrl}abonos`, abono, this.httpOptions);
  }

  searchVerRecibos(id_abono: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}GenerarReciboUnico/AbonoEstadoCuenta?id_abono=${id_abono}`,this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchProductos(codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}articulo?codigo=${codigo}`,this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  createObservacion(posponer: Posponer): Observable<any> {
    return this.http.post(`${environment.apiUrl}ObservTrazables`, posponer, this.httpOptions);
  }

  searchArticulos(codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Articulo?codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchObservacion(id_usuario: string,codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}ObservTrazables?id_usuario=${id_usuario}&codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  createAbonoSinConexion(abono: AbonoSinConexion): Observable<any> {
    return this.http.post(`${environment.apiUrl}PostAbonoSinConexion`, abono, this.httpOptions);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.errorAlert();
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  searchTotalRutaCobros(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}totalRutaCobro?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  SearchConceptos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}ListarObservaciones`,this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchCobrosRealizados(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}AbonosCobrados/AbonosCobrados?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchTotalCobros(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}TotalCobros/TotalCobrados?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchCobrosInmediatos(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}CobrosInmediatos/ListaCobrar?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  searchVisitarInmediatos(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}VisitaInmediata/ListaVisitas?id_usuario=${id_usuario}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }

  SearchTarjetas(): Observable<any> {
    return this.http.get(`${environment.apiUrl}ListarTarjetas`,this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  SearchBancos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}ListarBancos`,this.httpOptions)
    .pipe(catchError(this.handleError()));
  }
  searchObservacionCredito(codigo: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}ListarObservacionesCredito?codigo=${codigo}`, this.httpOptions)
    .pipe(catchError(this.handleError()));
  }


  updateRutaCobroOrder(orderData: OrdenarRuta[]): Observable<any> {
    const data = { items: orderData };
    return this.http.post(`${environment.apiUrl}actualizar-orden`, data, this.httpOptions);
  }

 
 /*  updateRutaCobroOrder(orderData: any[], userId: any): Observable<any> {
    const url = `${this.url}/rutas/actualizar-orden`;
    
    // Crear el objeto de datos para enviar al servidor
    const data = {
      id_usuario: userId,
      items: orderData
    };
    
    // Configurar headers si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    
    // Realizar la petición POST
    return this.http.post(url, data, { headers }).pipe(
      tap(response => {
        console.log('Orden actualizado correctamente', response);
      }),
      catchError(error => {
        console.error('Error al actualizar el orden de la ruta', error);
        return throwError(() => new Error('No se pudo actualizar el orden de la ruta. Por favor intente nuevamente.'));
      })
    );
  } */
}
