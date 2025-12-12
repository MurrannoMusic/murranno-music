/**
 * React Native Native Features Hooks
 * 
 * Expo equivalents of Capacitor native hooks
 */
import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

// ============================================
// useHaptics - Vibration feedback
// ============================================
export function useHaptics() {
  const impact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    const impactStyles = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    await Haptics.impactAsync(impactStyles[style]);
  }, []);

  const notification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    const notificationTypes = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    };
    await Haptics.notificationAsync(notificationTypes[type]);
  }, []);

  const selection = useCallback(async () => {
    await Haptics.selectionAsync();
  }, []);

  return { impact, notification, selection };
}

// ============================================
// useBiometricAuth - Face ID / Fingerprint
// ============================================
export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsAvailable(compatible && enrolled);

    if (compatible) {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometryType('faceId');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometryType('fingerprint');
      }
    }
  };

  const authenticate = async (promptMessage = 'Authenticate') => {
    if (!isAvailable) return { success: false, error: 'Biometrics not available' };

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return { success: result.success, error: result.error };
  };

  return { isAvailable, biometryType, authenticate };
}

// ============================================
// useCamera - Photo capture
// ============================================
export function useCamera() {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const takePhoto = async () => {
    const granted = await requestPermission();
    if (!granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets[0];
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets[0];
  };

  return { hasPermission, takePhoto, pickImage };
}

// ============================================
// usePushNotifications
// ============================================
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    registerForPushNotifications();

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token');
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-expo-project-id', // Replace with your Expo project ID
    });

    setExpoPushToken(token.data);

    // Configure for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token.data;
  };

  return { expoPushToken, notification };
}

// ============================================
// useClipboard
// ============================================
export function useClipboard() {
  const copy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const paste = async () => {
    return await Clipboard.getStringAsync();
  };

  return { copy, paste };
}

// ============================================
// useShare
// ============================================
export function useShare() {
  const share = async (options: { title?: string; text?: string; url?: string }) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.log('Sharing is not available');
      return false;
    }

    // For URLs, we can use the native share
    if (options.url) {
      await Sharing.shareAsync(options.url, {
        dialogTitle: options.title,
      });
    }
    return true;
  };

  return { share };
}

// ============================================
// useBrowser
// ============================================
export function useBrowser() {
  const open = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const openAuth = async (url: string, redirectUrl: string) => {
    return await WebBrowser.openAuthSessionAsync(url, redirectUrl);
  };

  return { open, openAuth };
}

// ============================================
// useNetwork
// ============================================
export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
}

// ============================================
// useGeolocation
// ============================================
export function useGeolocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurrentPosition = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return null;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    return currentLocation;
  };

  return { location, errorMsg, getCurrentPosition };
}

// ============================================
// useDevice
// ============================================
export function useDevice() {
  return {
    brand: Device.brand,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    isDevice: Device.isDevice,
    deviceType: Device.deviceType,
  };
}
