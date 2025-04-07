import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  highContrastPaletteToggle = false;

  constructor() {
    // Register icons for use in the application
    addIcons({ personCircle, personCircleOutline, sunny, sunnyOutline });
  }

  ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkPalette(prefersDark.matches);
    this.initializeHighContrastPalette(prefersHighContrast.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
    prefersHighContrast.addEventListener('change', (mediaQuery) =>
      this.initializeHighContrastPalette(mediaQuery.matches)
    );
  }

  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  // Check/uncheck the toggle and update the palette based on isHighContrast
  initializeHighContrastPalette(isHighContrast: boolean) {
    this.highContrastPaletteToggle = isHighContrast;
    this.toggleHighContrastPalette(isHighContrast);
  }

  // Listen for the toggle check/uncheck to toggle the high contrast palette
  highContrastPaletteToggleChange(event: CustomEvent) {
    this.toggleHighContrastPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-high-contrast" class on the html element
  toggleHighContrastPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-high-contrast', shouldAdd);
  }

}
