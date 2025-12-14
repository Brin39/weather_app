import axios from 'axios';
import type { CurrentWeather, ForecastResponse, LocationSearchResult } from '../types';

// API configuration
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE_URL = '/api';

/**
 * Fetches current weather conditions for a location
 * @param locationKey - AccuWeather location key
 * @returns Array of current weather data (API returns array with single item)
 */
export const fetchWeather = async (locationKey: string): Promise<CurrentWeather[]> => {
  if (!locationKey) {
    throw new Error('Invalid locationKey');
  }

  try {
    const response = await axios.get<CurrentWeather[]>(
      `${BASE_URL}/currentconditions/v1/${locationKey}`,
      {
        params: { apikey: API_KEY, language: 'en-us', details: true },
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
 * @returns Location key string or undefined if not found
 */
export const fetchLocationKey = async (city: string): Promise<string | undefined> => {
  if (!city?.trim()) {
    throw new Error('City name is required');
  }

  try {
    const response = await axios.get<LocationSearchResult[]>(
      `${BASE_URL}/locations/v1/cities/search`,
      {
        params: { apikey: API_KEY, q: city.trim(), language: 'en-us' },
      }
    );
    return response.data[0]?.Key;
  } catch {
    throw new Error('Error loading location key');
  }
};

/**
 * Gets location information by geographic coordinates
 * @param latitude - Geographic latitude (-90 to 90)
 * @param longitude - Geographic longitude (-180 to 180)
 * @returns Location data including Key and city name
 */
export const fetchLocationByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<LocationSearchResult> => {
  try {
    const response = await axios.get<LocationSearchResult>(
      `${BASE_URL}/locations/v1/cities/geoposition/search`,
      {
        params: {
          apikey: API_KEY,
          q: `${latitude},${longitude}`,
          language: 'en-us',
        },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error getting location by coordinates');
  }
};

/**
 * Fetches 5-day weather forecast for a location
 * @param locationKey - AccuWeather location key
 * @returns Forecast response with daily forecasts
 */
export const fetchForecast = async (locationKey: string): Promise<ForecastResponse> => {
  if (!locationKey) {
    throw new Error('Invalid locationKey');
  }

  try {
    const response = await axios.get<ForecastResponse>(
      `${BASE_URL}/forecasts/v1/daily/5day/${locationKey}`,
      {
        params: { apikey: API_KEY, language: 'en-us', metric: true },
      }
    );
    return response.data;
  } catch {
    throw new Error('Error loading forecast data');
  }
};
