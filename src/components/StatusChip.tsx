import Chip from '@mui/material/Chip';
import type { BookingStatus, QuoteStatus } from '../domain/types';

const bookingColors: Record<
  BookingStatus,
  'default' | 'warning' | 'success' | 'error' | 'info' | 'primary'
> = {
  pending: 'warning',
  confirmed: 'success',
  rejected: 'error',
  rescheduled: 'info',
  awaiting_customer: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'default',
};

const quoteColors: Record<
  QuoteStatus,
  'default' | 'warning' | 'success' | 'error' | 'info' | 'primary'
> = {
  new: 'warning',
  responded: 'info',
  won: 'success',
  lost: 'error',
};

function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BookingStatusChip({ status }: { status: BookingStatus }) {
  return (
    <Chip
      size="small"
      label={labelize(status)}
      color={bookingColors[status]}
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
}

export function QuoteStatusChip({ status }: { status: QuoteStatus }) {
  return (
    <Chip
      size="small"
      label={labelize(status)}
      color={quoteColors[status]}
      variant="filled"
    />
  );
}
