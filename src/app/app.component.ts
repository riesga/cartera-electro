import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { ThemeService } from './services/theme.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { UserDataService } from './services/user-data.service';
import { AnimatedSplashComponent } from './components/animated-splash/animated-splash.component';

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
    { title: 'Ruta de Cobros', url: '/rutacobro', icon: 'navigate' },
    { title: 'Abonos sin conexión', url: '/abonos-sin-conexion', icon: 'receipt' },    
    { title: 'Cobros realizados', url: '/relacion-cobros', icon: 'wallet' },
    { title: 'Configuración', url: '/settings', icon: 'settings' },
  ];
  loggedIn = false;
  userName = '';
  
  // Controla la visibilidad del splash animado
  showAnimatedSplash = false;

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  constructor(
    private platform: Platform,
    private themeService: ThemeService,
    private userData: UserDataService,
    private router: Router
  ) {
    this.initializeApp();
  }  async initializeApp() {
    // Esperar a que la plataforma esté lista
    await this.platform.ready();
    
    // Inicializar el tema
    await this.themeService.initialize();
    
    // Desactivar temporalmente la interacción mientras se muestra el splash
    document.body.style.pointerEvents = 'none';
    
    // Mostrar nuestro splash animado personalizado
    this.showAnimatedSplash = true;
    
    // Ocultar el splash screen nativo después de que la plataforma esté lista
    await SplashScreen.hide();
    
    // Timeout de seguridad: si por alguna razón el splash no desaparece, 
    // forzar su eliminación después de 5 segundos
    setTimeout(() => {
      if (this.showAnimatedSplash) {
        console.log('Forzando la eliminación del splash por timeout de seguridad');
        this.onSplashFinished();
      }
    }, 5000);
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
  }  /**
   * Método que se ejecuta cuando el splash animado ha terminado
   */
  onSplashFinished() {
    // Usar setTimeout para asegurar que se ejecute después del ciclo actual de detección de cambios
    setTimeout(() => {
      this.showAnimatedSplash = false;
      
      // Asegurarse de que cualquier residuo del splash sea completamente eliminado
      document.querySelectorAll('.splash-container').forEach(el => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.pointerEvents = 'none';
        (el as HTMLElement).style.visibility = 'hidden';
        (el as HTMLElement).style.zIndex = '-1';
      });
      
      // Restaurar la capacidad de interacción para toda la aplicación
      document.body.style.pointerEvents = 'auto';
      
      // Forzar un redibujado de la interfaz para asegurarnos de que todo funcione correctamente
      requestAnimationFrame(() => {
        document.body.style.transform = 'translateZ(0)';
      });
    }, 100);
  }
}
