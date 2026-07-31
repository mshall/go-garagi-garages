/** Pure notification builders — reusable in React Native */

import dayjs from 'dayjs';
import type { Booking, QuoteRequest, Review } from './types';

export type NotificationType = 'booking' | 'reminder' | 'quote' | 'review';

export interface AppNotification {
  id: string;
  type: NotificationType;
  createdAt: string;
  path: string;
  /** i18n key under notifications.* */
  titleKey: 'pendingBooking' | 'upcomingReminder' | 'newQuote' | 'newReview';
  detailKey:
    | 'pendingBookingDetail'
    | 'upcomingReminderDetail'
    | 'newQuoteDetail'
    | 'newReviewDetail';
  params: Record<string, string | number>;
}

export function buildNotifications(input: {
  bookings: Booking[];
  quotes: QuoteRequest[];
  reviews: Review[];
  now?: dayjs.Dayjs;
}): AppNotification[] {
  const now = input.now ?? dayjs();
  const items: AppNotification[] = [];

  for (const booking of input.bookings) {
    if (booking.status === 'pending') {
      items.push({
        id: `booking-pending-${booking.id}`,
        type: 'booking',
        createdAt: booking.scheduledAt,
        path: '/bookings',
        titleKey: 'pendingBooking',
        detailKey: 'pendingBookingDetail',
        params: {
          name: booking.customerName,
          service: booking.serviceName,
        },
      });
    }

    if (
      (booking.status === 'confirmed' || booking.status === 'pending') &&
      dayjs(booking.scheduledAt).isSame(now, 'day')
    ) {
      // Reminder for today's upcoming (or in-progress day) appointments
      if (
        booking.status === 'confirmed' ||
        dayjs(booking.scheduledAt).isAfter(now.subtract(1, 'minute'))
      ) {
        items.push({
          id: `reminder-${booking.id}`,
          type: 'reminder',
          createdAt: booking.scheduledAt,
          path: '/bookings',
          titleKey: 'upcomingReminder',
          detailKey: 'upcomingReminderDetail',
          params: {
            name: booking.customerName,
            service: booking.serviceName,
            time: dayjs(booking.scheduledAt).format('h:mm A'),
          },
        });
      }
    }
  }

  for (const quote of input.quotes) {
    if (quote.status === 'new') {
      items.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        createdAt: quote.submittedAt,
        path: '/quotes',
        titleKey: 'newQuote',
        detailKey: 'newQuoteDetail',
        params: {
          id: quote.id,
          vehicle: quote.vehicle,
          summary: quote.damageSummary.slice(0, 80),
        },
      });
    }
  }

  for (const review of input.reviews) {
    if (!review.response) {
      items.push({
        id: `review-${review.id}`,
        type: 'review',
        createdAt: review.createdAt,
        path: '/reviews',
        titleKey: 'newReview',
        detailKey: 'newReviewDetail',
        params: {
          name: review.customerName,
          rating: review.rating,
          service: review.serviceName,
        },
      });
    }
  }

  return items.sort(
    (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
  );
}
