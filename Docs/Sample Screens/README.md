# Sample Screens — Garage App (Visily)

Visily mockups that informed the Garage OS web prototype in this repo. Product mapping lives in `Docs/Go_Garagi_PRD.md` §11; architecture in `Docs/Go_Garagi_RFC.md`.

## Contents

| Path | Description |
|---|---|
| `visily-multiscreens/` | Individual PNG frames |
| `visily-multiscreens.zip` | Same frames as a zip archive |

## File → screen map

| Visily file | App screen (PRD ID) | Route / surface |
|---|---|---|
| `visily-gogarage-dashboard-home.png` | G3 Dashboard | `/` |
| `visily-gogarage-booking-inbox.png` | G4 Booking Inbox | `/bookings` |
| `visily-gogarage-reject-booking-modal.png` | G4 Reject flow | `/bookings/:id/reject` |
| `visily-gogarage-calendar-availability.png` | G6 Calendar | `/calendar` |
| `visily-gogarage-services-&-pricing-manager.png` | G7 Services | `/services` |
| `visily-gogarage-promotions-manager.png` | G8 Promotions | `/promotions` |
| `visily-gogarage-edit-garage-profile.png` | G12 Edit profile | `/profile/edit` |
| `visily-gogarage-garage-profile-setup.png` | G12 Profile | `/profile` |
| `visily-gogarage-garage-registration-step-1.png` | G2 Onboarding step 1 | `/onboarding` |
| `visily-gogarage-select-services-offered.png` | G2 Onboarding step 2 | `/onboarding` |
| `visily-gogarage-onboarding.png` | G2 Onboarding (alt) | `/onboarding` |
| `visily-gogarage-pending-approval.png` | G2 Pending approval | `/pending-approval` |

## Implemented beyond these mockups

The shipped Garage app also includes surfaces not present as Visily frames:

- Quote RFP board (`/quotes`)
- Reviews (`/reviews`)
- Earnings & payouts with filters (`/earnings`)
- Reports + charts (`/reports`)
- Conflict resolve + **calendar suggest picker** dialogs
- In-app notification inbox + language switcher (EN/AR/ES/FR/RU/DE, Arabic RTL)

Treat the PNGs as visual inspiration; the PRD §11 inventory and the running app are the source of truth for scope.
