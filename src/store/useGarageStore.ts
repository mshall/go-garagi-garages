import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
} from '../data/seed';
import { canTransition } from '../domain/bookingMachine';
import { canQuoteTransition } from '../domain/quoteMachine';
import type {
  AuthUser,
  Booking,
  CalendarSlot,
  DashboardKpis,
  GarageProfile,
  GarageStatus,
  Payout,
  Promotion,
  QuoteRequest,
  Review,
  ServiceOffering,
  SlotStatus,
} from '../domain/types';

interface GarageState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  garage: GarageProfile;
  selectedCatalogIds: string[];
  services: ServiceOffering[];
  bookings: Booking[];
  quotes: QuoteRequest[];
  reviews: Review[];
  payouts: Payout[];
  promotions: Promotion[];
  slots: CalendarSlot[];
  kpis: DashboardKpis;
  readNotificationIds: string[];

  login: (email: string, _password: string) => boolean;
  logout: () => void;
  completeOnboarding: (profile: Partial<GarageProfile>, catalogIds: string[]) => void;
  setGarageStatus: (status: GarageStatus) => void;
  updateGarage: (patch: Partial<GarageProfile>) => void;

  acceptBooking: (id: string) => void;
  rejectBooking: (id: string, reason: string) => void;
  completeBooking: (id: string) => void;

  submitQuote: (
    id: string,
    quote: { priceAed: number; etaDays: number; pickup: boolean; notes: string },
  ) => void;

  addService: (service: Omit<ServiceOffering, 'id'>) => void;
  updateService: (id: string, patch: Partial<ServiceOffering>) => void;
  deleteService: (id: string) => void;

  respondToReview: (id: string, response: string) => void;

  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  deletePromotion: (id: string) => void;

  toggleSlot: (date: string, hour: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
  resetDemoData: () => void;
}

const initialState = {
  user: null as AuthUser | null,
  isAuthenticated: false,
  onboardingComplete: true,
  garage: DEMO_GARAGE,
  selectedCatalogIds: SELECTED_CATALOG_IDS,
  services: SEED_SERVICES,
  bookings: SEED_BOOKINGS,
  quotes: SEED_QUOTES,
  reviews: SEED_REVIEWS,
  payouts: SEED_PAYOUTS,
  promotions: SEED_PROMOTIONS,
  slots: SEED_SLOTS,
  kpis: SEED_KPIS,
  readNotificationIds: [] as string[],
};

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (email, _password) => {
        void _password;
        set({
          user: { ...DEMO_USER, email: email || DEMO_USER.email },
          isAuthenticated: true,
        });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      completeOnboarding: (profile, catalogIds) => {
        set((s) => ({
          garage: {
            ...s.garage,
            ...profile,
            status: 'pending',
            submittedOn: new Date().toISOString().slice(0, 10),
          },
          selectedCatalogIds: catalogIds,
          onboardingComplete: true,
        }));
      },

      setGarageStatus: (status) =>
        set((s) => ({ garage: { ...s.garage, status } })),

      updateGarage: (patch) =>
        set((s) => ({ garage: { ...s.garage, ...patch } })),

      acceptBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking || !canTransition(booking.status, 'confirmed')) return;
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'confirmed' } : b,
          ),
          kpis: {
            ...s.kpis,
            pendingBookings: Math.max(0, s.kpis.pendingBookings - 1),
          },
        }));
      },

      rejectBooking: (id, reason) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking || !canTransition(booking.status, 'rejected')) return;
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id
              ? { ...b, status: 'rejected', rejectionReason: reason }
              : b,
          ),
          kpis: {
            ...s.kpis,
            pendingBookings: Math.max(0, s.kpis.pendingBookings - 1),
          },
        }));
      },

      completeBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking) return;
        if (
          !canTransition(booking.status, 'completed') &&
          booking.status !== 'confirmed'
        )
          return;
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'completed' } : b,
          ),
        }));
      },

      submitQuote: (id, quote) => {
        const q = get().quotes.find((x) => x.id === id);
        if (!q || !canQuoteTransition(q.status, 'responded')) return;
        set((s) => ({
          quotes: s.quotes.map((x) =>
            x.id === id ? { ...x, status: 'responded', myQuote: quote } : x,
          ),
        }));
      },

      addService: (service) =>
        set((s) => ({
          services: [
            ...s.services,
            { ...service, id: `svc-${Date.now()}` },
          ],
        })),

      updateService: (id, patch) =>
        set((s) => ({
          services: s.services.map((svc) =>
            svc.id === id ? { ...svc, ...patch } : svc,
          ),
        })),

      deleteService: (id) =>
        set((s) => ({
          services: s.services.filter((svc) => svc.id !== id),
        })),

      respondToReview: (id, response) =>
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === id ? { ...r, response } : r,
          ),
        })),

      addPromotion: (promo) =>
        set((s) => ({
          promotions: [
            ...s.promotions,
            { ...promo, id: `promo-${Date.now()}` },
          ],
        })),

      deletePromotion: (id) =>
        set((s) => ({
          promotions: s.promotions.filter((p) => p.id !== id),
        })),

      toggleSlot: (date, hour) =>
        set((s) => ({
          slots: s.slots.map((slot) => {
            if (slot.date !== date || slot.hour !== hour) return slot;
            if (slot.status === 'booked' || slot.status === 'conflict')
              return slot;
            const next: SlotStatus =
              slot.status === 'available' ? 'blocked' : 'available';
            return { ...slot, status: next };
          }),
        })),

      markNotificationRead: (id) =>
        set((s) =>
          s.readNotificationIds.includes(id)
            ? s
            : { readNotificationIds: [...s.readNotificationIds, id] },
        ),

      markAllNotificationsRead: (ids) =>
        set((s) => ({
          readNotificationIds: Array.from(
            new Set([...s.readNotificationIds, ...ids]),
          ),
        })),

      resetDemoData: () =>
        set({
          ...initialState,
          user: DEMO_USER,
          isAuthenticated: true,
          onboardingComplete: true,
        }),
    }),
    {
      name: 'go-garagi-garage-v3',
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        onboardingComplete: s.onboardingComplete,
        garage: s.garage,
        selectedCatalogIds: s.selectedCatalogIds,
        services: s.services,
        bookings: s.bookings,
        quotes: s.quotes,
        reviews: s.reviews,
        payouts: s.payouts,
        promotions: s.promotions,
        slots: s.slots,
        kpis: s.kpis,
        readNotificationIds: s.readNotificationIds,
      }),
    },
  ),
);
