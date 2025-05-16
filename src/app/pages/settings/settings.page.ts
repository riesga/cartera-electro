import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

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
  latitud: number = 0;
  longitud: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private themeService: ThemeService, private toastController: ToastController, public alertController: AlertController,) {
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

  async permitirGPS() {

    const toast = await this.toastController.create({
      id: 'searchToast',
      message: 'Calibrando GPS, por favor espere...',
      duration: 10000 // Duración larga para asegurarnos de que no se cierre antes de recibir resultados
    });
    await toast.present();

    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Puedes guardar lat y lng en tu objeto abono o enviarlos al backend
      this.latitud = lat;
      this.longitud = lng;
      
      // Mostrar alerta de éxito
      const successAlert = await this.alertController.create({
        header: 'GPS Calibrado',
        message: 'Se ha calibrado el GPS correctamente.',
        buttons: ['OK']
      });
      await successAlert.present();

      
      await toast.dismiss();
    } catch (error) {
      await toast.dismiss();
      console.error('Error al obtener la ubicación', error);     
      // Mostrar alerta de éxito
      const successAlert = await this.alertController.create({
        header: 'Calibracón GPS falló',
        message: 'No se pudo calibrar el GPS. Verifique que la aplicación tenga permisos para acceder a la ubicación.',
        buttons: ['OK']
      }); 
    }


  }

}
