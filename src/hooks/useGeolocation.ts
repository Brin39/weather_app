import { useState, useCallback } from 'react';
import type { GeoPosition } from '../types';

/**
 * Geolocation hook return type
 */
interface UseGeolocationReturn {
  position: GeoPosition | null;
  error: string | null;
  isLoading: boolean;
  getPosition: () => void;
}

/**
 * Custom hook for browser geolocation
 * Provides access to user's geographic coordinates
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosition = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    // Reset state before new request
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      // Error callback
      (err) => {
        let errorMessage: string;
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      // Options
      {
        enableHighAccuracy: false, // false = faster, less battery
        timeout: 10000,            // 10 seconds max wait
        maximumAge: 600000,        // Cache position for 10 minutes
      }
    );
  }, []);

  return { position, error, isLoading, getPosition };
};