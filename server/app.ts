import cors from 'cors';
import express from 'express';
import { API_ROOT, APP_ROOT } from '../shared/appPaths.ts';
import { garageRouter } from './modules/garage/router.ts';

/**
 * Garage API host process.
 * In the full modulith this becomes NestJS `GarageModule` mounted at the same path;
 * other audience modules (customer, supplier, insurance, admin) mount separately.
 */
export function createGarageApiApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      service: 'go-garagi-garage-api',
      web: APP_ROOT,
      api: API_ROOT,
      health: `${API_ROOT}/v1/health`,
    });
  });

  // Garage-only mount — do not register customer/supplier/admin routes here
  app.use(API_ROOT, garageRouter);

  return app;
}
