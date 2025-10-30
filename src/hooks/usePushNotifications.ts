import { useEffect, useState } from 'react';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { isNativeApp } from '@/utils/platformDetection';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!isNativeApp()) {
      return;
    }

    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        toast.error('Push notification permission denied');
        return;
      }

      // Register with Apple / Google
      await PushNotifications.register();

      // Listen for registration success
      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        setToken(token.value);
        setIsRegistered(true);
        
        // TODO: Send token to backend
        // You can call your edge function here to store the token
      });

      // Listen for registration errors
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Push registration error:', error);
        toast.error('Failed to register for push notifications');
      });

      // Listen for push notifications received
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        toast.info(notification.title || 'New notification', {
          description: notification.body,
        });
      });

      // Listen for push notification actions
      await PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('Push notification action performed:', action);
        // Handle navigation based on notification data
        const data = action.notification.data;
        if (data?.route) {
          // Navigate to the route
          window.location.href = data.route;
        }
      });

    } catch (error) {
      console.error('Push notification initialization error:', error);
    }
  };

  const getDeliveredNotifications = async () => {
    if (!isNativeApp()) {
      return [];
    }

    try {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      return notificationList.notifications;
    } catch (error) {
      console.error('Failed to get delivered notifications:', error);
      return [];
    }
  };

  const removeAllDeliveredNotifications = async () => {
    if (!isNativeApp()) {
      return;
    }

    try {
      await PushNotifications.removeAllDeliveredNotifications();
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  return {
    token,
    isRegistered,
    getDeliveredNotifications,
    removeAllDeliveredNotifications,
  };
};
