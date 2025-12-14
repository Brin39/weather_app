import {
  FaSun,
  FaCloudSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaBolt,
  FaSmog,
  FaWind,
  FaCloudShowersHeavy,
  FaMoon,
  FaCloudMoon,
} from 'react-icons/fa';
import type { ReactElement } from 'react';

/**
 * Maps AccuWeather icon codes to React Icons
 * @see https://developer.accuweather.com/weather-icons
 */
const iconMap: Record<number, ReactElement> = {
  // Day icons
  1: <FaSun className="weather-icon" />, // Sunny
  2: <FaCloudSun className="weather-icon" />, // Mostly Sunny
  3: <FaCloudSun className="weather-icon" />, // Partly Sunny
  4: <FaCloudSun className="weather-icon" />, // Intermittent Clouds
  5: <FaCloud className="weather-icon" />, // Hazy Sunshine
  6: <FaCloud className="weather-icon" />, // Mostly Cloudy
  7: <FaCloud className="weather-icon" />, // Cloudy
  8: <FaCloud className="weather-icon" />, // Dreary
  11: <FaSmog className="weather-icon" />, // Fog
  12: <FaCloudRain className="weather-icon" />, // Showers
  13: <FaCloudShowersHeavy className="weather-icon" />, // Mostly Cloudy w/ Showers
  14: <FaCloudShowersHeavy className="weather-icon" />, // Partly Sunny w/ Showers
  15: <FaBolt className="weather-icon" />, // T-Storms
  16: <FaBolt className="weather-icon" />, // Mostly Cloudy w/ T-Storms
  17: <FaBolt className="weather-icon" />, // Partly Sunny w/ T-Storms
  18: <FaCloudRain className="weather-icon" />, // Rain
  19: <FaSnowflake className="weather-icon" />, // Flurries
  20: <FaSnowflake className="weather-icon" />, // Mostly Cloudy w/ Flurries
  21: <FaSnowflake className="weather-icon" />, // Partly Sunny w/ Flurries
  22: <FaSnowflake className="weather-icon" />, // Snow
  23: <FaSnowflake className="weather-icon" />, // Mostly Cloudy w/ Snow
  24: <FaSnowflake className="weather-icon" />, // Ice
  25: <FaSnowflake className="weather-icon" />, // Sleet
  26: <FaSnowflake className="weather-icon" />, // Freezing Rain
  29: <FaSnowflake className="weather-icon" />, // Rain and Snow
  30: <FaSmog className="weather-icon" />, // Hot
  31: <FaSmog className="weather-icon" />, // Cold
  32: <FaWind className="weather-icon" />, // Windy
  // Night icons
  33: <FaMoon className="weather-icon" />, // Clear (night)
  34: <FaCloudMoon className="weather-icon" />, // Mostly Clear (night)
  35: <FaCloudMoon className="weather-icon" />, // Partly Cloudy (night)
  36: <FaCloudMoon className="weather-icon" />, // Intermittent Clouds (night)
  37: <FaCloudMoon className="weather-icon" />, // Hazy (night)
  38: <FaCloud className="weather-icon" />, // Mostly Cloudy (night)
  39: <FaCloudRain className="weather-icon" />, // Partly Cloudy w/ Showers (night)
  40: <FaCloudShowersHeavy className="weather-icon" />, // Mostly Cloudy w/ Showers (night)
  41: <FaBolt className="weather-icon" />, // Partly Cloudy w/ T-Storms (night)
  42: <FaBolt className="weather-icon" />, // Mostly Cloudy w/ T-Storms (night)
  43: <FaSnowflake className="weather-icon" />, // Mostly Cloudy w/ Flurries (night)
  44: <FaSnowflake className="weather-icon" />, // Mostly Cloudy w/ Snow (night)
};

// Default icon when code is not found
const defaultIcon = <FaCloud className="weather-icon" />;

/**
 * Returns appropriate weather icon for given AccuWeather icon code
 * @param iconCode - Weather icon code from AccuWeather API
 * @returns React element with weather icon
 */
export const getWeatherIcon = (iconCode: number | string): ReactElement => {
  // Convert string to number if needed
  const code = typeof iconCode === 'string' ? parseInt(iconCode, 10) : iconCode;
  return iconMap[code] || defaultIcon;
};
