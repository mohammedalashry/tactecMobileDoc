// services/language/languageService.ts
import I18n from 'i18n-js';
import {I18nManager} from 'react-native';
import {saveString, loadString} from '@app/utils/storage';
import {store} from '@app/redux/store';
import {setLang} from '@app/redux/slices/lang/langSlice';

// Supported languages
export const LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
  SPANISH: 'sp',
  PORTUGUESE: 'port',
};

// Languages with RTL support
const RTL_LANGUAGES = [LANGUAGES.ARABIC];

export const languageService = {
  /**
   * Get the current application language
   */
  getCurrentLanguage: async (): Promise<string> => {
    try {
      const savedLang = await loadString('lang');
      return savedLang || LANGUAGES.ENGLISH;
    } catch (error) {
      console.error('Error getting language:', error);
      return LANGUAGES.ENGLISH;
    }
  },

  /**
   * Set the application language
   *
   * @param language Language code to set (e.g., 'en', 'ar')
   */
  setLanguage: async (language: string): Promise<void> => {
    try {
      // Save to storage
      await saveString('lang', language);

      // Set in i18n
      I18n.locale = language;

      // Handle RTL
      const isRTL = RTL_LANGUAGES.includes(language);
      I18nManager.forceRTL(isRTL);

      // Update Redux state
      store.dispatch(setLang(language));

      console.log(`Language set to: ${language}, RTL: ${isRTL}`);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  },

  /**
   * Check if the current language is RTL
   */
  isRTL: (): boolean => {
    return RTL_LANGUAGES.includes(I18n.locale);
  },

  /**
   * Initialize language settings on app startup
   */
  initialize: async (): Promise<void> => {
    try {
      const currentLang = await languageService.getCurrentLanguage();
      await languageService.setLanguage(currentLang);
    } catch (error) {
      console.error('Error initializing language:', error);
      // Fallback to English
      await languageService.setLanguage(LANGUAGES.ENGLISH);
    }
  },

  /**
   * Helper function to get translated text
   */
  translate: (key: string, options?: I18n.TranslateOptions): string => {
    return key ? I18n.t(key, options) : '';
  },
};
