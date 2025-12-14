import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { FavoritesContextValue } from '../types';

// Create context with undefined default
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

// LocalStorage key for persistence
const STORAGE_KEY = 'weather_app_favorites';

/**
 * Load favorites from localStorage
 * Returns empty array if no data or on error
 */
const loadFavoritesFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
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
  const [favorites, setFavorites] = useState<string[]>(loadFavoritesFromStorage);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  /**
   * Add a city to favorites
   * Prevents duplicates and validates input
   */
  const addFavorite = (city: string): void => {
    if (!city || typeof city !== 'string') return;
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setFavorites((prev) => {
      if (prev.includes(trimmedCity)) return prev;
      return [...prev, trimmedCity];
    });
  };

  /**
   * Remove a city from favorites
   */
  const removeFavorite = (city: string): void => {
    if (!city) return;
    setFavorites((prev) => prev.filter((c) => c !== city));
  };

  /**
   * Check if a city is in favorites
   */
  const isFavorite = (city: string): boolean => {
    return favorites.includes(city);
  };

  const value: FavoritesContextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
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
