import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ru from './locales/ru.json';
import he from './locales/he.json';

// Translation resources
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  he: { translation: he },
};

// Initialize i18next
i18n
  // Detect user language from browser/localStorage
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize with config
  .init({
    resources,
    // Default language if detection fails
    fallbackLng: 'en',
    // Debug mode (disable in production)
    debug: false,
    // Interpolation settings
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
    // Language detection options
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Key name in localStorage
      lookupLocalStorage: 'language',
      // Cache user language in localStorage
      caches: ['localStorage'],
    },
  });

export default i18n;