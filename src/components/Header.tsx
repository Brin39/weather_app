import { Link } from 'react-router-dom';
import UnitToggle from './UnitToggle';

// Props interface for Header component
interface HeaderProps {
  currentPage: 'home' | 'favorites';
}

/**
 * Application header with navigation and temperature unit toggle
 * Highlights the current active page in navigation
 */
const Header = ({ currentPage }: HeaderProps) => {
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
        <UnitToggle />
      </div>
    </header>
  );
};

export default Header;
