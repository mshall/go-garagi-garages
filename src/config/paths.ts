import { API_ROOT, APP_ROOT } from '../../shared/appPaths';

export { API_ROOT, APP_ROOT };

/** Vite injects trailing slash, e.g. `/gogaragi-garage/` */
export const APP_BASE_URL = (import.meta.env.BASE_URL || `${APP_ROOT}/`).replace(
  /\/$/,
  '',
) || APP_ROOT;

/** Build a URL under `/gogaragi-garage/api` */
export function apiUrl(path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${API_ROOT}${normalized}`;
}
