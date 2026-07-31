# Garage API module

Garage-scoped BFF for the Garage OS web app. This is the **garage bounded context** of the Go Garagi modular monolith MVP — not a platform-wide API.

## Mount paths

| Surface | Path |
|---|---|
| Web app | `/gogaragi-garage/` |
| Garage API | `/gogaragi-garage/api/` |
| Health | `/gogaragi-garage/api/v1/health` |

## Layout

```
server/
  index.ts                 # process entry
  app.ts                   # Express app; mounts garage module only
  modules/
    garage/
      router.ts            # garage auth, bookings, quotes, calendar, …
shared/
  appPaths.ts              # APP_ROOT / API_ROOT constants
```

Other audience modules (`customer`, `supplier`, `insurance`, `admin`) are intentionally **not** registered here. When the NestJS modulith lands, this folder maps to `GarageModule` at the same URL prefix.

## Run

```bash
npm run dev:api          # http://localhost:8787/gogaragi-garage/api/v1/health
npm run dev              # API + Vite (proxies /gogaragi-garage/api → :8787)
```

Env: `GARAGE_API_PORT` (default `8787`).
