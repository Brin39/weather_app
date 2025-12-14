import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import UnitToggle from './UnitToggle';
import { useTheme } from '../contexts/ThemeContext';

// Props interface for Header component
interface HeaderProps {
  currentPage: 'home' | 'favorites';
}

// Available languages
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
];

/**
 * Application header with navigation and temperature unit toggle
 * Highlights the current active page in navigation
 */
const Header = ({ currentPage }: HeaderProps) => {
  const { toggleTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <header className="header">
      <div className="logo">{t('app.name')}</div>
      <div className="nav-container">
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
          >
            {t('nav.favorites')}
          </Link>
        </div>
        
        {/* Language selector */}
        <div className="language-selector">
          <FaGlobe className="language-icon" />
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
        <UnitToggle />
      </div>
    </header>
  );
};

export default Header;