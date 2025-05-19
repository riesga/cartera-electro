import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientesService } from './../../services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

// Para dom-to-image, necesitamos una solución compatible
declare const require: any;
const domtoimage = require('dom-to-image');

@Component({
  selector: 'app-detalle-recibo',
  templateUrl: './detalle-recibo.page.html',
  styleUrls: ['./detalle-recibo.page.scss'],
  standalone: false
})

export class DetalleReciboPage implements OnInit {

  CodigoAbono = "";
  CodigoCredito = "";
  recibo: Observable<any> | undefined;
  product: Observable<any>| undefined;
  infoRecibo: any;
  infoArticulos:any;
  today = new Date();
  isDarkMode: boolean = false;

  constructor(
    private RutaActiva: ActivatedRoute,
    private NewRecibo: ClientesService,
    private LIstProduct: ClientesService,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    public navController: NavController,
    private themeService: ThemeService
  ) { 
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }
  ngOnInit(): void {
    this.RutaActiva.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.CodigoAbono = this.RutaActiva.snapshot.paramMap.get('id') || "";
      }
      if (params.has('product')) {
        this.CodigoCredito = this.RutaActiva.snapshot.paramMap.get('product') || "";
      }

    })
    this.recibo = this.NewRecibo.searchVerRecibos(this.CodigoAbono);
    this.product = this.LIstProduct.searchProductos(this.CodigoCredito);
    this.recibo.subscribe(data => {
      this.infoRecibo = data.length < 1 ? null : data[0];
    });
    this.product.subscribe(data =>{
      this.infoArticulos = data.length < 1 ? null : data[0];
    });
  }

  async printReceipt() {
    let loading;
    try {
      loading = await this.loadingCtrl.create({
        message: 'Preparando impresión...',
        spinner: 'circles'
      });
      
      await loading.present();
      
      if (Capacitor.isNativePlatform()) {
        const receiptElement = document.querySelector('.receipt-card');
        
        if (!receiptElement) {
          throw new Error('No se encontró el elemento del recibo');
        }
        
        // Generar la imagen del recibo
        const dataUrl = await domtoimage.toPng(receiptElement as Node);
        const base64Data = dataUrl.split(',')[1];
        
        // Nombre único con timestamp
        const fileName = `recibo_${new Date().getTime()}.png`;
        
        // Guardar la imagen en almacenamiento externo para mejor accesibilidad
        try {
          // En Android, guardar en Pictures para que sea fácilmente accesible
          const savedFile = await Filesystem.writeFile({
            path: `Pictures/Electromuebles/${fileName}`,
            data: base64Data,
            directory: Directory.External,
            recursive: true
          });
          
          // Mostrar mensaje de éxito con instrucciones
          this.showSuccessWithOptions(
            'Comprobante guardado',
            'La imagen del comprobante se ha guardado en la galería de su dispositivo en la carpeta "Pictures/Electromuebles".',
            [
              {
                text: 'Imprimir',
                handler: async () => {
                  try {
                    // Usar Share API para abrir la imagen con aplicaciones externas
                    await Share.share({
                      title: 'Comprobante de Pago',
                      text: 'Comprobante de pago para imprimir',
                      files: [savedFile.uri],
                      dialogTitle: 'Abrir con'
                    });
                  } catch (error) {
                    console.error('Error al abrir la imagen:', error);
                    this.errorAlert('No se pudo abrir la imagen. Intente buscarla en la galería en la carpeta Pictures/Electromuebles');
                  }
                }
              }/* ,
              {
                text: 'OK',
                role: 'cancel'
              } */
            ]
          );
        } catch (error) {
          console.error('Error al guardar en almacenamiento externo:', error);
          
          // Plan B: Intenta compartir la imagen directamente sin guardarla
          try {
            // Crear un Blob con la imagen
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            // Usar el API de compartir para mostrar opciones
            if (navigator.share) {
              await navigator.share({
                title: 'Comprobante de Pago',
                text: 'Comprobante para imprimir',
                files: [new File([blob], fileName, {type: 'image/png'})]
              });
            } else {
              // Si no hay API de compartir, intentar compartir con Capacitor
              await Share.share({
                title: 'Comprobante de Pago',
                text: 'Comprobante para imprimir',
                dialogTitle: 'Abrir para imprimir'
              });
            }
          } catch (shareError) {
            console.error('Error al compartir:', shareError);
            this.errorAlert('No se pudo procesar la imagen. Por favor intente nuevamente.');
          }
        }
      } else {
        // En navegador web, usar impresión nativa (esto funciona bien)
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
          throw new Error('No se pudo abrir una ventana de impresión. Verifique que no esté bloqueado por el navegador.');
        }
        
        // Generar contenido para la ventana de impresión
        printWindow.document.write(`
          <html>
            <head>
              <title>Comprobante de Pago - Electromuebles</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .divider {
                  border-bottom: 1px dashed #ccc;
                  margin: 15px 0;
                }
                .row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .label {
                  font-weight: bold;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-weight: bold;
                }
                @media print {
                  body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              ${this.generatePrintablePage()}
              <script>
                // Imprimir automáticamente y cerrar
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Error al imprimir:', error);
      this.errorAlert('Error al preparar la impresión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }
  
  // Método para mostrar alerta con opciones
  async showSuccessWithOptions(header: string, message: string, buttons: any[]) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  async generateImage() {
    const receiptElement = document.querySelector('.receipt-card');
    
    if (!receiptElement) {
      this.errorAlert('No se encontró el elemento del recibo');
      return;
    }
    
    try {
      // Limpiar caché antes de generar una nueva imagen
      await this.cleanupCacheFiles();
      
      const dataUrl = await domtoimage.toPng(receiptElement as Node);
      const base64Data = dataUrl.split(',')[1];
      
      // Generar nombre único con timestamp
      const fileName = `recibo_${new Date().getTime()}.png`;
      
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true
      });

      // Abrir la imagen con la aplicación predeterminada
      if (Capacitor.isNativePlatform()) {
        // En dispositivos nativos, abrir con Browser
        await Browser.open({
          url: Capacitor.convertFileSrc(savedFile.uri),
          windowName: '_system'
        });
      } else {
        // Para navegadores, crear y eliminar el elemento después de usarlo
        const blob = await (await fetch(dataUrl)).blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Pequeño retraso para asegurar que el navegador procese la descarga
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      }
    } catch (error) {
      console.error('Error al generar imagen:', error);
      this.errorAlert('Error al generar la imagen');
    }
  }

  async shareWhatsApp() {
    let loading;
    try {
      loading = await this.loadingCtrl.create({
        message: 'Preparando comprobante...',
        spinner: 'circles'
      });
      
      await loading.present();
      
      const receiptElement = document.querySelector('.receipt-card');
      
      if (!receiptElement) {
        throw new Error('No se encontró el elemento del recibo');
      }
      
      // Limpiar caché antes de generar una nueva imagen
      await this.cleanupCacheFiles();
      
      // Generar imagen
      const dataUrl = await domtoimage.toPng(receiptElement as Node);
      const base64Data = dataUrl.split(',')[1];
      
      if (Capacitor.getPlatform() === 'android') {
        // Enfoque específico para Android
        try {
          // Crear un nombre de archivo único
          const fileName = `recibo_${new Date().getTime()}.png`;
          
          // Guardar en Documents (más accesible en Android) para mejor interoperabilidad
          const savedFile = await Filesystem.writeFile({
            path: `Pictures/Electromuebles/${fileName}`,
            data: base64Data,
            directory: Directory.External,
            recursive: true
          });
          
          // Mensaje para compartir
          const mensaje = '✅ *COMPROBANTE DE PAGO - ELECTROMUEBLES* ✅\n\n' + 
                          'Le compartimos su comprobante de pago. Gracias por su confianza.\n\n';
                          //this.reciboToStringWA();
          
          // Usar intent específico para compartir el archivo
          // Intentar compartir directamente usando la API de Capacitor
          await Share.share({
            title: 'Comprobante de Pago',
            text: mensaje,
            files: [savedFile.uri], // Usar la URI directa
            dialogTitle: 'Compartir comprobante'
          });
          
          this.showSuccessMessage('Imagen guardada en Galería y lista para compartir');
        } catch (error) {
          console.error('Error al compartir en Android:', error);
          
          // Plan B: Intentar usando solo texto con un mensaje explicativo
          this.compartirTextoRecibo();
        }
      } else if (Capacitor.getPlatform() === 'ios') {
        // Enfoque específico para iOS
        try {
          const fileName = `recibo_${new Date().getTime()}.png`;
          
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });
          
          const mensaje = '✅ *COMPROBANTE DE PAGO - ELECTROMUEBLES* ✅\n\n' + 
                          'Le compartimos su comprobante de pago. Gracias por su confianza.';
          
          await Share.share({
            title: 'Comprobante de Pago',
            text: mensaje,
            url: savedFile.uri,
            dialogTitle: 'Compartir comprobante'
          });
        } catch (error) {
          console.error('Error al compartir en iOS:', error);
          this.compartirTextoRecibo();
        }
      } else {
        // Enfoque para navegador web
        try {
          const blob = this.dataURItoBlob(dataUrl);
          const file = new File([blob], 'recibo.png', { type: 'image/png' });
          
          // En navegadores modernos que soportan Web Share API
          if (navigator.share) {
            await navigator.share({
              title: 'Comprobante de Pago',
              text: '✅ COMPROBANTE DE PAGO - ELECTROMUEBLES ✅',
              files: [file]
            });
          } else {
            // Fallback para navegadores que no soportan compartir
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recibo_pago.png';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 100);
            
            this.showSuccessMessage('Imagen descargada correctamente');
          }
        } catch (error) {
          console.error('Error al compartir en web:', error);
          this.compartirTextoRecibo();
        }
      }
    } catch (error) {
      console.error('Error general al compartir:', error);
      this.errorAlert('No es posible compartir el comprobante en este momento.');
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  // Convertir Data URI a Blob para navegadores web
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }

  // Método para compartir solo el texto del recibo cuando falla el compartir con imagen
  private async compartirTextoRecibo() {
    try {
      const mensaje = '✅ *COMPROBANTE DE PAGO - ELECTROMUEBLES* ✅\n\n' + 
                      'Información del comprobante:\n\n';// +
                      //this.reciboToStringWA();
      
      await Share.share({
        title: 'Comprobante de Pago',
        text: mensaje,
        dialogTitle: 'Compartir comprobante'
      });
      
      this.showSuccessMessage('Información del comprobante compartida');
    } catch (error) {
      console.error('Error al compartir texto:', error);
      this.errorAlert('No se pudo compartir la información del comprobante.');
    }
  }

  // Método para limpiar archivos de caché anteriores
  private async cleanupCacheFiles() {
    try {
      // Listar archivos en el directorio de caché
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Cache
      });

      // Filtrar solo los archivos de recibos antiguos (más de 1 hora)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      // Borrar archivos antiguos
      for (const file of result.files) {
        if (file.name && file.name.startsWith('recibo_')) {
          try {
            const timestamp = parseInt(file.name.replace('recibo_', '').replace('.png', ''));
            if (!isNaN(timestamp) && timestamp < oneHourAgo) {
              await Filesystem.deleteFile({
                path: file.name,
                directory: Directory.Cache
              });
            }
          } catch (e) {
            console.log('Error al eliminar archivo de caché:', e);
          }
        }
      }
    } catch (e) {
      // Si hay error al leer el directorio, simplemente continuar
      console.log('Advertencia al limpiar caché:', e);
    }
  }

  // Mantener el HTML original para impresión
  generatePrintablePage(): string {
    return `<h2><center></center></h2>
    <center><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="300px" height="100px" viewBox="0 0 1590 535"
        preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,535.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none">
        <path d="M2340 4775 c-140 -79 -563 -319 -940 -533 l-685 -388 0 -1074 0
        -1074 90 -51 c50 -28 474 -269 943 -535 765 -433 856 -482 877 -472 13 6 295
        165 627 353 332 188 748 423 925 523 l322 181 1 1072 0 1072 -57 34 c-32 19
        -449 256 -928 527 -478 271 -874 496 -879 501 -6 5 -17 9 -25 9 -9 0 -131 -65
        -271 -145z m700 -340 c143 -24 247 -53 329 -91 77 -35 181 -107 181 -124 0 -6
        -94 -10 -245 -10 l-245 0 -39 25 c-95 63 -248 92 -436 81 -247 -13 -403 -96
        -448 -237 -31 -94 -17 -159 49 -229 87 -93 224 -133 464 -134 273 -1 426 48
        472 151 l19 43 294 0 295 0 0 -72 c0 -97 -28 -156 -105 -226 -185 -169 -547
        -252 -1048 -239 -286 7 -453 32 -642 94 -150 49 -305 139 -375 219 -112 128
        -106 296 17 444 133 162 387 272 713 309 52 6 109 13 125 15 76 11 534 -3 625
        -19z m-632 -1770 c1 -1 1 -82 0 -179 l-3 -176 -350 198 c-192 109 -414 235
        -492 279 l-143 81 0 -147 0 -147 443 -250 442 -251 3 -173 c2 -136 0 -171 -10
        -167 -7 2 -209 115 -448 251 l-435 246 -3 -172 c-1 -94 1 -175 5 -179 5 -4
        230 -132 501 -284 l492 -278 0 -173 c0 -96 -3 -174 -7 -173 -5 0 -343 190
        -752 422 l-744 422 1 555 c1 305 5 686 8 846 l7 291 741 -420 c408 -231 742
        -421 744 -422z m1892 -2 l0 -848 -164 -92 c-90 -51 -166 -93 -170 -93 -3 0 -7
        278 -8 617 l-3 618 -63 -370 c-35 -204 -88 -514 -118 -690 -31 -176 -56 -320
        -57 -321 -23 -19 -358 -200 -360 -196 -2 4 -55 255 -118 558 l-114 552 -3
        -627 -2 -626 -151 -85 c-83 -47 -155 -86 -160 -88 -5 -2 -9 334 -9 846 l0 850
        241 135 c147 83 242 131 244 124 3 -7 60 -246 129 -532 82 -345 126 -512 130
        -495 6 26 37 184 176 905 45 231 86 424 91 429 11 12 471 275 482 275 4 1 7
        -380 7 -846z"/>
        <path d="M5428 3843 l-658 -3 0 -669 c0 -639 1 -672 20 -733 37 -122 129 -217
        260 -271 l55 -22 2418 -3 2417 -2 0 674 c0 624 -1 679 -18 733 -47 150 -176
        264 -331 293 -49 9 -2180 10 -4163 3z m652 -833 l0 -720 -80 0 -80 0 0 720 0
        720 80 0 80 0 0 -720z m1980 380 l0 -120 155 0 155 0 0 -85 0 -85 -155 0 -155
        0 0 -285 0 -285 29 -32 29 -33 126 -3 126 -4 0 -84 0 -84 -142 0 c-167 0 -202
        11 -261 80 -72 84 -71 76 -75 638 l-3 502 85 0 86 0 0 -120z m-2587 -119 c75
        -26 139 -71 188 -134 43 -54 92 -143 87 -157 -3 -8 -549 -357 -574 -367 -8 -3
        -74 122 -74 141 0 3 91 62 202 133 110 70 206 131 212 136 13 8 -20 38 -76 67
        -56 30 -164 28 -227 -5 -101 -51 -153 -153 -153 -300 0 -203 103 -326 274
        -326 138 -1 223 70 269 223 l21 69 37 -5 c20 -3 57 -8 84 -12 26 -3 47 -9 47
        -13 0 -3 -7 -36 -15 -74 -30 -142 -130 -272 -254 -331 -63 -29 -72 -31 -186
        -31 -110 0 -124 2 -175 27 -113 55 -211 167 -252 285 -20 58 -23 87 -22 193 1
        139 17 201 75 292 35 54 125 140 173 165 90 47 240 58 339 24z m1370 -19 c84
        -39 161 -115 207 -205 19 -36 32 -68 30 -70 -14 -14 -582 -368 -585 -365 -4 4
        -65 138 -65 143 0 2 91 60 203 131 111 70 207 131 212 136 12 11 -19 38 -80
        70 -57 31 -154 30 -218 -1 -103 -50 -161 -159 -161 -306 0 -203 108 -330 279
        -329 142 1 222 71 270 237 16 55 18 58 43 53 15 -3 51 -8 81 -12 l54 -6 -6
        -61 c-12 -134 -121 -283 -253 -348 -66 -33 -73 -34 -189 -34 -113 0 -123 2
        -179 30 -111 56 -197 154 -247 280 -20 52 -23 77 -23 190 0 112 4 138 24 190
        56 145 155 249 283 296 41 15 73 19 152 16 88 -2 108 -6 168 -35z m2017 -46
        l0 -83 -50 -6 c-97 -12 -158 -65 -196 -172 -16 -43 -19 -93 -22 -352 l-4 -303
        -79 0 -79 0 0 490 0 490 80 0 80 0 0 -46 0 -45 34 35 c46 49 108 76 179 76
        l57 0 0 -84z m631 47 c125 -62 229 -199 258 -341 25 -123 7 -282 -45 -384 -40
        -78 -136 -173 -213 -210 -84 -40 -206 -50 -297 -23 -140 40 -257 159 -310 315
        -28 82 -26 283 4 364 55 149 183 273 316 307 17 4 74 7 127 6 85 -2 103 -6
        160 -34z m-1701 -67 l0 -84 -97 -4 c-123 -5 -185 -30 -247 -99 -55 -62 -76
        -121 -76 -219 0 -98 21 -157 76 -219 62 -69 124 -94 247 -99 l97 -4 0 -85 0
        -85 -132 4 c-119 3 -139 6 -191 30 -32 15 -85 53 -118 84 -108 104 -151 210
        -151 374 0 163 43 270 149 372 100 95 160 116 326 117 l117 1 0 -84z"/>
        <path d="M9229 3104 c-66 -20 -130 -81 -165 -156 -26 -56 -29 -74 -29 -163 0
        -89 3 -107 29 -163 36 -78 99 -136 169 -157 64 -19 90 -19 158 1 116 34 199
        167 199 319 0 152 -83 285 -199 319 -65 19 -101 19 -162 0z"/>
        <path d="M14966 3836 c-106 -40 -154 -151 -106 -246 67 -131 278 -129 347 3
        21 42 20 119 -4 159 -44 76 -154 114 -237 84z m152 -53 c44 -33 65 -69 65
        -111 0 -77 -56 -133 -137 -139 -163 -12 -227 181 -85 255 52 27 116 25 157 -5z"/>
        <path d="M14970 3675 c0 -87 3 -105 15 -105 11 0 15 12 15 45 0 41 2 45 24 45
        28 0 42 -14 51 -53 7 -28 22 -43 32 -33 10 9 -17 86 -29 86 -6 0 -1 11 11 24
        47 49 8 96 -80 96 l-39 0 0 -105z"/>
        <path d="M12692 3123 c4 -410 7 -486 21 -536 39 -133 117 -236 216 -284 49
        -25 68 -28 151 -28 82 0 103 4 153 27 149 70 237 237 237 449 0 156 -44 265
        -144 357 -78 72 -118 87 -226 87 -82 0 -103 -4 -152 -27 l-58 -27 0 -87 c0
        -65 3 -85 13 -81 119 53 143 59 199 54 139 -12 228 -124 228 -286 0 -96 -22
        -160 -75 -219 -92 -102 -239 -109 -327 -16 -39 42 -76 130 -88 209 -5 39 -10
        253 -10 478 l0 407 -71 0 -70 0 3 -477z"/>
        <path d="M13560 2940 l0 -660 70 0 70 0 0 660 0 660 -70 0 -70 0 0 -660z"/>
        <path d="M10280 3191 c-75 -24 -129 -73 -172 -154 -22 -41 -23 -50 -26 -399
        l-3 -358 71 0 70 0 0 313 c0 286 2 316 20 354 25 57 71 85 127 80 57 -6 91
        -30 114 -80 17 -38 19 -69 19 -354 l0 -313 69 0 69 0 4 308 c3 290 4 310 25
        354 37 81 120 111 190 68 66 -40 68 -50 71 -407 l3 -323 70 0 70 0 -3 353 c-3
        333 -4 354 -24 398 -28 60 -78 115 -128 142 -32 17 -58 22 -121 22 -92 0 -129
        -15 -186 -77 l-37 -39 -22 30 c-36 51 -102 83 -178 87 -37 2 -78 0 -92 -5z"/>
        <path d="M12164 3191 c-134 -33 -260 -174 -293 -329 -49 -235 45 -465 228
        -555 60 -29 73 -32 161 -32 77 1 105 5 144 23 130 59 222 188 243 337 6 47 11
        44 -94 60 l-41 6 -16 -54 c-50 -172 -202 -252 -344 -181 -95 47 -145 141 -145
        271 0 73 4 90 32 148 50 102 138 154 239 142 42 -5 132 -52 139 -73 2 -6 -76
        -62 -173 -125 -98 -63 -181 -117 -186 -120 -8 -5 41 -129 51 -129 12 0 496
        320 505 334 20 29 -91 185 -165 232 -74 46 -197 66 -285 45z"/>
        <path d="M14076 3184 c-128 -41 -232 -159 -272 -307 -18 -66 -18 -217 0 -282
        33 -124 113 -229 219 -286 59 -32 67 -34 162 -34 82 0 109 4 149 23 130 59
        222 188 243 337 6 48 11 44 -94 60 l-42 7 -11 -44 c-16 -58 -53 -128 -82 -155
        -36 -34 -109 -63 -158 -62 -100 0 -174 49 -221 144 -28 58 -32 75 -32 150 0
        75 4 92 32 150 50 102 138 154 239 142 42 -5 132 -52 139 -73 2 -6 -76 -62
        -173 -125 -98 -63 -181 -117 -186 -120 -13 -8 44 -131 58 -125 6 2 86 53 175
        112 90 59 201 131 247 161 45 29 82 58 82 65 0 6 -18 42 -40 79 -45 76 -109
        137 -178 169 -62 30 -187 36 -256 14z"/>
        <path d="M11150 2899 c0 -339 8 -394 70 -487 67 -99 164 -148 279 -140 120 9
        214 78 270 197 l26 56 3 333 3 332 -70 0 -71 0 0 -293 0 -293 -26 -53 c-27
        -54 -74 -94 -127 -106 -68 -17 -147 28 -190 109 -21 -39 -22 -55 -25 339 l-3
        297 -70 0 -69 0 0 -291z"/>
        <path d="M14753 3176 c-100 -32 -145 -100 -146 -220 -1 -139 52 -193 278 -281
        114 -45 152 -65 175 -92 34 -38 34 -39 20 -80 -17 -48 -41 -53 -270 -53 l-210
        0 0 -85 0 -85 221 0 c254 0 285 6 344 65 48 47 65 98 65 186 -1 150 -62 204
        -343 304 -123 43 -165 99 -118 156 19 24 23 24 220 27 l201 3 0 85 0 84 -197
        -1 c-133 0 -212 -5 -240 -13z"/>
        <path d="M4750 1925 l0 -45 5240 0 5240 0 0 45 0 45 -5240 0 -5240 0 0 -45z"/>
        <path d="M5961 1685 c-82 -26 -121 -84 -121 -180 0 -54 -1 -56 -30 -61 -27 -6
        -30 -10 -30 -45 0 -35 2 -38 33 -41 l32 -3 3 -183 2 -183 52 3 52 3 -3 183 -3
        182 56 0 56 0 0 45 0 45 -56 0 -56 0 4 61 c5 72 28 99 85 99 28 0 33 3 30 18
        -3 9 -8 29 -11 45 -7 31 -26 34 -95 12z"/>
        <path d="M14603 1673 l-43 -4 0 -136 0 -137 -28 27 c-90 87 -249 48 -315 -77
        -31 -58 -31 -184 0 -242 41 -77 117 -124 198 -124 38 0 104 31 130 60 l20 22
        5 -33 c5 -33 7 -34 55 -37 l50 -3 2 346 c1 318 0 345 -15 343 -9 -1 -36 -3
        -59 -5z m-107 -322 c87 -53 84 -209 -5 -256 -86 -44 -179 13 -189 115 -11 118
        100 199 194 141z"/>
        <path d="M4800 1329 l0 -339 55 0 55 0 0 258 c0 141 3 294 6 339 l7 81 -62 0
        -61 0 0 -339z"/>
        <path d="M10120 1329 l0 -339 55 0 55 0 0 258 c0 141 3 294 6 339 l7 81 -62 0
        -61 0 0 -339z"/>
        <path d="M11110 1536 l0 -86 -30 -6 c-51 -11 -53 -80 -2 -86 l27 -3 5 -162 c5
        -152 6 -164 28 -185 20 -20 32 -23 111 -23 49 0 92 3 95 6 3 3 9 27 12 52 l7
        47 -60 -6 c-89 -10 -94 -2 -91 150 l3 121 68 -3 67 -2 0 49 0 50 -67 3 -68 3
        4 78 c3 76 3 77 -22 77 -13 0 -39 3 -56 6 l-31 7 0 -87z"/>
        <path d="M13390 1536 l0 -86 -30 -6 c-51 -11 -53 -80 -2 -86 l27 -3 5 -162 c5
        -152 6 -164 28 -185 20 -20 32 -23 111 -23 49 0 92 3 95 6 3 3 9 27 12 52 l7
        47 -60 -6 c-89 -10 -94 -2 -91 150 l3 121 68 -3 67 -2 0 49 0 50 -67 3 -68 3
        4 78 c3 76 3 77 -22 77 -13 0 -39 3 -56 6 l-31 7 0 -87z"/>
        <path d="M5146 1458 c-24 -7 -56 -28 -82 -53 -97 -98 -97 -263 1 -360 73 -74
        167 -83 255 -25 l45 30 9 -28 c12 -36 8 -34 60 -27 l47 7 -7 152 c-4 93 -2
        176 5 215 6 36 9 66 8 67 -2 2 -22 6 -45 10 -41 6 -43 5 -53 -25 l-11 -32 -27
        25 c-53 51 -121 66 -205 44z m151 -108 c122 -74 64 -281 -75 -267 -109 11
        -158 150 -85 238 44 52 104 63 160 29z"/>
        <path d="M7616 1458 c-24 -7 -56 -28 -82 -53 -97 -98 -97 -263 1 -360 73 -74
        167 -83 255 -25 l45 30 9 -28 c12 -36 8 -34 60 -27 l47 7 -7 152 c-4 93 -2
        176 5 215 6 36 9 66 8 67 -2 2 -22 6 -45 10 -41 6 -43 5 -53 -25 l-11 -32 -27
        25 c-53 51 -121 66 -205 44z m151 -108 c122 -74 64 -281 -75 -267 -109 11
        -158 150 -85 238 44 52 104 63 160 29z"/>
        <path d="M8415 1458 c-90 -31 -145 -119 -145 -230 0 -151 114 -264 244 -244
        42 7 106 41 106 57 0 5 5 9 10 9 6 0 10 -42 10 -105 0 -117 -1 -115 76 -99
        l29 5 -3 222 c-2 122 1 256 7 297 5 41 9 75 8 76 -1 1 -28 5 -59 9 l-58 7 0
        -32 0 -32 -30 26 c-51 42 -131 56 -195 34z m175 -126 c50 -50 61 -109 32 -175
        -59 -134 -242 -84 -242 66 0 87 54 147 134 147 31 0 45 -7 76 -38z"/>
        <path d="M9528 1461 c-133 -43 -201 -191 -152 -334 29 -87 125 -147 233 -147
        51 0 126 29 156 60 28 29 28 31 13 64 l-17 34 -57 -29 c-65 -33 -119 -37 -171
        -13 -34 17 -71 59 -60 70 3 4 73 13 154 20 170 16 178 21 169 93 -8 59 -48
        126 -95 157 -43 28 -126 40 -173 25z m121 -117 c37 -31 41 -69 9 -78 -13 -3
        -60 -9 -105 -12 -81 -7 -83 -6 -83 15 0 33 17 60 53 81 45 28 89 25 126 -6z"/>
        <path d="M10469 1456 c-148 -53 -206 -236 -117 -370 57 -87 157 -122 260 -92
        134 39 206 212 141 341 -53 106 -178 159 -284 121z m138 -106 c118 -71 67
        -270 -69 -270 -64 0 -128 74 -128 147 0 39 35 105 67 125 37 23 91 22 130 -2z"/>
        <path d="M11788 1461 c-133 -43 -201 -191 -152 -334 29 -87 125 -147 233 -147
        51 0 126 29 156 60 28 29 28 31 13 64 l-17 34 -57 -29 c-65 -33 -119 -37 -171
        -13 -34 17 -71 59 -60 70 3 4 73 13 154 20 170 16 178 21 169 93 -8 59 -48
        126 -95 157 -43 28 -126 40 -173 25z m121 -117 c37 -31 41 -69 9 -78 -13 -3
        -60 -9 -105 -12 -81 -7 -83 -6 -83 15 0 33 17 60 53 81 45 28 89 25 126 -6z"/>
        <path d="M12340 1455 c-19 -9 -49 -27 -67 -41 l-33 -25 -6 31 c-7 33 0 32 -95
        14 -24 -5 -29 -10 -23 -22 4 -10 9 -108 12 -219 l4 -203 54 0 54 0 0 158 c0
        174 -1 171 67 206 43 22 89 20 113 -4 18 -18 20 -33 20 -190 l0 -170 55 0 55
        0 0 193 c0 206 -4 224 -52 260 -35 26 -113 32 -158 12z"/>
        <path d="M12788 1461 c-133 -43 -201 -191 -152 -334 29 -87 125 -147 233 -147
        51 0 126 29 156 60 28 29 28 31 13 64 l-17 34 -57 -29 c-65 -33 -119 -37 -171
        -13 -34 17 -71 59 -60 70 3 4 73 13 154 20 170 16 178 21 169 93 -8 59 -48
        126 -95 157 -43 28 -126 40 -173 25z m121 -117 c37 -31 41 -69 9 -78 -13 -3
        -60 -9 -105 -12 -81 -7 -83 -6 -83 15 0 33 17 60 53 81 45 28 89 25 126 -6z"/>
        <path d="M13839 1456 c-148 -53 -206 -236 -117 -370 57 -87 157 -122 260 -92
        134 39 206 212 141 341 -53 106 -178 159 -284 121z m138 -106 c118 -71 67
        -270 -69 -270 -64 0 -128 74 -128 147 0 39 35 105 67 125 37 23 91 22 130 -2z"/>
        <path d="M14899 1456 c-148 -53 -206 -236 -117 -370 57 -87 157 -122 260 -92
        134 39 206 212 141 341 -53 106 -178 159 -284 121z m138 -106 c118 -71 67
        -270 -69 -270 -64 0 -128 74 -128 147 0 39 35 105 67 125 37 23 91 22 130 -2z"/>
        <path d="M6351 1453 c-39 -4 -42 -6 -36 -26 5 -12 10 -115 12 -229 l5 -208 54
        0 54 0 0 149 c0 135 2 151 21 175 18 23 28 26 78 26 l58 0 6 47 c3 27 3 51 0
        55 -9 16 -72 7 -119 -17 -27 -14 -50 -25 -51 -25 -1 0 -4 14 -8 30 -4 17 -12
        29 -18 28 -7 -1 -32 -3 -56 -5z"/>
        <path d="M6113 1220 l2 -225 59 -3 59 -3 -6 128 c-4 70 -7 173 -7 228 l0 101
        -54 0 -54 0 1 -226z"/>
        <path d="M6682 1443 c-37 -4 -42 -7 -36 -21 4 -9 10 -109 13 -222 l6 -205 53
        -3 52 -3 0 149 c0 163 -1 162 67 196 43 22 89 20 113 -4 18 -18 20 -33 20
        -180 l0 -160 59 0 59 0 -6 130 c-3 87 -1 138 7 157 25 60 120 93 167 59 17
        -13 19 -30 22 -180 l3 -166 55 0 54 0 0 183 c0 124 -4 190 -13 206 -44 87
        -179 91 -272 9 -32 -27 -34 -28 -40 -9 -10 32 -52 59 -101 67 -52 7 -118 -13
        -164 -53 l-29 -24 -6 28 c-11 47 -14 53 -27 51 -7 -1 -33 -3 -56 -5z"/>
        <path d="M8855 1433 c-15 -33 -18 -291 -5 -339 30 -107 162 -135 274 -59 20
        14 39 25 41 25 2 0 5 -15 7 -32 3 -33 3 -33 56 -33 l53 0 2 225 1 225 -54 0
        -55 0 -3 -140 c-2 -128 -4 -141 -25 -163 -52 -56 -118 -67 -164 -28 l-28 24 1
        156 2 156 -48 0 c-36 0 -50 -4 -55 -17z"/>
        <path d="M11433 1220 l2 -225 59 -3 59 -3 -6 128 c-4 70 -7 173 -7 228 l0 101
        -54 0 -54 0 1 -226z"/>
        </g>
        </svg>
        </center>

    <h3><center>NIT: 800186618</center></h3>
    <p><center>https://www.electromuebles.com.co/<br>
    Tels: Sede principal Arauca: 6078853277<br>
    Tame: 3003517555 Arauq: 6078835940 <br>
    Saravena: 6078820763 </center></p>
    <h3><center>COMPROBANTE DE PAGO</center></h3>
    ${this.reciboToString()}`;
  }
  
  async showSuccessMessage(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  reciboToString(): string {
    return `Recibo Numero: ${this.infoRecibo.recibo}<br>
            Recibi de: ${this.infoRecibo.nombre_cliente}<br>
            Fecha de pago: ${this.datePipe.transform(this.infoRecibo.fecha_pago,'yyyy-MM-dd')}<br>
            NIT o CC: ${this.infoRecibo.nro_identificacion}<br>
            Teléfono: :  ${this.infoRecibo.celular}<br>
            Por concepto de abono al credito: ${this.infoRecibo.codigo}<br>
            <hr>
            <p>Articulos Facturados</p> 
            <hr>
            ${this.infoArticulos.nombrearticulo}
            <hr>
            Valor del credito: ${this.infoRecibo.valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>
            Valor pagado: ${this.infoRecibo.valor_pagado.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>
            Saldo del credito:  ${this.infoRecibo.saldo.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>  
            Saldo Mora ${this.infoRecibo.saldoMora.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>
            Forma de pago:  ${this.infoRecibo.forma_abono}<br>
            Tipo de Tarjeta: ${this.infoRecibo.tipo_tarjeta}<br>
            Nro. Autorizacion.: ${this.infoRecibo.numero_autorizacion }<br>
            Banco: ${this.infoRecibo.banco }<br>
            Nro. Cheque.: ${this.infoRecibo.numero_cheque }<br>
            Nombre Cobrador: :  ${this.infoRecibo.nombre_cobrador}<br>            
            <hr>
            <center><p>GRACIAS POR SU PAGO</p><center>`;
  }

  reciboToStringWA(): string {
    return `Recibo Numero: ${this.infoRecibo.recibo}
            Recibi de: ${this.infoRecibo.nombre_cliente}
            Fecha de pago: ${this.datePipe.transform(this.infoRecibo.fecha_pago,'yyyy-MM-dd')}
            NIT o CC: ${this.infoRecibo.nro_identificacion}
            Por concepto de abono al credito: ${this.infoRecibo.codigo}
            Articulos Facturados
            ${this.infoArticulos.nombrearticulo}
            Valor del credito:  ${this.infoRecibo.valor}
            Valor pagado:  ${this.infoRecibo.valor_pagado}
            Saldo del credito:  ${this.infoRecibo.saldo} 
            Saldo Mora:  ${this.infoRecibo.saldoMora}          
            Forma de pago:  ${this.infoRecibo.forma_abono}
            Tipo de Tarjeta: ${this.infoRecibo.tipo_tarjeta}
            Nro. Autorizacion.: ${this.infoRecibo.numero_autorizacion }
            Banco: ${this.infoRecibo.banco }
            Nro. Cheque.: ${this.infoRecibo.numero_cheque }
            Nombre Cobrador: ${this.infoRecibo.nombre_cobrador}          
            GRACIAS POR SU PAGO`;
  }

  async errorAlert(mensaje: string = 'No es posible compartir.') {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  volver() {
    this.navController.back();
  }

  async toggleDarkMode() {
    await this.themeService.setDarkMode(!this.isDarkMode);
  }
}
