import { Component, OnInit } from '@angular/core';
import { ClientesService, SearchType } from './../../services/clientes.service';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute } from '@angular/router'
import { LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-historal-gestiones',
  templateUrl: './historal-gestiones.page.html',
  styleUrls: ['./historal-gestiones.page.scss'],
  standalone: false,
})
export class HistoralGestionesPage implements OnInit {

  results: any;
  codigo = "";
  isDarkMode: boolean = false;

  constructor(private ObservacionesCredito: ClientesService,
    private UserService: UserDataService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    public navController: NavController,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(val => {
      this.presentLoading();
    });
  }

  async presentLoading() {
    console.log("He llegado")
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando informacion...',

    });
    await loading.present();
    this.codigo = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.ObservacionesCredito.searchObservacionCredito(this.codigo).subscribe(data => {
      this.results = data;
      loading.dismiss();
    });
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }
}
