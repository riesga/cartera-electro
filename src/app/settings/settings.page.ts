import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  highContrastPaletteToggle = false;
  brightnessValue = 0.5; // Valor por defecto
  autoBrightnessEnabled = false;

  private subscriptions: Subscription[] = [];

  constructor(private themeService: ThemeService) {
    // Register icons for use in the application
    addIcons({ personCircle, personCircleOutline, sunny, sunnyOutline });
  }

  async ngOnInit() {
    // Suscribirse a los cambios de tema
    this.subscriptions.push(
      this.themeService.darkMode$.subscribe(isDark => {
        this.paletteToggle = isDark;
      }),
      this.themeService.highContrast$.subscribe(isHighContrast => {
        this.highContrastPaletteToggle = isHighContrast;
      }),
      this.themeService.brightness$.subscribe(brightness => {
        this.brightnessValue = brightness;
      })
    );

    // Obtener el brillo actual
    this.brightnessValue = await this.themeService.getCurrentBrightness();
        
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Escuchar cambios en el toggle de modo oscuro
  async toggleChange(event: CustomEvent) {
    const isDark = event.detail.checked;
    await this.themeService.setDarkMode(isDark);
  }

  // Escuchar cambios en el toggle de alto contraste
  async highContrastPaletteToggleChange(event: CustomEvent) {
    const isHighContrast = event.detail.checked;
    await this.themeService.setHighContrast(isHighContrast);
  }

  // Método para cambiar el brillo
  async onBrightnessChange(event: Event) {
    const value = (event.target as HTMLIonRangeElement).value as number;
    await this.themeService.setBrightness(value);
  }

}
