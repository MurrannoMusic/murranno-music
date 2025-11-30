import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isNativeApp } from '@/utils/platformDetection';

export const useDeepLink = () => {
  useEffect(() => {
    if (!isNativeApp()) return;

    const handleAppUrlOpen = async (data: { url: string }) => {
      console.log('Deep link received:', data.url);

      // Parse the OAuth callback URL
      const url = new URL(data.url);
      
      // Check if this is an OAuth callback
      if (url.pathname === '/callback' || url.host === 'callback') {
        const accessToken = url.searchParams.get('access_token');
        const refreshToken = url.searchParams.get('refresh_token');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          toast.error(errorDescription || 'Authentication failed');
          return;
        }

        if (accessToken && refreshToken) {
          try {
            // Set the session with the tokens received from OAuth
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;

            console.log('Session established from deep link:', sessionData);
            toast.success('Successfully signed in!');
          } catch (error) {
            console.error('Failed to set session from deep link:', error);
            toast.error('Failed to complete authentication');
          }
        }
      }
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
