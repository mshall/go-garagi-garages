/** Pure booking state transitions — reusable in React Native */

import type { BookingStatus } from './types';

const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled', 'awaiting_customer', 'rescheduled'],
  confirmed: ['rescheduled', 'awaiting_customer', 'in_progress', 'cancelled'],
  rescheduled: ['confirmed', 'awaiting_customer', 'cancelled'],
  awaiting_customer: ['confirmed', 'pending', 'cancelled', 'rejected'],
  in_progress: ['completed'],
  completed: [],
  rejected: [],
  cancelled: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function nextStatuses(from: BookingStatus): BookingStatus[] {
  return transitions[from] ?? [];
}
