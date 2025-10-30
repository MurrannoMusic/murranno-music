import { Capacitor } from '@capacitor/core';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const isDevelopment = () => import.meta.env.DEV;

export const isMobileScreen = () => window.innerWidth < 768;

export const shouldShowMobileRoutes = () => 
  isNativeApp() || isDevelopment();
