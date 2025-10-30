import { useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const PushNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isRegistered } = usePushNotifications();

  useEffect(() => {
    if (token && isRegistered) {
      console.log('Push notifications registered with token:', token);
      // TODO: Send token to backend to store in database
      // This would typically call a Supabase function to store the token
      // associated with the current user
    }
  }, [token, isRegistered]);

  return <>{children}</>;
};
