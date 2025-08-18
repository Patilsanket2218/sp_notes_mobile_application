import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wwgsmarketing.application',
  appName: 'WWGS Marketing',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['alert', 'sound'],
    },
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: false,
    },
  },
};

export default config;
