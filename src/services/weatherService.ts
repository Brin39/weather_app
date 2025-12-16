import axios from 'axios';
import type { CurrentWeather, ForecastResponse, LocationSearchResult } from '../types';

// API configuration
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE_URL = '/api';

// Map i18n language codes to AccuWeather API language codes
const languageMap: Record<string, string> = {
  en: 'en-us',
  ru: 'ru',
  he: 'he',
};

/**
 * Get AccuWeather language code from i18n code
 * Handles both short (en) and full (en-US) language codes
 */
export const getApiLanguage = (i18nLang: string): string => {
  // Extract base language code (e.g., 'en' from 'en-US')
  const baseLang = i18nLang.split('-')[0].toLowerCase();
  return languageMap[baseLang] || 'en-us';
};

/**
 * Fetches current weather conditions for a location
 * @param locationKey - AccuWeather location key
 * @param language - Language code for localized response
 * @returns Array of current weather data (API returns array with single item)
 */
export const fetchWeather = async (
  locationKey: string,
  language: string = 'en-us'
): Promise<CurrentWeather[]> => {
  if (!locationKey) {
    throw new Error('Invalid locationKey');
  }

  try {
    const response = await axios.get<CurrentWeather[]>(
      `${BASE_URL}/currentconditions/v1/${locationKey}`,
      {
        params: { apikey: API_KEY, language, details: true },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error loading weather data');
  }
};

/**
 * Searches for a city and returns its location key
 * @param city - City name to search for
 * @param language - Language code for localized response
 * @returns Location key string or null if not found
 */
export const fetchLocationKey = async (
  city: string,
  language: string = 'en-us'
): Promise<string | null> => {
  if (!city?.trim()) {
    throw new Error('City name is required');
  }

  try {
    const response = await axios.get<LocationSearchResult[]>(
      `${BASE_URL}/locations/v1/cities/search`,
      {
        params: { apikey: API_KEY, q: city.trim(), language },
      }
    );
    return response.data[0]?.Key ?? null;
  } catch {
    throw new Error('Error loading location key');
  }
};

/**
 * Gets location information by geographic coordinates
 * @param latitude - Geographic latitude (-90 to 90)
 * @param longitude - Geographic longitude (-180 to 180)
 * @param language - Language code for localized response
 * @returns Location data including Key and city name
 */
export const fetchLocationByCoordinates = async (
  latitude: number,
  longitude: number,
  language: string = 'en-us'
): Promise<LocationSearchResult> => {
  try {
    const response = await axios.get<LocationSearchResult>(
      `${BASE_URL}/locations/v1/cities/geoposition/search`,
      {
        params: {
          apikey: API_KEY,
          q: `${latitude},${longitude}`,
          language,
        },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error getting location by coordinates');
  }
};

/**
 * Gets location information by location key
 * Used to get localized city names
 * @param locationKey - AccuWeather location key
 * @param language - Language code for localized response
 * @returns Location data including localized city name
 */
export const fetchLocationByKey = async (
  locationKey: string,
  language: string = 'en-us'
): Promise<LocationSearchResult> => {
  if (!locationKey) {
    throw new Error('Location key is required');
  }

  try {
    const response = await axios.get<LocationSearchResult>(
      `${BASE_URL}/locations/v1/${locationKey}`,
      {
        params: { apikey: API_KEY, language },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error getting location by key');
  }
};

/**
 * Fetches 5-day weather forecast for a location
 * @param locationKey - AccuWeather location key
 * @param language - Language code for localized response
 * @returns Forecast response with daily forecasts
 */
export const fetchForecast = async (
  locationKey: string,
  language: string = 'en-us'
): Promise<ForecastResponse> => {
  if (!locationKey) {
    throw new Error('Invalid locationKey');
  }

  try {
    const response = await axios.get<ForecastResponse>(
      `${BASE_URL}/forecasts/v1/daily/5day/${locationKey}`,
      {
        params: { apikey: API_KEY, language, metric: true },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error loading forecast data');
  }
};
