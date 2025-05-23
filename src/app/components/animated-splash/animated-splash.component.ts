import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-animated-splash',
  templateUrl: './animated-splash.component.html',
  styleUrls: ['./animated-splash.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AnimatedSplashComponent implements OnInit, OnDestroy {
  @Output() splashFinished = new EventEmitter<boolean>();
  
  // Controla la visibilidad del componente
  showSplash = true;
  private timeoutId: any;

  constructor(private animationCtrl: AnimationController) {}
  
  ngOnInit() {
    // Iniciar la secuencia de animación y tiempo de visualización
    this.timeoutId = setTimeout(() => {
      this.startExitSequence();
    }, 3000); // 3 segundos para permitir que se muestre el texto de créditos
  }
  
  ngOnDestroy() {
    // Limpiar timeout si el componente se destruye
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  
  startExitSequence() {
    // Animar la salida del splash
    const splashElement = document.querySelector('.splash-container');
    if (splashElement) {
      const fadeOutAnimation = this.animationCtrl.create()
        .addElement(splashElement)
        .duration(800)
        .fromTo('opacity', '1', '0')
        .onFinish(() => {
          // Eliminar todos los elementos del DOM para asegurar que no interfieran
          document.querySelectorAll('.splash-container').forEach(el => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.pointerEvents = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
            (el as HTMLElement).style.zIndex = '-1';
          });
          
          // Remover el elemento splash completamente del DOM después de la animación
          setTimeout(() => {
            document.querySelectorAll('.splash-container').forEach(el => {
              el.parentNode?.removeChild(el);
            });
          }, 100);
          
          // Emitir evento y ocultar
          this.splashFinished.emit(true);
          this.showSplash = false;
        });
      
      fadeOutAnimation.play();
    } else {
      // Fallback si no se encuentra el elemento
      this.splashFinished.emit(true);
      this.showSplash = false;
    }
  }
}

