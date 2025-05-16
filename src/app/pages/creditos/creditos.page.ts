import { Component, OnInit } from '@angular/core';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
  standalone: false,
})
export class CreditosPage implements OnInit {

  results: Observable<any> | undefined;
  nro_identificacion = "";
  isDarkMode: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, 
    private clientesService: ClientesService, 
    public navController: NavController,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.nro_identificacion = this.activatedRoute.snapshot.paramMap.get('id') || "";
    this.results = this.clientesService.searchCreditos(this.nro_identificacion);
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

}
