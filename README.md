# Go Garagi — Garage App

Material Design 3 **React (Vite + TypeScript)** web dashboard for garage owners and staff, plus a **garage-scoped API** module for the modular-monolith MVP.

Built from `Docs/Go_Garagi_PRD.md`, `Docs/Go_Garagi_RFC.md`, and Visily samples in `Docs/Sample Screens/`.

## URLs (local)

| Surface | URL |
|---|---|
| Web app | http://localhost:5173/gogaragi-garage/ |
| Garage API | http://localhost:5173/gogaragi-garage/api/ (proxied) |
| API direct | http://localhost:8787/gogaragi-garage/api/v1/health |

Bare `http://localhost:5173/` redirects to `/gogaragi-garage/`.

## Features (MVP Garage OS)

| Area | Screens |
|---|---|
| Auth & onboarding | Login, Register garage, Select services, Pending approval |
| Operations | Dashboard KPIs, Booking inbox (accept / reject / suggest time), Quote RFP board |
| Schedule | Calendar availability (available / booked / blocked / conflict) + suggest picker |
| Catalog | Services & pricing, Promotions manager |
| Trust & money | Reviews + respond, Earnings & payouts (filters), Reports (charts) |
| Notifications | In-app inbox (pending bookings, reminders, quotes, reviews) |
| Localization | EN / AR / ES / FR / RU / DE · Arabic RTL |
| Profile | View / edit garage profile, demo reset |

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173/gogaragi-garage/**.

**Demo login** (pre-filled):

- Email: `khalid@alquozgarage.ae`
- Password: `demo1234`

Login hits `POST /gogaragi-garage/api/v1/auth/login`, then hydrates the local Zustand demo store. Use **Profile → Reset Demo Data** to restore seed state.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Garage API + Vite web (recommended) |
| `npm run dev:web` | Vite only |
| `npm run dev:api` | Garage API only (`:8787`) |
| `npm run build` | Typecheck + production web build |
| `npm run preview` | Preview production build |
| `npm run start:api` | Run API without watch |
| `npm run lint` | Lint with oxlint |

## Stack

- React 19 + Vite + TypeScript
- MUI 7 (Material Design 3)
- React Router 7 (`basename=/gogaragi-garage`)
- Zustand (persisted demo state)
- Express garage API module (`server/modules/garage`)
- i18next (EN / AR / ES / FR / RU / DE + RTL)
- dayjs (locale-synced)

## Modular monolith note

This repo hosts only the **garage** audience slice:

- Web: `/gogaragi-garage/`
- API: `/gogaragi-garage/api/` → `server/modules/garage`

Customer / supplier / insurance / admin modules will mount under their own roots in the shared NestJS modulith later. See `server/README.md`.

## RN-ready layout

```
src/
  api/          # garage BFF client
  config/       # APP_ROOT / API_ROOT helpers
  domain/       # pure types, machines, availability (share with RN)
  data/         # seed / test data
  store/        # Zustand store
  features/     # screen modules
  components/   # app shell / shared UI
  i18n/         # locale resources
  theme/        # MD3 theme
  navigation/   # routes
server/
  modules/garage/   # garage-only Express router
shared/
  appPaths.ts       # shared mount constants
```

## Docs

- Product: `Docs/Go_Garagi_PRD.md` (v1.1)
- Architecture: `Docs/Go_Garagi_RFC.md` (v1.1)
- UI inspiration: `Docs/Sample Screens/`
- Garage API: `server/README.md`
