import { useState, useEffect, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaRegStar, FaStar, FaThermometerHalf, FaMapMarkerAlt } from 'react-icons/fa';
import { WiBarometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import { WeatherCardSkeleton, ForecastSkeleton } from '../components/Skeleton';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTemperature } from '../contexts/TemperatureContext';
import { getWeatherIcon } from '../components/weatherIcons';
import { useWeatherByCity, useLocationByCoordinates } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from 'react-i18next';

/**
 * Home page component
 * Displays current weather and 5-day forecast for searched city
 * 
 * Now uses React Query for data fetching with automatic:
 * - Caching (repeat searches are instant)
 * - Error retry (auto-retries on failure)
 * - Background updates
 */
const HomePage = () => {
  const location = useLocation();

  // Search input state
  const [searchInput, setSearchInput] = useState('');

  // The city we're currently showing weather for
  const [searchCity, setSearchCity] = useState('');

  // Time display (updates every second)
  const [currentTime, setCurrentTime] = useState(new Date());

  // Context hooks
  const { isCelsius, convertTemp } = useTemperature();
  const { favorites, addFavorite, removeFavorite, isFavorite, lastViewedCity, setLastViewedCity } = useFavorites();
  const { t, i18n } = useTranslation();

  // React Query hook - ALL data fetching in one line!
  const { weather, forecast, locationKey, localizedCityName, isLoading, isError, error } = useWeatherByCity(searchCity);

  // Geolocation hooks
  const {
    position,
    error: geoError,
    isLoading: isGeoLoading,
    getPosition,
  } = useGeolocation();

  // Get location data from coordinates
  const locationQuery = useLocationByCoordinates(
    position?.latitude ?? null,
    position?.longitude ?? null
  );

  // Track if we've tried geolocation
  const [geoAttempted, setGeoAttempted] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-request geolocation on first load
  useEffect(() => {
    // Only request if no city is set and haven't tried yet
    if (!searchCity && !geoAttempted) {
      setGeoAttempted(true);
      getPosition();
    }
  }, [searchCity, geoAttempted, getPosition]);

  // Handle city from URL (when clicking from favorites)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSearchCity(cityParam);
    }
  }, [location.search]);

  // Handle geolocation result
  useEffect(() => {
    if (locationQuery.data?.LocalizedName) {
      setSearchCity(locationQuery.data.LocalizedName);
      toast.success(`${t('home.location_detected')}: ${locationQuery.data.LocalizedName}`);
    }
  }, [locationQuery.data, t]);

  // Handle geolocation errors - fallback to lastViewedCity or first favorite
  useEffect(() => {
    if (geoError && geoAttempted && !searchCity) {
      console.log('Geolocation error:', geoError);

      // Try lastViewedCity first (use defaultName for search)
      if (lastViewedCity) {
        setSearchCity(lastViewedCity.defaultName);
      }
      // Then try first favorite
      else if (favorites.length > 0) {
        setSearchCity(favorites[0].defaultName);
      }
      // Otherwise show welcome message (no city set)
    }
  }, [geoError, geoAttempted, searchCity, lastViewedCity, favorites]);

  // Show error toast when error occurs
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || t('errors.loading_error'));
    }
  }, [isError, error, t]);

  // Show "city not found" if query completed but no weather data
  useEffect(() => {
    if (searchCity && !isLoading && !weather && !isError) {
      toast.error(t('errors.city_not_found'));
    }
  }, [searchCity, isLoading, weather, isError, t]);

  // Save last viewed city when weather is loaded successfully
  // Only update if locationKey changed to prevent infinite loop
  useEffect(() => {
    if (weather && locationKey && localizedCityName) {
      // Check if this is a different city than what's saved
      if (lastViewedCity?.locationKey !== locationKey) {
        setLastViewedCity(locationKey, localizedCityName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);

  /**
   * Format date for display (uses current language)
   */
  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return new Date(date).toLocaleDateString(i18n.language, options);
  };

  /**
   * Format time for display (uses current language)
   */
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Check if current city is in favorites
   */
  const isCurrentCityFavorite = locationKey ? isFavorite(locationKey) : false;

  /**
   * Handle favorite button click
   */
  const handleFavoriteClick = () => {
    if (!locationKey || !localizedCityName) return;

    if (isCurrentCityFavorite) {
      removeFavorite(locationKey);
      toast.success(`${localizedCityName} ${t('favorites.removed')}`);
    } else {
      addFavorite(locationKey, localizedCityName);
      toast.success(`${localizedCityName} ${t('favorites.added')}`);
    }
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedCity = searchInput.trim();
    if (!trimmedCity) return;

    // Set the city to search - React Query will automatically fetch
    setSearchCity(trimmedCity);
    setSearchInput('');
  };

  // Display name: use localized name if available, otherwise search city
  const displayCityName = localizedCityName || searchCity;

  return (
    <div>
      <Header currentPage="home" />

      <div className="container">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('home.search_placeholder')}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        {(isLoading || (isGeoLoading && !searchCity) || (locationQuery.isLoading && !searchCity)) ? (
          <>
            <WeatherCardSkeleton />
            <ForecastSkeleton />
          </>
        ) : isError ? (
          <div className="error">{error?.message || t('errors.loading_error')}</div>
        ) : weather ? (
          <div className="current-weather">
            <div className="city-info">
              <button onClick={handleFavoriteClick} className="favorite-button">
                {isCurrentCityFavorite ? <FaStar /> : <FaRegStar />}
              </button>
              <h1 className="city-name">{displayCityName}</h1>
              <div className="date-time">
                <span>{t('home.today')}</span>
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className="weather-info">
              <div className="temperature-main">
                {Math.round(convertTemp(weather.Temperature?.Metric?.Value || 0))}°
              </div>
              {getWeatherIcon(weather.WeatherIcon || 1)}
              <div className="weather-description">{weather.WeatherText}</div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <FaThermometerHalf />
                <span>
                  {t('weather.temperature')}:{' '}
                  {Math.round(convertTemp(weather.Temperature?.Metric?.Value || 0))}°
                  {isCelsius ? 'C' : 'F'} ({t('weather.feels_like')}{' '}
                  {Math.round(
                    convertTemp(weather.RealFeelTemperature?.Metric?.Value || 0)
                  )}
                  °{isCelsius ? 'C' : 'F'})
                </span>
              </div>
              <div className="detail-item">
                <WiBarometer />
                <span>{t('weather.pressure')}: {weather.Pressure?.Metric?.Value || 0} hPa</span>
              </div>
              <div className="detail-item">
                <WiHumidity />
                <span>{t('weather.humidity')}: {weather.RelativeHumidity || 0}%</span>
              </div>
              <div className="detail-item">
                <WiStrongWind />
                <span>
                  {t('weather.wind')}: {weather.Wind?.Speed?.Metric?.Value || 0} m/s{' '}
                  {weather.Wind?.Direction?.Localized || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <h2>{t('home.welcome_title')}</h2>
            <p>{t('home.welcome_text')}</p>
            {geoError && (
              <button
                onClick={() => {
                  setGeoAttempted(false);
                }}
                className="geo-retry-button"
              >
                <FaMapMarkerAlt /> {t('home.use_my_location')}
              </button>
            )}
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-date">{formatDate(day.Date)}</div>
                {getWeatherIcon(day.Day.Icon)}
                <div className="forecast-temp">
                  {Math.round(convertTemp(day.Temperature.Maximum.Value))}°
                  {isCelsius ? 'C' : 'F'}
                </div>
                <div className="forecast-desc">{day.Day.IconPhrase}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
