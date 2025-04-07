import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // BehaviorSubjects para permitir la suscripción a cambios
  private darkMode = new BehaviorSubject<boolean>(false);
  private highContrast = new BehaviorSubject<boolean>(false);

  // Observables públicos
  darkMode$ = this.darkMode.asObservable();
  highContrast$ = this.highContrast.asObservable();

  constructor() {}

  // Inicializar el tema al arrancar la aplicación
  async initialize() {
    // Recuperar preferencias guardadas
    const darkModePref = await Preferences.get({ key: 'darkMode' });
    const highContrastPref = await Preferences.get({ key: 'highContrast' });
    
    // Configurar modo oscuro
    if (darkModePref.value !== null) {
      const isDark = darkModePref.value === 'true';
      this.setDarkMode(isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.setDarkMode(prefersDark.matches);
      
      prefersDark.addEventListener('change', (mediaQuery) => 
        this.setDarkMode(mediaQuery.matches)
      );
    }

    // Configurar alto contraste
    if (highContrastPref.value !== null) {
      const isHighContrast = highContrastPref.value === 'true';
      this.setHighContrast(isHighContrast);
    } else {
      const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');
      this.setHighContrast(prefersHighContrast.matches);
      
      prefersHighContrast.addEventListener('change', (mediaQuery) => 
        this.setHighContrast(mediaQuery.matches)
      );
    }
  }

  // Establecer el modo oscuro
  async setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    this.toggleDarkPalette(isDark);
    
    await Preferences.set({
      key: 'darkMode',
      value: isDark.toString()
    });
  }

  // Establecer el alto contraste
  async setHighContrast(isHighContrast: boolean) {
    this.highContrast.next(isHighContrast);
    this.toggleHighContrastPalette(isHighContrast);
    
    await Preferences.set({
      key: 'highContrast',
      value: isHighContrast.toString()
    });
  }

  private toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  private toggleHighContrastPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-high-contrast', shouldAdd);
  }
}