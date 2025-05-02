import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // BehaviorSubjects para permitir la suscripción a cambios
  private darkMode = new BehaviorSubject<boolean>(false);
  private highContrast = new BehaviorSubject<boolean>(false);
  private brightness = new BehaviorSubject<number>(0.5); // Valor predeterminado

  private isNativePlatform = Capacitor.isNativePlatform();

  // Observables públicos
  darkMode$ = this.darkMode.asObservable();
  highContrast$ = this.highContrast.asObservable();
  brightness$ = this.brightness.asObservable();

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

    // Obtener el brillo actual solo en plataformas nativas
    if (this.isNativePlatform) {
      try {
        const currentBrightness = await ScreenBrightness.getBrightness();
        this.brightness.next(currentBrightness.brightness);
      } catch (error) {
        console.error('Error al obtener el brillo:', error);
      }
    } else {
      console.log('Funcionalidad de brillo no disponible en web');
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

  // Método para obtener el brillo actual
  async getCurrentBrightness(): Promise<number> {
    // Si no es plataforma nativa, retornar valor predeterminado
    if (!this.isNativePlatform) {
      return this.brightness.value;
    }
    
    try {
      const result = await ScreenBrightness.getBrightness();
      this.brightness.next(result.brightness);
      return result.brightness;
    } catch (error) {
      console.error('Error al obtener el brillo:', error);
      return this.brightness.value;
    }
  }

  // Método para establecer el brillo
  async setBrightness(value: number): Promise<void> {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    
    // Actualizar valor en todos los casos
    this.brightness.next(value);
    
    // Solo llamar a la API nativa si estamos en una plataforma compatible
    if (this.isNativePlatform) {
      try {
        await ScreenBrightness.setBrightness({ brightness: value });
      } catch (error) {
        console.error('Error al establecer el brillo:', error);
      }
    } else {
      console.log('Simulación de brillo en web:', value);
      this.simulateBrightnessChangeInWeb(value);
    }
  }

  // Método para simular cambio de brillo en web (opcional)
  private simulateBrightnessChangeInWeb(value: number): void {
    // Puedes implementar una simulación visual para pruebas
    // Por ejemplo, crear/actualizar un overlay con opacidad
    let overlay = document.getElementById('brightness-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'brightness-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.style.transition = 'background-color 0.3s ease';
      document.body.appendChild(overlay);
    }
    
    // Un valor más bajo de brillo significa más oscuro
    const inverseValue = 1 - value;
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${inverseValue * 0.7})`;
  }

  private toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  private toggleHighContrastPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-high-contrast', shouldAdd);
  }
}