import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

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
  isDarkMode: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, 
    private LIstProduct: ClientesService,
    private clientesService: ClientesService,
    public navController: NavController,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {    
    //this.nro_identificacion = this.activatedRoute.snapshot.paramMap.get('id');
    this.codigo = this.activatedRoute.snapshot.paramMap.get('id') || "";
    this.results = this.clientesService.searchAbonos(this.codigo);
    this.product = this.LIstProduct.searchProductos(this.codigo);
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

}
