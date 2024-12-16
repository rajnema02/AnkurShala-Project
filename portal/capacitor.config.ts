import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'parking.innobimbinfotech.com',
  appName: 'Parking Management Solution',
  webDir: '../backendApi/public/dist/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
