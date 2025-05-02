import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { ThemeService } from './services/theme.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Créditos', url: '/creditos', icon: 'bar-chart' },
    { title: 'Abonos sin conexión', url: '/abonos-sin-conexion', icon: 'receipt' },
    { title: 'Ruta de Cobros', url: '/rutacobro', icon: 'navigate' },
    { title: 'Cobros realizados', url: '/relacion-cobros', icon: 'wallet' },
    { title: 'Configuración', url: '/settings', icon: 'settings' },
  ];

  loggedIn = false;
  userName = '';

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  constructor(
    private platform: Platform,
    private themeService: ThemeService,
    private userData: UserDataService,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // Esperar a que la plataforma esté lista
    await this.platform.ready();
    
    // Inicializar el tema
    await this.themeService.initialize();
    
    // Ocultar el splash screen después de que la app esté lista
    // Esto ocurre automáticamente pero puedes controlarlo aquí si necesitas
    // una lógica personalizada
    await SplashScreen.hide();
  }

  async ngOnInit() {
    // Inicializar el tema global
    await this.themeService.initialize();
    this.checkLoginStatus();
    this.listenForLoginEvents();
  }

  checkLoginStatus(){
    this.updateLoggedInStatus(this.userData.isLoggedIn());
    this.updateUserNameStatus(this.userData.getUsername());
    if(this.userData.isLoggedIn())
    {
      this.router.navigateByUrl('/inicio');
    }
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  updateUserNameStatus(userName: string) {
    setTimeout(() => {
      this.userName = userName;
    }, 300);
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
      this.updateUserNameStatus(this.userData.getUsername());
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }
}
