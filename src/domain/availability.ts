/** Pure availability helpers — shared with future Customer (RN) app */

import dayjs from 'dayjs';
import type { Booking, CalendarSlot, SlotStatus } from './types';

export interface CustomerVisibleSlot {
  date: string;
  hour: number;
  status: 'available' | 'busy' | 'conflict_allowed';
  /** Customer may still request this slot; garage must confirm */
  canRequest: boolean;
  bookingCount: number;
}

export function slotKey(date: string, hour: number): string {
  return `${date}-${hour}`;
}

export function bookingSlotParts(iso: string): { date: string; hour: number } {
  const d = dayjs(iso);
  return { date: d.format('YYYY-MM-DD'), hour: d.hour() };
}

export function activeCalendarBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) =>
    ['confirmed', 'pending', 'awaiting_customer', 'rescheduled', 'in_progress'].includes(
      b.status,
    ),
  );
}

export function bookingsAtSlot(
  bookings: Booking[],
  date: string,
  hour: number,
): Booking[] {
  return activeCalendarBookings(bookings).filter((b) => {
    const parts = bookingSlotParts(b.proposedAt || b.scheduledAt);
    return parts.date === date && parts.hour === hour;
  });
}

export function findConflicts(
  bookings: Booking[],
  date: string,
  hour: number,
  excludeBookingId?: string,
): Booking[] {
  return bookingsAtSlot(bookings, date, hour).filter(
    (b) => b.id !== excludeBookingId,
  );
}

export function hasConflict(
  bookings: Booking[],
  date: string,
  hour: number,
  excludeBookingId?: string,
): boolean {
  return findConflicts(bookings, date, hour, excludeBookingId).length > 0;
}

/** Build customer-visible calendar from garage slots + bookings */
export function getCustomerVisibleAvailability(
  slots: CalendarSlot[],
  bookings: Booking[],
): CustomerVisibleSlot[] {
  return slots.map((slot) => {
    const at = bookingsAtSlot(bookings, slot.date, slot.hour);
    const busy =
      slot.status === 'booked' ||
      slot.status === 'blocked' ||
      slot.status === 'conflict' ||
      at.length > 0;

    return {
      date: slot.date,
      hour: slot.hour,
      status: !busy
        ? 'available'
        : at.length > 1 || slot.status === 'conflict'
          ? 'conflict_allowed'
          : 'busy',
      // Customers can select even busy/conflict slots; garage confirms later
      canRequest: slot.status !== 'blocked' || slot.blockReason === 'booking',
      bookingCount: at.length,
    };
  });
}

export function deriveSlotStatus(
  date: string,
  hour: number,
  bookings: Booking[],
  existing?: CalendarSlot,
): SlotStatus {
  if (existing?.status === 'blocked' && existing.blockReason === 'general') {
    return 'blocked';
  }
  const at = bookingsAtSlot(bookings, date, hour);
  if (at.length > 1) return 'conflict';
  if (at.length === 1) {
    const b = at[0];
    if (b.customerRequestedDespiteConflict && b.status === 'pending') {
      return 'conflict';
    }
    if (
      b.status === 'confirmed' ||
      b.status === 'in_progress' ||
      b.status === 'pending' ||
      b.status === 'awaiting_customer' ||
      b.status === 'rescheduled'
    ) {
      return 'booked';
    }
  }
  if (existing?.status === 'blocked') return 'blocked';
  return 'available';
}

export function rebuildSlots(
  slots: CalendarSlot[],
  bookings: Booking[],
): CalendarSlot[] {
  const map = new Map(slots.map((s) => [slotKey(s.date, s.hour), s]));
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const dates = new Set(slots.map((s) => s.date));
  for (const b of activeCalendarBookings(bookings)) {
    dates.add(bookingSlotParts(b.proposedAt || b.scheduledAt).date);
  }

  const next: CalendarSlot[] = [];
  for (const date of Array.from(dates).sort()) {
    for (const hour of hours) {
      const key = slotKey(date, hour);
      const existing = map.get(key);
      const at = bookingsAtSlot(bookings, date, hour);
      const status = deriveSlotStatus(date, hour, bookings, existing);
      next.push({
        date,
        hour,
        status,
        blockReason:
          status === 'blocked'
            ? existing?.blockReason ?? 'general'
            : status === 'booked'
              ? 'booking'
              : undefined,
        bookingIds: at.map((b) => b.id),
        note: existing?.note,
      });
    }
  }
  return next;
}

export function listSuggestableSlots(
  slots: CalendarSlot[],
  bookings: Booking[],
  fromDate?: string,
): { date: string; hour: number; label: string }[] {
  const start = dayjs(fromDate || '2026-08-01');
  return slots
    .filter((s) => {
      const d = dayjs(`${s.date}T${String(s.hour).padStart(2, '0')}:00:00`);
      if (d.isBefore(start)) return false;
      return (
        s.status === 'available' ||
        (s.status !== 'blocked' &&
          bookingsAtSlot(bookings, s.date, s.hour).length === 0)
      );
    })
    .slice(0, 24)
    .map((s) => ({
      date: s.date,
      hour: s.hour,
      label: dayjs(`${s.date}T${String(s.hour).padStart(2, '0')}:00:00`).format(
        'ddd D MMM · h:mm A',
      ),
    }));
}
