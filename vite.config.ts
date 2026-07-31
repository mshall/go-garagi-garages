import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { API_ROOT, APP_ROOT } from './shared/appPaths.ts';

const garageApiTarget = `http://localhost:${process.env.GARAGE_API_PORT || 8787}`;

/** Redirect bare `/` → `/gogaragi-garage/` during local dev/preview */
function rootRedirectPlugin(): Plugin {
  return {
    name: 'gogaragi-root-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.statusCode = 302;
          res.setHeader('Location', `${APP_ROOT}/`);
          res.end();
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.statusCode = 302;
          res.setHeader('Location', `${APP_ROOT}/`);
          res.end();
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: `${APP_ROOT}/`,
  plugins: [react(), rootRedirectPlugin()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      [API_ROOT]: {
        target: garageApiTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
    proxy: {
      [API_ROOT]: {
        target: garageApiTarget,
        changeOrigin: true,
      },
    },
  },
});
