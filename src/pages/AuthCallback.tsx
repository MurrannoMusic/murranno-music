import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { isNativeApp } from '@/utils/platformDetection';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse tokens from URL hash fragment (Supabase OAuth returns tokens in hash)
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          toast.error(`Authentication failed: ${errorDescription || error}`);
          navigate('/login');
          return;
        }

        if (accessToken && refreshToken) {
          // Establish Supabase session
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Failed to set session:', sessionError);
            toast.error('Failed to complete sign in. Please try again.');
            navigate('/login');
            return;
          }

          console.log('OAuth session established:', data.user?.email);
          toast.success('Successfully signed in!');

          // Close browser if native app
          if (isNativeApp()) {
            const { Browser } = await import('@capacitor/browser');
            await Browser.close();
          }

          // Redirect to dashboard
          navigate('/app/dashboard');
        } else {
          console.error('No tokens found in callback URL');
          toast.error('Authentication incomplete. Please try again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('An error occurred during sign in.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};
