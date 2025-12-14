import { FaThermometerHalf } from 'react-icons/fa';
import { useTemperature } from '../contexts/TemperatureContext';

/**
 * Toggle button for switching between Celsius and Fahrenheit
 * Uses TemperatureContext for state management
 */
const UnitToggle = () => {
  const { isCelsius, toggleUnit } = useTemperature();

  return (
    <button className="unit-toggle" onClick={toggleUnit} aria-label="Toggle temperature unit">
      <FaThermometerHalf />
      <span>{isCelsius ? '°C' : '°F'}</span>
    </button>
  );
};

export default UnitToggle;
