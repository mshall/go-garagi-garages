/** Pure booking state transitions — reusable in React Native */

import type { BookingStatus } from './types';

const transitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['rescheduled', 'in_progress', 'cancelled'],
  rescheduled: ['confirmed', 'cancelled'],
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
