import { apiUrl } from '../config/paths';

export class GarageApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'GarageApiError';
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    throw new GarageApiError(
      (data as { message?: string } | null)?.message ?? res.statusText,
      res.status,
      data,
    );
  }
  return data as T;
}

/** Garage-scoped BFF client — paths are relative to `/gogaragi-garage/api` */
export const garageApi = {
  health: () =>
    request<{ ok: boolean; module: string; service: string }>('/v1/health'),
  getGarage: () => request('/v1/garage'),
  getBookings: () => request('/v1/bookings'),
  getQuotes: () => request('/v1/quotes'),
  getServices: () => request('/v1/services'),
  getSlots: () => request('/v1/calendar/slots'),
  getReviews: () => request('/v1/reviews'),
  getPayouts: () => request('/v1/payouts'),
  getPromotions: () => request('/v1/promotions'),
  getKpis: () => request('/v1/kpis'),
  login: (email: string, password: string) =>
    request<{
      token: string;
      garageId: string;
      user: {
        id: string;
        email: string;
        displayName: string;
        initials: string;
        role: string;
      };
    }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
