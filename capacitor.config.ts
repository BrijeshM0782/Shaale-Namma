import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shalenamma.app',
  appName: 'Shale-Namma',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
