import { type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { getWeatherIcon } from '../components/weatherIcons';
import Header from '../components/Header';
import { FavoriteCardSkeleton } from '../components/Skeleton';
import '../styles/FavoritesPage.css';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTemperature } from '../contexts/TemperatureContext';
import { useFavoritesWeather } from '../hooks/useWeather';
import { useTranslation } from 'react-i18next';

/**
 * Favorites page component
 * Displays list of favorite cities with current weather data
 * 
 * Now uses React Query for data fetching with automatic:
 * - Caching (data stays fresh for 5 minutes)
 * - Parallel fetching (all cities load at once)
 * - Background updates
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const { convertTemp } = useTemperature();
  const { t, i18n } = useTranslation();

  // React Query hook - fetches weather for ALL favorites in parallel!
  const { weatherData, isLoading, isError, error } = useFavoritesWeather(favorites);

  /**
   * Format date for display (uses current language)
   */
  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString(i18n.language, options);
  };

  /**
   * Navigate to home page with selected city
   */
  const handleCityClick = (city: string) => {
    navigate(`/?city=${encodeURIComponent(city)}`);
  };

  /**
   * Handle remove button click
   */
  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>, city: string) => {
    e.stopPropagation();
    removeFavorite(city);
  };

  return (
    <div>
      <Header currentPage="favorites" />
      {isLoading ? (
        <div className="container">
          <h1>{t('favorites.title')}</h1>
          <div className="favorites-grid">
            {favorites.map((_, index) => (
              <FavoriteCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="error">{error?.message || t('errors.loading_error')}</div>
      ) : (
        <div className="container">
          <h1>{t('favorites.title')}</h1>
          {favorites.length === 0 ? (
            <div className="no-favorites">
              <p>{t('favorites.no_favorites')}</p>
              <Link to="/" className="back-button">
                {t('favorites.go_home')}
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((city, index) => {
                const weather = weatherData[city];
                return (
                  <div
                    key={`${city}-${index}`}
                    className="favorite-card"
                    onClick={() => handleCityClick(city)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCityClick(city);
                    }}
                  >
                    <div className="favorite-header">
                      <h2>{city}</h2>
                      <button
                        className="remove-favorite"
                        onClick={(e) => handleRemoveClick(e, city)}
                        aria-label={`Remove ${city} from favorites`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {weather ? (
                      <>
                        <div className="favorite-date">
                          {formatDate(weather.LocalObservationDateTime)}
                        </div>
                        <div className="favorite-weather">
                          {getWeatherIcon(weather.WeatherIcon)}
                          <div className="favorite-temp">
                            {Math.round(convertTemp(weather.Temperature.Metric.Value))}°
                          </div>
                          <div className="favorite-desc">{weather.WeatherText}</div>
                        </div>
                      </>
                    ) : (
                      <div className="loading">{t('errors.loading_error')}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
