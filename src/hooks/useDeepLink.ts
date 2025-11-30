import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { isNativeApp } from '@/utils/platformDetection';

// This hook is kept for potential future deep link handling
// OAuth now uses HTTPS callback page at /auth/callback instead of custom URL schemes
export const useDeepLink = () => {
  useEffect(() => {
    if (!isNativeApp()) return;

    const handleAppUrlOpen = async (data: { url: string }) => {
      console.log('Deep link received:', data.url);
      
      // Handle any other deep links here in the future
      // OAuth is now handled by the /auth/callback page
    };

    // Listen for app URL open events
    let listenerHandle: any;
    
    CapApp.addListener('appUrlOpen', handleAppUrlOpen).then(handle => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);
};
