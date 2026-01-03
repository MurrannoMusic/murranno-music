import { useState, useEffect } from 'react';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { isNativeApp } from '@/utils/platformDetection';
import { toast } from 'sonner';

export const useGeolocation = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<string | null>(null);

  const checkPermissions = async () => {
    if (!isNativeApp()) {
      return { location: 'granted' };
    }
    return await Geolocation.checkPermissions();
  };

  const requestPermissions = async () => {
    if (!isNativeApp()) {
      toast.error('Geolocation is only available in the native app');
      return { location: 'denied' };
    }
    return await Geolocation.requestPermissions();
  };

  const getCurrentPosition = async (options?: PositionOptions): Promise<Position | null> => {
    if (!isNativeApp()) {
      toast.error('Geolocation is only available in the native app');
      return null;
    }

    try {
      const permissions = await checkPermissions();
      if (permissions.location !== 'granted') {
        const requested = await requestPermissions();
        if (requested.location !== 'granted') {
          toast.error('Location permission denied');
          return null;
        }
      }

      const position = await Geolocation.getCurrentPosition(options);
      setCurrentPosition(position);
      return position;
    } catch (error) {
      console.error('Failed to get current position:', error);
      toast.error('Failed to get location');
      return null;
    }
  };

  const startWatchingPosition = async (
    callback: (position: Position) => void,
    options?: PositionOptions
  ) => {
    if (!isNativeApp()) {
      toast.error('Geolocation is only available in the native app');
      return;
    }

    try {
      const permissions = await checkPermissions();
      if (permissions.location !== 'granted') {
        const requested = await requestPermissions();
        if (requested.location !== 'granted') {
          toast.error('Location permission denied');
          return;
        }
      }

      const id = await Geolocation.watchPosition(options || {}, (position, err) => {
        if (err) {
          console.error('Watch position error:', err);
          toast.error('Failed to track location');
          return;
        }
        if (position) {
          setCurrentPosition(position);
          callback(position);
        }
      });

      setWatchId(id);
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start watching position:', error);
      toast.error('Failed to start tracking location');
    }
  };

  const stopWatchingPosition = async () => {
    if (!isNativeApp() || !watchId) return;

    try {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
      setIsTracking(false);
    } catch (error) {
      console.error('Failed to stop watching position:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        stopWatchingPosition();
      }
    };
  }, [watchId]);

  return {
    currentPosition,
    isTracking,
    checkPermissions,
    requestPermissions,
    getCurrentPosition,
    startWatchingPosition,
    stopWatchingPosition,
  };
};
