// ============================================
// AccuWeather API Response Types
// ============================================

/**
 * Metric/Imperial temperature value from API
 * Example: { Value: 20, Unit: "C", UnitType: 17 }
 */
export interface TemperatureValue {
  Value: number;
  Unit: string;
  UnitType: number;
}

/**
 * Temperature object containing both metric and imperial values
 */
export interface Temperature {
  Metric: TemperatureValue;
  Imperial: TemperatureValue;
}

/**
 * Wind direction information
 */
export interface WindDirection {
  Degrees: number;
  Localized: string;
  English: string;
}

/**
 * Wind speed information
 */
export interface WindSpeed {
  Metric: TemperatureValue;
  Imperial: TemperatureValue;
}

/**
 * Wind information containing speed and direction
 */
export interface Wind {
  Direction: WindDirection;
  Speed: WindSpeed;
}

/**
 * Pressure information
 */
export interface Pressure {
  Metric: TemperatureValue;
  Imperial: TemperatureValue;
}

/**
 * Current weather conditions from AccuWeather API
 * Endpoint: /currentconditions/v1/{locationKey}
 */
export interface CurrentWeather {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: string | null;
  IsDayTime: boolean;
  Temperature: Temperature;
  RealFeelTemperature: Temperature;
  RelativeHumidity: number;
  Wind: Wind;
  Pressure: Pressure;
  UVIndex: number;
  UVIndexText: string;
  Visibility: {
    Metric: TemperatureValue;
    Imperial: TemperatureValue;
  };
  CloudCover: number;
}

/**
 * Daily temperature forecast (min/max)
 */
export interface DailyTemperature {
  Minimum: TemperatureValue;
  Maximum: TemperatureValue;
}

/**
 * Day or night forecast details
 */
export interface DayNightForecast {
  Icon: number;
  IconPhrase: string;
  HasPrecipitation: boolean;
  PrecipitationType?: string;
  PrecipitationIntensity?: string;
}

/**
 * Single day forecast
 */
export interface DailyForecast {
  Date: string;
  EpochDate: number;
  Temperature: DailyTemperature;
  Day: DayNightForecast;
  Night: DayNightForecast;
}

/**
 * 5-day forecast response from AccuWeather API
 * Endpoint: /forecasts/v1/daily/5day/{locationKey}
 */
export interface ForecastResponse {
  Headline: {
    EffectiveDate: string;
    EffectiveEpochDate: number;
    Severity: number;
    Text: string;
    Category: string;
  };
  DailyForecasts: DailyForecast[];
}

/**
 * Location search result from AccuWeather API
 * Endpoint: /locations/v1/cities/search
 */
export interface LocationSearchResult {
  Key: string;
  LocalizedName: string;
  Country: {
    ID: string;
    LocalizedName: string;
  };
  AdministrativeArea: {
    ID: string;
    LocalizedName: string;
  };
}

// ============================================
// Application Types
// ============================================

/**
 * Favorite city data
 */
export interface FavoriteCity {
  locationKey: string;
  defaultName: string;  // Fallback name if API unavailable
}

/**
 * Favorites context value
 */
export interface FavoritesContextValue {
  favorites: FavoriteCity[];
  addFavorite: (locationKey: string, name: string) => void;
  removeFavorite: (locationKey: string) => void;
  isFavorite: (locationKey: string) => boolean;
  lastViewedCity: FavoriteCity | null;
  setLastViewedCity: (locationKey: string, name: string) => void;
}

/**
 * Temperature context value
 */
export interface TemperatureContextValue {
  isCelsius: boolean;
  toggleUnit: () => void;
  convertTemp: (celsius: number) => number;
}

/**
 * Weather data for a favorite city
 */
export interface FavoriteCityWeather {
  city: string;
  weather: CurrentWeather;
}

/**
 * Geographic coordinates from browser Geolocation API
 * Used to get weather by user's current location
 */
export interface GeoPosition {
  latitude: number;
  longitude: number;
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark';

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}
