import type { CSSProperties } from 'react';

/**
 * Props for Skeleton component
 */
interface SkeletonProps {
  /** Width of the skeleton (CSS value) */
  width?: string | number;
  /** Height of the skeleton (CSS value) */
  height?: string | number;
  /** Border radius (CSS value) */
  borderRadius?: string | number;
  /** Additional CSS class */
  className?: string;
  /** Make it a circle */
  circle?: boolean;
}

/**
 * Base Skeleton component with pulse animation
 * Used as a placeholder while content is loading
 */
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
  circle = false,
}: SkeletonProps) => {
  const style: CSSProperties = {
    width: circle ? height : width,
    height,
    borderRadius: circle ? '50%' : borderRadius,
  };

  return <div className={`skeleton ${className}`} style={style} />;
};

/**
 * Skeleton for text lines
 */
export const SkeletonText = ({
  lines = 1,
  width = '100%',
}: {
  lines?: number;
  width?: string | number;
}) => {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? '70%' : width}
          height="1rem"
          className="skeleton-line"
        />
      ))}
    </div>
  );
};

/**
 * Skeleton for the current weather card
 */
export const WeatherCardSkeleton = () => {
  return (
    <div className="current-weather skeleton-weather">
      {/* City info section */}
      <div className="city-info">
        <Skeleton width={40} height={40} borderRadius="50%" />
        <Skeleton width="150px" height="2rem" />
        <div className="date-time" style={{ marginLeft: 'auto' }}>
          <Skeleton width="80px" height="1.5rem" />
        </div>
      </div>

      {/* Weather info section */}
      <div className="weather-info">
        <Skeleton width="100px" height="3rem" />
        <Skeleton width={60} height={60} circle />
        <Skeleton width="120px" height="1.5rem" />
      </div>

      {/* Weather details section */}
      <div className="weather-details">
        <Skeleton width="200px" height="50px" borderRadius="8px" />
        <Skeleton width="150px" height="50px" borderRadius="8px" />
        <Skeleton width="130px" height="50px" borderRadius="8px" />
        <Skeleton width="180px" height="50px" borderRadius="8px" />
      </div>
    </div>
  );
};

/**
 * Skeleton for a single forecast item
 */
export const ForecastItemSkeleton = () => {
  return (
    <div className="forecast-item skeleton-forecast-item">
      <Skeleton width="100px" height="1rem" />
      <Skeleton width={40} height={40} circle />
      <Skeleton width="50px" height="1.5rem" />
      <Skeleton width="80px" height="1rem" />
    </div>
  );
};

/**
 * Skeleton for the 5-day forecast section
 */
export const ForecastSkeleton = () => {
  return (
    <div className="forecast">
      {Array.from({ length: 5 }).map((_, i) => (
        <ForecastItemSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Skeleton for a favorite city card
 */
export const FavoriteCardSkeleton = () => {
  return (
    <div className="favorite-card skeleton-favorite">
      <div className="favorite-header">
        <Skeleton width="120px" height="1.5rem" />
        <Skeleton width={30} height={30} borderRadius="50%" />
      </div>
      <Skeleton width="100px" height="1rem" />
      <div className="favorite-weather">
        <Skeleton width={40} height={40} circle />
        <Skeleton width="60px" height="2rem" />
        <Skeleton width="80px" height="1rem" />
      </div>
    </div>
  );
};

/**
 * Combined skeleton for full weather loading state
 */
export const WeatherPageSkeleton = () => {
  return (
    <>
      <WeatherCardSkeleton />
      <ForecastSkeleton />
    </>
  );
};

export default Skeleton;
