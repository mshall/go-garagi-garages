import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
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
import {
  bookingSlotParts,
  findConflicts,
  rebuildSlots,
  slotKey,
} from '../domain/availability';
import { canTransition } from '../domain/bookingMachine';
import { canQuoteTransition } from '../domain/quoteMachine';
import type {
  AuthUser,
  BlockReason,
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
} from '../domain/types';

function withSyncedSlots(bookings: Booking[], slots: CalendarSlot[]) {
  return rebuildSlots(slots, bookings);
}

function toIso(date: string, hour: number) {
  return dayjs(`${date}T${String(hour).padStart(2, '0')}:00:00+04:00`).toISOString();
}

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

  acceptBooking: (id: string, opts?: { forceDespiteConflict?: boolean }) => boolean;
  rejectBooking: (id: string, reason: string) => void;
  completeBooking: (id: string) => void;
  suggestBookingTime: (id: string, newIso: string) => void;
  moveBooking: (
    id: string,
    newIso: string,
    mode: 'notify_customer' | 'direct_confirm',
  ) => void;
  /** Demo helper: simulate customer accepting a proposed time */
  customerConfirmProposedTime: (id: string) => void;
  resolveConflictAcceptBoth: (date: string, hour: number) => void;
  resolveConflictReschedule: (
    bookingId: string,
    newIso: string,
    notifyCustomer: boolean,
  ) => void;

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

  blockSlot: (
    date: string,
    hour: number,
    reason: BlockReason,
    opts?: { bookingId?: string; note?: string },
  ) => void;
  unblockSlot: (date: string, hour: number) => void;
  getConflictsForBooking: (bookingId: string) => Booking[];

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

      getConflictsForBooking: (bookingId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return [];
        const { date, hour } = bookingSlotParts(
          booking.proposedAt || booking.scheduledAt,
        );
        return findConflicts(get().bookings, date, hour, bookingId);
      },

      acceptBooking: (id, opts) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking) return false;
        if (
          booking.status !== 'pending' &&
          booking.status !== 'awaiting_customer' &&
          booking.status !== 'rescheduled'
        ) {
          if (!canTransition(booking.status, 'confirmed')) return false;
        }

        const when = booking.proposedAt || booking.scheduledAt;
        const { date, hour } = bookingSlotParts(when);
        const conflicts = findConflicts(get().bookings, date, hour, id);
        if (conflicts.length > 0 && !opts?.forceDespiteConflict) {
          return false;
        }

        set((s) => {
          const bookings = s.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: 'confirmed' as const,
                  scheduledAt: when,
                  proposedAt: undefined,
                  notifyCustomerPending: false,
                  lastCustomerNotice: undefined,
                }
              : b,
          );
          return {
            bookings,
            slots: withSyncedSlots(bookings, s.slots),
            kpis: {
              ...s.kpis,
              pendingBookings: Math.max(0, s.kpis.pendingBookings - 1),
            },
          };
        });
        return true;
      },

      rejectBooking: (id, reason) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking || !canTransition(booking.status, 'rejected')) return;
        set((s) => {
          const bookings = s.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: 'rejected' as const,
                  rejectionReason: reason,
                  proposedAt: undefined,
                }
              : b,
          );
          return {
            bookings,
            slots: withSyncedSlots(bookings, s.slots),
            kpis: {
              ...s.kpis,
              pendingBookings: Math.max(0, s.kpis.pendingBookings - 1),
            },
          };
        });
      },

      completeBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking) return;
        if (
          !canTransition(booking.status, 'completed') &&
          booking.status !== 'confirmed'
        )
          return;
        set((s) => {
          const bookings = s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'completed' as const } : b,
          );
          return { bookings, slots: withSyncedSlots(bookings, s.slots) };
        });
      },

      suggestBookingTime: (id, newIso) => {
        set((s) => {
          const bookings = s.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: 'awaiting_customer' as const,
                  proposedAt: newIso,
                  notifyCustomerPending: true,
                  lastCustomerNotice: {
                    kind: 'suggested' as const,
                    at: newIso,
                  },
                }
              : b,
          );
          return { bookings, slots: withSyncedSlots(bookings, s.slots) };
        });
      },

      moveBooking: (id, newIso, mode) => {
        set((s) => {
          const bookings = s.bookings.map((b) => {
            if (b.id !== id) return b;
            if (mode === 'direct_confirm') {
              return {
                ...b,
                status: 'confirmed' as const,
                scheduledAt: newIso,
                proposedAt: undefined,
                notifyCustomerPending: true,
                lastCustomerNotice: {
                  kind: 'moved' as const,
                  at: newIso,
                },
              };
            }
            return {
              ...b,
              status: 'awaiting_customer' as const,
              proposedAt: newIso,
              notifyCustomerPending: true,
              lastCustomerNotice: {
                kind: 'proposed' as const,
                at: newIso,
              },
            };
          });
          return { bookings, slots: withSyncedSlots(bookings, s.slots) };
        });
      },

      customerConfirmProposedTime: (id) => {
        const booking = get().bookings.find((b) => b.id === id);
        if (!booking?.proposedAt) return;
        set((s) => {
          const bookings = s.bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: 'confirmed' as const,
                  scheduledAt: b.proposedAt!,
                  proposedAt: undefined,
                  notifyCustomerPending: false,
                  lastCustomerNotice: {
                    kind: 'customerConfirmed' as const,
                  },
                }
              : b,
          );
          return { bookings, slots: withSyncedSlots(bookings, s.slots) };
        });
      },

      resolveConflictAcceptBoth: (date, hour) => {
        set((s) => {
          const bookings = s.bookings.map((b) => {
            const parts = bookingSlotParts(b.proposedAt || b.scheduledAt);
            if (
              parts.date === date &&
              parts.hour === hour &&
              (b.status === 'pending' || b.status === 'awaiting_customer')
            ) {
              return {
                ...b,
                status: 'confirmed' as const,
                scheduledAt: b.proposedAt || b.scheduledAt,
                proposedAt: undefined,
                lastCustomerNotice: {
                  kind: 'conflictAccepted' as const,
                },
              };
            }
            return b;
          });
          return { bookings, slots: withSyncedSlots(bookings, s.slots) };
        });
      },

      resolveConflictReschedule: (bookingId, newIso, notifyCustomer) => {
        if (notifyCustomer) get().suggestBookingTime(bookingId, newIso);
        else get().moveBooking(bookingId, newIso, 'direct_confirm');
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
          services: [...s.services, { ...service, id: `svc-${Date.now()}` }],
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

      blockSlot: (date, hour, reason, opts) => {
        set((s) => {
          const key = slotKey(date, hour);
          let slots = [...s.slots];
          const idx = slots.findIndex(
            (sl) => sl.date === date && sl.hour === hour,
          );
          const nextSlot: CalendarSlot = {
            date,
            hour,
            status: 'blocked',
            blockReason: reason,
            bookingIds: opts?.bookingId ? [opts.bookingId] : [],
            note: opts?.note,
          };
          if (idx >= 0) slots[idx] = nextSlot;
          else slots.push(nextSlot);

          let bookings = s.bookings;
          if (reason === 'booking' && opts?.bookingId) {
            const iso = toIso(date, hour);
            bookings = s.bookings.map((b) =>
              b.id === opts.bookingId
                ? { ...b, scheduledAt: iso, status: 'confirmed' as const }
                : b,
            );
          }

          // Preserve general blocks through rebuild
          slots = withSyncedSlots(bookings, slots).map((sl) => {
            if (slotKey(sl.date, sl.hour) === key && reason === 'general') {
              return {
                ...sl,
                status: 'blocked',
                blockReason: 'general',
                note: opts?.note,
              };
            }
            return sl;
          });

          return { slots, bookings };
        });
      },

      unblockSlot: (date, hour) => {
        set((s) => {
          const slots = s.slots.map((sl) =>
            sl.date === date && sl.hour === hour
              ? {
                  ...sl,
                  status: 'available' as const,
                  blockReason: undefined,
                  note: undefined,
                  bookingIds: [],
                }
              : sl,
          );
          return { slots: withSyncedSlots(s.bookings, slots) };
        });
      },

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
      name: 'go-garagi-garage-v6',
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
