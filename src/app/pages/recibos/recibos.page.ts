import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.page.html',
  styleUrls: ['./recibos.page.scss'],
  standalone: false
})
export class RecibosPage implements OnInit {

  results: Observable<any> | undefined;
  codigo = "";

  constructor(private activatedRoute: ActivatedRoute, private clientesService: ClientesService) { }

  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('id') || "";
    this.results = this.clientesService.searchRecibos(this.codigo);

  }

}
