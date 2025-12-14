import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import UnitToggle from './UnitToggle';
import { useTheme } from '../contexts/ThemeContext';

// Props interface for Header component
interface HeaderProps {
  currentPage: 'home' | 'favorites';
}

/**
 * Application header with navigation and temperature unit toggle
 * Highlights the current active page in navigation
 */
const Header = ({ currentPage }: HeaderProps) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="header">
      <div className="logo">Weather App</div>
      <div className="nav-container">
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
          >
            Favorite
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
        <UnitToggle />
      </div>
    </header>
  );
};

export default Header;
