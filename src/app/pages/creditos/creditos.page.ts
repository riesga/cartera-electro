import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
  standalone: false,
})
export class CreditosPage implements OnInit {

  results: Observable<any> | undefined;
  nro_identificacion = "";

  constructor(private activatedRoute: ActivatedRoute, private clientesService: ClientesService) { }

  ngOnInit() {
    this.nro_identificacion = this.activatedRoute.snapshot.paramMap.get('id') || "";
    this.results = this.clientesService.searchCreditos(this.nro_identificacion);
  }

}
