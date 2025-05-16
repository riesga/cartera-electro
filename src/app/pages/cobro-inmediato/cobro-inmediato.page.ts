import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { ClientesService, SearchType } from './../../services/clientes.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-cobro-inmediato',
  templateUrl: './cobro-inmediato.page.html',
  styleUrls: ['./cobro-inmediato.page.scss'],
  standalone: false,
})
export class CobroInmediatoPage implements OnInit {
  results: any;
  usuario = "";
  isDarkMode: boolean = false;

  // Observable que emite true cuando no hay resultados
  emptyResults$: Observable<boolean> = new Observable<boolean>();

  constructor( 
    private CobrarInmediato: ClientesService,
    private UserService: UserDataService,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.usuario = this.UserService.getUserId();
    this.results = this.CobrarInmediato.searchCobrosInmediatos(this.usuario);

    // Configurar el observable para verificar cuando el array está vacío
    this.emptyResults$ = this.results.pipe(
      map(data => {
        // Verifica si data existe y si es un array vacío
        return !data || (Array.isArray(data) && data.length === 0);
      })
    );
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }

}
