import './styles/App.css';
import './styles/HomePage.css';
import './styles/FavoritesPage.css';
import './styles/Header.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { TemperatureProvider } from './contexts/TemperatureContext';

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus (optional, can be enabled)
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Main application component
 * Sets up routing, React Query, and global providers
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <FavoritesProvider>
          <TemperatureProvider>
            <div className="app">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
              </ErrorBoundary>
              <Toaster position="top-right" />
            </div>
          </TemperatureProvider>
        </FavoritesProvider>
      </Router>
      {/* DevTools - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
