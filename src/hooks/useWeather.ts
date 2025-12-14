import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchLocationKey, fetchWeather, fetchForecast, fetchLocationByCoordinates, getApiLanguage } from '../services/weatherService';
import type { CurrentWeather, DailyForecast, LocationSearchResult } from '../types';

// ============================================
// Query Keys
// ============================================

/**
 * Query keys for React Query
 * Using a factory pattern for consistent key generation
 * 
 * Why? React Query uses these keys to:
 * - Cache data (same key = same cache)
 * - Invalidate data (change key = new request)
 * - Share data between components
 */
export const weatherKeys = {
  all: ['weather'] as const,
  location: (city: string, lang: string) => [...weatherKeys.all, 'location', city, lang] as const,
  geoposition: (lat: number, lon: number, lang: string) => [...weatherKeys.all, 'geoposition', lat, lon, lang] as const,
  current: (locationKey: string, lang: string) => [...weatherKeys.all, 'current', locationKey, lang] as const,
  forecast: (locationKey: string, lang: string) => [...weatherKeys.all, 'forecast', locationKey, lang] as const,
  city: (city: string, lang: string) => [...weatherKeys.all, 'city', city, lang] as const,
};

// ============================================
// Individual Hooks
// ============================================

/**
 * Hook to fetch location key for a city
 * @param city - City name to search
 * @returns Query result with location key
 */
export const useLocationKey = (city: string) => {
  const { i18n } = useTranslation();
  const apiLang = getApiLanguage(i18n.language);

  return useQuery({
    queryKey: weatherKeys.location(city, apiLang),
    queryFn: () => fetchLocationKey(city, apiLang),
    // Only fetch if city is provided
    enabled: !!city?.trim(),
    // Location keys don't change often, cache for longer
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch location by geographic coordinates
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns Query result with location data
 */
export const useLocationByCoordinates = (
  latitude: number | null,
  longitude: number | null
) => {
  const { i18n } = useTranslation();
  const apiLang = getApiLanguage(i18n.language);

  return useQuery<LocationSearchResult>({
    queryKey: weatherKeys.geoposition(latitude || 0, longitude || 0, apiLang),
    queryFn: () => fetchLocationByCoordinates(latitude!, longitude!, apiLang),
    // Only fetch if both coordinates are provided
    enabled: latitude !== null && longitude !== null,
    // Location data doesn't change often
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch current weather for a location
 * @param locationKey - AccuWeather location key
 * @returns Query result with current weather data
 */
export const useCurrentWeather = (locationKey: string | null | undefined) => {
  const { i18n } = useTranslation();
  const apiLang = getApiLanguage(i18n.language);

  return useQuery({
    queryKey: weatherKeys.current(locationKey || '', apiLang),
    queryFn: () => fetchWeather(locationKey!, apiLang),
    // Only fetch if locationKey is provided and not null
    enabled: !!locationKey,
  });
};

/**
 * Hook to fetch 5-day forecast for a location
 * @param locationKey - AccuWeather location key
 * @returns Query result with forecast data
 */
export const useForecast = (locationKey: string | null | undefined) => {
  const { i18n } = useTranslation();
  const apiLang = getApiLanguage(i18n.language);

  return useQuery({
    queryKey: weatherKeys.forecast(locationKey || '', apiLang),
    queryFn: () => fetchForecast(locationKey!, apiLang),
    // Only fetch if locationKey is provided and not null
    enabled: !!locationKey,
  });
};

// ============================================
// Combined Hook (Main hook for HomePage)
// ============================================

/**
 * Result type for useWeatherByCity hook
 */
export interface WeatherByCityResult {
  weather: CurrentWeather | null;
  forecast: DailyForecast[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Combined hook that fetches all weather data for a city
 * Handles the full flow: city name → location key → weather + forecast
 * 
 * @param city - City name to search
 * @returns Combined weather data with loading/error states
 */
export const useWeatherByCity = (city: string): WeatherByCityResult => {
  // Step 1: Get location key for the city
  const locationQuery = useLocationKey(city);

  // Step 2: Get current weather (depends on location key)
  const weatherQuery = useCurrentWeather(locationQuery.data);

  // Step 3: Get forecast (depends on location key)
  const forecastQuery = useForecast(locationQuery.data);

  // Combine loading states
  const isLoading = locationQuery.isLoading || weatherQuery.isLoading || forecastQuery.isLoading;

  // Combine error states
  const isError = locationQuery.isError || weatherQuery.isError || forecastQuery.isError;
  const error = locationQuery.error || weatherQuery.error || forecastQuery.error;

  // Process forecast data (skip today, show next 5 days)
  let processedForecast: DailyForecast[] = [];
  if (forecastQuery.data?.DailyForecasts) {
    processedForecast = forecastQuery.data.DailyForecasts.slice(1);

    // If not enough days, duplicate the last day
    while (processedForecast.length < 5 && processedForecast.length > 0) {
      const lastDay = processedForecast[processedForecast.length - 1];
      const nextDay: DailyForecast = {
        ...lastDay,
        Date: new Date(
          new Date(lastDay.Date).getTime() + 24 * 60 * 60 * 1000
        ).toISOString(),
      };
      processedForecast.push(nextDay);
    }
  }

  // Refetch function
  const refetch = () => {
    locationQuery.refetch();
  };

  return {
    weather: weatherQuery.data?.[0] || null,
    forecast: processedForecast,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};

// ============================================
// Hook for Favorites Page
// ============================================

/**
 * Hook to fetch weather for multiple cities (favorites)
 * @param cities - Array of city names
 * @returns Map of city name to weather data
 */
export const useFavoritesWeather = (cities: string[]) => {
  const { i18n } = useTranslation();
  const apiLang = getApiLanguage(i18n.language);

  // Create a query for each city
  const queries = useQuery({
    queryKey: ['favorites', apiLang, ...cities],
    queryFn: async () => {
      // Fetch weather for all cities in parallel
      const results = await Promise.all(
        cities.map(async (city) => {
          try {
            const locationKey = await fetchLocationKey(city, apiLang);
            if (!locationKey) return { city, weather: null };

            const weatherData = await fetchWeather(locationKey, apiLang);
            return { city, weather: weatherData[0] };
          } catch {
            return { city, weather: null };
          }
        })
      );

      // Convert array to map
      const weatherMap: Record<string, CurrentWeather | null> = {};
      results.forEach(({ city, weather }) => {
        weatherMap[city] = weather;
      });

      return weatherMap;
    },
    // Only fetch if there are cities
    enabled: cities.length > 0,
  });

  return {
    weatherData: queries.data || {},
    isLoading: queries.isLoading,
    isError: queries.isError,
    error: queries.error as Error | null,
    refetch: queries.refetch,
  };
};
