import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
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

export function BookingStatusChip({ status }: { status: BookingStatus }) {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      label={t(`status.booking.${status}`)}
      color={bookingColors[status]}
      variant="filled"
      sx={{ fontWeight: 600 }}
    />
  );
}

export function QuoteStatusChip({ status }: { status: QuoteStatus }) {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      label={t(`status.quote.${status}`)}
      color={quoteColors[status]}
      variant="filled"
    />
  );
}
