import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TemperatureContextValue } from '../types';

// Create context with undefined default (will be provided by Provider)
const TemperatureContext = createContext<TemperatureContextValue | undefined>(undefined);

// Props for the Provider component
interface TemperatureProviderProps {
  children: ReactNode;
}

/**
 * Provider component for temperature unit state
 * Manages Celsius/Fahrenheit toggle and conversion
 */
export const TemperatureProvider = ({ children }: TemperatureProviderProps) => {
  const [isCelsius, setIsCelsius] = useState(true);

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = useCallback(() => {
    setIsCelsius((prev) => !prev);
  }, []);

  // Convert Celsius to Fahrenheit if needed
  const convertTemp = useCallback(
    (celsius: number): number => {
      if (isCelsius) return celsius;
      return (celsius * 9) / 5 + 32;
    },
    [isCelsius]
  );

  const value: TemperatureContextValue = {
    isCelsius,
    toggleUnit,
    convertTemp,
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};

/**
 * Hook to access temperature context
 * @throws Error if used outside of TemperatureProvider
 */
export const useTemperature = (): TemperatureContextValue => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};
