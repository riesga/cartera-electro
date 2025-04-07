import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  private highContrast = new BehaviorSubject<boolean>(false);

  // Observables públicos para que los componentes se suscriban
  darkMode$ = this.darkMode.asObservable();
  highContrast$ = this.highContrast.asObservable();

  constructor() {
    // Inicializar tema al crear el servicio
    this.initTheme();
  }

  async initTheme() {
    await this.loadSavedPreferences();
  }

  private async loadSavedPreferences() {
    try {
      const darkModePref = await Preferences.get({ key: 'darkMode' });
      const highContrastPref = await Preferences.get({ key: 'highContrast' });

      // Aplicar modo oscuro
      if (darkModePref.value !== null) {
        this.setDarkMode(darkModePref.value === 'true', false);
      } else {
        // Usar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.setDarkMode(prefersDark.matches, false);
        
        // Escuchar cambios en las preferencias del sistema
        prefersDark.addEventListener('change', e => this.setDarkMode(e.matches, true));
      }

      // Aplicar alto contraste
      if (highContrastPref.value !== null) {
        this.setHighContrast(highContrastPref.value === 'true', false);
      } else {
        // Usar preferencia del sistema
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');
        this.setHighContrast(prefersHighContrast.matches, false);
        
        // Escuchar cambios en las preferencias del sistema
        prefersHighContrast.addEventListener('change', e => this.setHighContrast(e.matches, true));
      }
    } catch (error) {
      console.error('Error loading theme preferences', error);
    }
  }

  async setDarkMode(enable: boolean, savePreference = true) {
    // Actualizar el estado interno
    this.darkMode.next(enable);
    
    // Actualizar la interfaz de usuario
    document.documentElement.classList.toggle('ion-palette-dark', enable);
    
    // Guardar la preferencia si se solicita
    if (savePreference) {
      await Preferences.set({
        key: 'darkMode',
        value: enable.toString()
      });
    }
  }

  async setHighContrast(enable: boolean, savePreference = true) {
    // Actualizar el estado interno
    this.highContrast.next(enable);
    
    // Actualizar la interfaz de usuario
    document.documentElement.classList.toggle('ion-palette-high-contrast', enable);
    
    // Guardar la preferencia si se solicita
    if (savePreference) {
      await Preferences.set({
        key: 'highContrast',
        value: enable.toString()
      });
    }
  }

  // Métodos para obtener el estado actual
  isDarkMode(): boolean {
    return this.darkMode.value;
  }

  isHighContrast(): boolean {
    return this.highContrast.value;
  }
}