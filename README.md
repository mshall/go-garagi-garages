# Go Garagi — Garage App

Material Design 3 **React (Vite + TypeScript)** web dashboard for garage owners and staff. Built from `Docs/Go_Garagi_PRD.md`, `Docs/Go_Garagi_RFC.md`, and the Visily sample screens in `Docs/Sample Screens/`.

Mobile-first and responsive for **Android & iOS** browsers (safe-area padding, touch targets, bottom navigation). Domain logic under `src/domain/` is platform-agnostic for a future **React Native** port (≥70% non-UI reuse target per RFC).

## Features (MVP Garage OS)

| Area | Screens |
|---|---|
| Auth & onboarding | Login, Register garage, Select services, Pending approval |
| Operations | Dashboard KPIs, Booking inbox (accept/reject), Quote RFP board |
| Schedule | Calendar availability (available / booked / blocked / conflict) |
| Catalog | Services & pricing, Promotions manager |
| Trust & money | Reviews + respond, Earnings & payouts, Reports |
| Profile | View / edit garage profile, demo reset |

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Demo login** (pre-filled):

- Email: `khalid@alquozgarage.ae`
- Password: `demo1234`

The app loads with seeded UAE garage data (Al Quoz Auto Care): bookings, accident RFPs, services, promotions, reviews, and payouts. Use **Profile → Reset Demo Data** to restore seed state. Use **Start onboarding** on the login screen to walk through registration → pending approval → simulate admin approval.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with oxlint |

## Stack

- React 19 + Vite + TypeScript
- MUI 7 (Material Design 3 tokens / components)
- React Router 7
- Zustand (persisted local state + seed data)
- dayjs

## RN-ready layout

```
src/
  domain/       # pure types, state machines, formatters (share with RN)
  data/         # seed / test data
  store/        # Zustand store
  features/     # screen modules
  components/   # app shell / shared UI
  theme/        # MD3 theme
  navigation/   # routes
```

## Docs

- Product: `Docs/Go_Garagi_PRD.md`
- Architecture: `Docs/Go_Garagi_RFC.md`
- UI inspiration: `Docs/Sample Screens/`
