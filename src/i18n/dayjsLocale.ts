import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/de';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/ru';

const DAYJS_LOCALES: Record<string, string> = {
  en: 'en',
  ar: 'ar',
  es: 'es',
  fr: 'fr',
  ru: 'ru',
  de: 'de',
};

export function syncDayjsLocale(lang: string) {
  dayjs.locale(DAYJS_LOCALES[lang] ?? 'en');
}
