import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.page.html',
  styleUrls: ['./abonos.page.scss'],
  standalone: false
})
export class AbonosPage implements OnInit {

  results: Observable<any> | undefined;
  codigo = "";
  product: Observable<any> | undefined;

  constructor(private activatedRoute: ActivatedRoute, 
    private LIstProduct: ClientesService,
    private clientesService: ClientesService) { }

  ngOnInit() {    
    //this.nro_identificacion = this.activatedRoute.snapshot.paramMap.get('id');
    this.codigo = this.activatedRoute.snapshot.paramMap.get('id') || "";
    this.results = this.clientesService.searchAbonos(this.codigo);
    this.product = this.LIstProduct.searchProductos(this.codigo);
  }

}
