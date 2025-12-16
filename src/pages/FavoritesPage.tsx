import { type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import '../styles/FavoritesPage.css';
import { useFavorites } from '../contexts/FavoritesContext';
import { useFavoriteLocations } from '../hooks/useWeather';

/**
 * Favorites page component
 * Displays list of favorite cities with localized names
 * Clicking a card navigates to home page with that city's weather
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, setLastViewedCity } = useFavorites();
  const { t } = useTranslation();

  // Fetch localized names for all favorites
  const { locations, isLoading } = useFavoriteLocations(favorites);

  /**
   * Navigate to home page with selected city
   */
  const handleCityClick = (locationKey: string, cityName: string) => {
    setLastViewedCity(locationKey, cityName);
    navigate(`/?key=${encodeURIComponent(locationKey)}`);
  };

  /**
   * Handle remove button click
   */
  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>, locationKey: string) => {
    e.stopPropagation();
    removeFavorite(locationKey);
  };

  return (
    <div>
      <Header currentPage="favorites" />
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
            {isLoading ? (
              // Show skeleton while loading localized names
              favorites.map((_, index) => (
                <div key={`skeleton-${index}`} className="favorite-card skeleton-card">
                  <div className="skeleton skeleton-text" />
                </div>
              ))
            ) : (
              locations.map((loc, index) => (
                <div
                  key={`${loc.locationKey}-${index}`}
                  className="favorite-card"
                  onClick={() => handleCityClick(loc.locationKey, loc.localizedName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCityClick(loc.locationKey, loc.localizedName);
                  }}
                >
                  <div className="favorite-header">
                    <h2>{loc.localizedName}</h2>
                    <button
                      className="remove-favorite"
                      onClick={(e) => handleRemoveClick(e, loc.locationKey)}
                      aria-label={`Remove ${loc.localizedName} from favorites`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="favorite-hover-text">
                    {t('favorites.show_weather', { city: loc.localizedName })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
