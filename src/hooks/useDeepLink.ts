import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { isNativeApp } from '@/utils/platformDetection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeepLink = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNativeApp()) return;

    const handleAppUrlOpen = async (data: { url: string }) => {
      console.log('Deep link received:', data.url);
      
      // Handle OAuth callback with tokens
      if (data.url.startsWith('murranno://callback')) {
        try {
          // Parse tokens from URL hash fragment
          const hashIndex = data.url.indexOf('#');
          if (hashIndex === -1) {
            console.error('No hash fragment in deep link');
            return;
          }

          const fragment = data.url.substring(hashIndex + 1);
          const params = new URLSearchParams(fragment);
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // Establish Supabase session in native app context
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Failed to set session:', sessionError);
              toast.error('Failed to complete sign in. Please try again.');
              return;
            }

            console.log('Native OAuth session established:', sessionData.user?.email);
            toast.success('Successfully signed in!');

            // Close the in-app browser
            await Browser.close();

            // Navigate to dashboard
            navigate('/app/dashboard');
          } else {
            console.error('No tokens found in deep link');
            toast.error('Authentication incomplete. Please try again.');
          }
        } catch (error) {
          console.error('OAuth deep link error:', error);
          toast.error('An error occurred during sign in.');
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
  }, [navigate]);
};
