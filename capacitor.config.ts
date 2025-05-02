import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CarteraElectro',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Duración en ms (3 segundos)
      launchAutoHide: true,
      backgroundColor: "#ffffffff", // Color de fondo (blanco)
      androidSplashResourceName: "splash", // Nombre de la imagen en Android
      androidScaleType: "CENTER_CROP", // Tipo de escalado
      showSpinner: true, // Mostrar spinner
      androidSpinnerStyle: "large", // Estilo de spinner en Android
      iosSpinnerStyle: "small", // Estilo de spinner en iOS
      spinnerColor: "#999999", // Color del spinner
      splashFullScreen: true, // Pantalla completa
      splashImmersive: true, // Inmersivo (oculta barra de estado)
      layoutName: "launch_screen", // Nombre del layout personalizado (Android)
      useDialog: false, // Usar diálogo para evitar parpadeo
    },
  },
};

export default config;
