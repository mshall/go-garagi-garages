/**
 * Garage bounded-context router — sole audience is the Garage OS web app.
 * Mounted at `/gogaragi-garage/api` as the garage slice of the future modulith.
 */
import { Router, type Request, type Response } from 'express';
import {
  DEMO_GARAGE,
  DEMO_USER,
  SEED_BOOKINGS,
  SEED_KPIS,
  SEED_PAYOUTS,
  SEED_PROMOTIONS,
  SEED_QUOTES,
  SEED_REVIEWS,
  SEED_SERVICES,
  SEED_SLOTS,
  SELECTED_CATALOG_IDS,
} from '../../../src/data/seed.ts';

export const garageRouter = Router();

function ok(res: Response, data: unknown, status = 200) {
  res.status(status).json(data);
}

function notFound(res: Response, message: string) {
  res.status(404).json({ message, module: 'garage' });
}

garageRouter.get('/v1/health', (_req, res) => {
  ok(res, {
    ok: true,
    service: 'go-garagi-garage-api',
    module: 'garage',
    audience: 'garage_owners_staff',
    note: 'Garage-scoped BFF slice of the Go Garagi modular monolith',
  });
});

garageRouter.post('/v1/auth/login', (req: Request, res: Response) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (email === DEMO_USER.email.toLowerCase() && password === 'demo1234') {
    ok(res, {
      token: 'demo-garage-token',
      user: {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        displayName: DEMO_USER.displayName,
        initials: DEMO_USER.initials,
        role: 'garage_owner',
      },
      garageId: DEMO_GARAGE.id,
    });
    return;
  }
  res.status(401).json({ message: 'Invalid credentials', module: 'garage' });
});

garageRouter.get('/v1/garage', (_req, res) => {
  ok(res, {
    garage: DEMO_GARAGE,
    selectedCatalogIds: SELECTED_CATALOG_IDS,
  });
});

garageRouter.get('/v1/bookings', (req, res) => {
  const status = req.query.status ? String(req.query.status) : undefined;
  const bookings = status
    ? SEED_BOOKINGS.filter((b) => b.status === status)
    : SEED_BOOKINGS;
  ok(res, { bookings });
});

garageRouter.get('/v1/bookings/:id', (req, res) => {
  const booking = SEED_BOOKINGS.find((b) => b.id === req.params.id);
  if (!booking) {
    notFound(res, `Booking ${req.params.id} not found`);
    return;
  }
  ok(res, { booking });
});

garageRouter.get('/v1/quotes', (req, res) => {
  const status = req.query.status ? String(req.query.status) : undefined;
  const quotes = status
    ? SEED_QUOTES.filter((q) => q.status === status)
    : SEED_QUOTES;
  ok(res, { quotes });
});

garageRouter.get('/v1/services', (_req, res) => {
  ok(res, { services: SEED_SERVICES });
});

garageRouter.get('/v1/calendar/slots', (_req, res) => {
  ok(res, { slots: SEED_SLOTS });
});

garageRouter.get('/v1/reviews', (_req, res) => {
  ok(res, { reviews: SEED_REVIEWS });
});

garageRouter.get('/v1/payouts', (_req, res) => {
  ok(res, { payouts: SEED_PAYOUTS });
});

garageRouter.get('/v1/promotions', (_req, res) => {
  ok(res, { promotions: SEED_PROMOTIONS });
});

garageRouter.get('/v1/kpis', (_req, res) => {
  ok(res, { kpis: SEED_KPIS });
});

/** Explicitly reject non-garage platform routes if mistargeted here */
garageRouter.use((_req, res) => {
  res.status(404).json({
    message: 'Not found in garage API module',
    module: 'garage',
    hint: 'This BFF only serves Garage OS. Other audiences mount their own modules.',
  });
});
