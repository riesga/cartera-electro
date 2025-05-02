import { Component,inject,OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Observable } from 'rxjs';
import { ClientesService, SearchType } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private userData: UserDataService,
    private servicios: ClientesService,
    private UserService: UserDataService
    ) { }

  ngOnInit() { 
     this.userName = this.userData.getUsername(); 
     this.totales = this.servicios.searchTotalRutaCobros(this.UserService.getUserId());
     console.log(this.servicios.searchCobrosInmediatos(this.UserService.getUserId()));
     this.resultCobros = this.servicios.searchCobrosInmediatos(this.UserService.getUserId());
     this.resultVisitas = this.servicios.searchVisitarInmediatos(this.UserService.getUserId());
  }
}
