import { useState, useEffect, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaRegStar, FaStar, FaThermometerHalf } from 'react-icons/fa';
import { WiBarometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import { WeatherCardSkeleton, ForecastSkeleton } from '../components/Skeleton';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTemperature } from '../contexts/TemperatureContext';
import { getWeatherIcon } from '../components/weatherIcons';
import { useWeatherByCity } from '../hooks/useWeather';

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
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // React Query hook - ALL data fetching in one line!
  const { weather, forecast, isLoading, isError, error } = useWeatherByCity(searchCity);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle city from URL (when clicking from favorites)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSearchCity(cityParam);
    }
  }, [location.search]);

  // Show error toast when error occurs
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Error loading weather');
    }
  }, [isError, error]);

  // Show "city not found" if query completed but no weather data
  useEffect(() => {
    if (searchCity && !isLoading && !weather && !isError) {
      toast.error('City not found');
    }
  }, [searchCity, isLoading, weather, isError]);

  /**
   * Format date for display
   */
  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  /**
   * Format time for display
   */
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Handle favorite button click
   */
  const handleFavoriteClick = () => {
    if (favorites.includes(searchCity)) {
      removeFavorite(searchCity);
      toast.success(`${searchCity} removed from favorites`);
    } else {
      addFavorite(searchCity);
      toast.success(`${searchCity} added to favorites`);
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

  return (
    <div>
      <Header currentPage="home" />

      <div className="container">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        {isLoading ? (
          <>
            <WeatherCardSkeleton />
            <ForecastSkeleton />
          </>
        ) : isError ? (
          <div className="error">{error?.message || 'Error loading weather'}</div>
        ) : weather ? (
          <div className="current-weather">
            <div className="city-info">
              <button onClick={handleFavoriteClick} className="favorite-button">
                {favorites.includes(searchCity) ? <FaStar /> : <FaRegStar />}
              </button>
              <h1 className="city-name">{searchCity}</h1>
              <div className="date-time">
                <span>Today</span>
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
                  Temperature:{' '}
                  {Math.round(convertTemp(weather.Temperature?.Metric?.Value || 0))}°
                  {isCelsius ? 'C' : 'F'} (feels like{' '}
                  {Math.round(
                    convertTemp(weather.RealFeelTemperature?.Metric?.Value || 0)
                  )}
                  °{isCelsius ? 'C' : 'F'})
                </span>
              </div>
              <div className="detail-item">
                <WiBarometer />
                <span>Pressure: {weather.Pressure?.Metric?.Value || 0} hPa</span>
              </div>
              <div className="detail-item">
                <WiHumidity />
                <span>Humidity: {weather.RelativeHumidity || 0}%</span>
              </div>
              <div className="detail-item">
                <WiStrongWind />
                <span>
                  Wind: {weather.Wind?.Speed?.Metric?.Value || 0} m/s{' '}
                  {weather.Wind?.Direction?.Localized || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <h2>Welcome to the Weather App</h2>
            <p>Search for a city to get weather information</p>
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
