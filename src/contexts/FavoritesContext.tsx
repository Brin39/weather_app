import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { FavoritesContextValue, FavoriteCity } from '../types';

// Create context with undefined default
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

// LocalStorage keys for persistence
const STORAGE_KEY = 'weather_app_favorites_v2';
const LAST_CITY_KEY = 'weather_app_last_city_v2';
const OLD_STORAGE_KEY = 'weather_app_favorites';

/**
 * Validate that an item is a valid FavoriteCity object
 */
const isValidFavoriteCity = (item: unknown): item is FavoriteCity => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'locationKey' in item &&
    'defaultName' in item &&
    typeof (item as FavoriteCity).locationKey === 'string' &&
    typeof (item as FavoriteCity).defaultName === 'string'
  );
};

/**
 * Load favorites from localStorage
 * Returns empty array if no data or on error
 * Also clears old format data to prevent conflicts
 */
const loadFavoritesFromStorage = (): FavoriteCity[] => {
  try {
    // Clear old format data if exists
    if (localStorage.getItem(OLD_STORAGE_KEY)) {
      localStorage.removeItem(OLD_STORAGE_KEY);
      localStorage.removeItem('weather_app_last_city');
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Validate each item is a proper FavoriteCity object
    return parsed.filter(isValidFavoriteCity);
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

/**
 * Load last viewed city from localStorage
 * Validates the data structure before returning
 */
const loadLastViewedCity = (): FavoriteCity | null => {
  try {
    const stored = localStorage.getItem(LAST_CITY_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate it's a proper FavoriteCity object
    if (isValidFavoriteCity(parsed)) {
      return parsed;
    }

    // Invalid format, clear it
    localStorage.removeItem(LAST_CITY_KEY);
    return null;
  } catch {
    return null;
  }
};

// Props for the Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for favorites state management
 * Persists favorites to localStorage automatically
 */
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  // Initialize state from localStorage
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavoritesFromStorage);
  const [lastViewedCity, setLastViewedCityState] = useState<FavoriteCity | null>(loadLastViewedCity);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  /**
   * Set last viewed city and save to localStorage
   */
  const setLastViewedCity = (locationKey: string, name: string): void => {
    if (!locationKey || !name) return;
    const city: FavoriteCity = { locationKey, defaultName: name };
    setLastViewedCityState(city);
    try {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
    } catch (error) {
      console.error('Error saving last viewed city:', error);
    }
  };

  /**
   * Add a city to favorites
   * Prevents duplicates based on locationKey
   */
  const addFavorite = (locationKey: string, name: string): void => {
    if (!locationKey || !name) return;

    setFavorites((prev) => {
      if (prev.some((f) => f.locationKey === locationKey)) return prev;
      return [...prev, { locationKey, defaultName: name }];
    });
  };

  /**
   * Remove a city from favorites by locationKey
   */
  const removeFavorite = (locationKey: string): void => {
    if (!locationKey) return;
    setFavorites((prev) => prev.filter((f) => f.locationKey !== locationKey));
  };

  /**
   * Check if a city is in favorites by locationKey
   */
  const isFavorite = (locationKey: string): boolean => {
    return favorites.some((f) => f.locationKey === locationKey);
  };

  const value: FavoritesContextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    lastViewedCity,
    setLastViewedCity,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook to access favorites context
 * @throws Error if used outside of FavoritesProvider
 */
export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
