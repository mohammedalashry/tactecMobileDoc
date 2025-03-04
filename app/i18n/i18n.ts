// i18n/i18n.ts
import i18n from 'i18n-js';
import en from './en.json';
import ar from './ar.json';
import sp from './sp.json';
import port from './port.json';

// Setup i18n with translations
i18n.fallbacks = true;
i18n.translations = {en, ar, sp, port};
i18n.defaultLocale = 'en';

// Set default locale (will be updated on app init)
i18n.locale = 'en';

/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof en;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

export default i18n;
