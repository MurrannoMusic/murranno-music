import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.c3daad8632214cd78f32217f9f05ec3c',
  appName: 'murranno-music',
  webDir: 'dist',
  plugins: {
    // PushNotifications disabled temporarily - requires Firebase setup
    // PushNotifications: {
    //   presentationOptions: ["badge", "sound", "alert"]
    // },
    App: {
      appUrlOpen: {
        enabled: true
      }
    }
  }
};

export default config;
