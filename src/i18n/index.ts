import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar';
import de from './locales/de';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import ru from './locales/ru';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', dir: 'ltr' as const },
  { code: 'ar', dir: 'rtl' as const },
  { code: 'es', dir: 'ltr' as const },
  { code: 'fr', dir: 'ltr' as const },
  { code: 'ru', dir: 'ltr' as const },
  { code: 'de', dir: 'ltr' as const },
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function isRtlLanguage(lang: string): boolean {
  return lang === 'ar';
}

const stored =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('go-garagi-lang')
    : null;

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    es: { translation: es },
    fr: { translation: fr },
    ru: { translation: ru },
    de: { translation: de },
  },
  lng: stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored) ? stored : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export async function setAppLanguage(lang: AppLanguage) {
  localStorage.setItem('go-garagi-lang', lang);
  await i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtlLanguage(lang) ? 'rtl' : 'ltr';
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = isRtlLanguage(i18n.language) ? 'rtl' : 'ltr';
}

export default i18n;
