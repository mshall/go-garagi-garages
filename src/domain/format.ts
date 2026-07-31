/** Locale-aware formatters — shared with future RN app */

import i18n from 'i18next';

export function formatAed(amount: number): string {
  const lang = i18n.language || 'en';
  const locale =
    lang === 'ar'
      ? 'ar-AE'
      : lang === 'es'
        ? 'es'
        : lang === 'fr'
          ? 'fr'
          : lang === 'ru'
            ? 'ru'
            : lang === 'de'
              ? 'de'
              : 'en-AE';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return i18n.t('format.minutes', { count: minutes });
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) {
    return h === 1 ? i18n.t('format.hour') : i18n.t('format.hours', { count: h });
  }
  return h === 1
    ? i18n.t('format.hourMinutes', { minutes: m })
    : i18n.t('format.hoursMinutes', { hours: h, minutes: m });
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
