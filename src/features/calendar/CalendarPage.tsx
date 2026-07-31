import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import { bookingSlotParts } from '../../domain/availability';
import type { Booking, SlotStatus } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';
import {
  BlockSlotDialog,
  BookedSlotDialog,
  ConflictResolveDialog,
} from '../scheduling/SchedulingDialogs';

const statusStyles: Record<
  SlotStatus,
  { bgcolor: string; color: string; label: string }
> = {
  available: { bgcolor: '#F8FAFC', color: '#64748B', label: 'Available' },
  booked: { bgcolor: '#16A34A', color: '#fff', label: 'Booked' },
  blocked: { bgcolor: '#F97316', color: '#fff', label: 'Blocked' },
  conflict: { bgcolor: '#FEF3C7', color: '#B45309', label: 'Conflict' },
};

function formatHour(hour: number) {
  return dayjs().hour(hour).minute(0).format('h:mm A');
}

export function CalendarPage() {
  const slots = useGarageStore((s) => s.slots);
  const bookings = useGarageStore((s) => s.bookings);
  const unblockSlot = useGarageStore((s) => s.unblockSlot);
  const [weekOffset, setWeekOffset] = useState(0);
  const [blockTarget, setBlockTarget] = useState<{ date: string; hour: number } | null>(
    null,
  );
  const [conflictTarget, setConflictTarget] = useState<{
    date: string;
    hour: number;
  } | null>(null);
  const [manageBooking, setManageBooking] = useState<Booking | null>(null);

  const days = useMemo(() => {
    const base = dayjs('2026-08-03').add(weekOffset * 7, 'day');
    return [0, 1, 2, 3].map((i) => base.add(i, 'day'));
  }, [weekOffset]);

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const conflictSlots = slots.filter((s) => s.status === 'conflict');
  const rangeLabel = `${days[0].format('MMM D')} – ${days[days.length - 1].format('MMM D, YYYY')}`;

  const bookingsForSlot = (date: string, hour: number) =>
    bookings.filter((b) => {
      const p = bookingSlotParts(b.proposedAt || b.scheduledAt);
      return (
        p.date === date &&
        p.hour === hour &&
        ['pending', 'confirmed', 'awaiting_customer', 'rescheduled', 'in_progress'].includes(
          b.status,
        )
      );
    });

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
          <ChevronLeftIcon />
        </IconButton>
        <Typography fontWeight={700}>{rangeLabel}</Typography>
        <IconButton onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `64px repeat(${days.length}, minmax(110px, 1fr))`,
            gap: 1,
            minWidth: 520,
          }}
        >
          <Box />
          {days.map((d) => (
            <Typography
              key={d.toString()}
              variant="caption"
              fontWeight={700}
              textAlign="center"
            >
              {d.format('ddd D')}
            </Typography>
          ))}

          {hours.map((hour) => (
            <Box key={hour} sx={{ display: 'contents' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ alignSelf: 'center' }}
              >
                {formatHour(hour)}
              </Typography>
              {days.map((d) => {
                const date = d.format('YYYY-MM-DD');
                const slot = slots.find((s) => s.date === date && s.hour === hour);
                const status = slot?.status ?? 'available';
                const style = statusStyles[status];
                const linked = bookingsForSlot(date, hour);

                return (
                  <Chip
                    key={`${date}-${hour}`}
                    label={
                      status === 'conflict' ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <WarningAmberIcon sx={{ fontSize: 14 }} />
                          <span>{style.label}</span>
                        </Stack>
                      ) : status === 'blocked' && slot?.blockReason === 'general' ? (
                        'Blocked'
                      ) : status === 'blocked' ? (
                        'Bay hold'
                      ) : (
                        style.label
                      )
                    }
                    onClick={() => {
                      if (weekOffset !== 0) return;
                      if (status === 'available') {
                        setBlockTarget({ date, hour });
                      } else if (status === 'blocked') {
                        unblockSlot(date, hour);
                      } else if (status === 'conflict') {
                        setConflictTarget({ date, hour });
                      } else if (status === 'booked' && linked[0]) {
                        setManageBooking(linked[0]);
                      }
                    }}
                    sx={{
                      width: '100%',
                      height: 36,
                      borderRadius: 2,
                      bgcolor: style.bgcolor,
                      color: style.color,
                      fontWeight: 600,
                      cursor: weekOffset === 0 ? 'pointer' : 'default',
                      opacity: weekOffset !== 0 ? 0.55 : 1,
                      border:
                        status === 'conflict' ? '1px solid #F59E0B' : undefined,
                    }}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {conflictSlots.length > 0 && weekOffset === 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                setConflictTarget({
                  date: conflictSlots[0].date,
                  hour: conflictSlots[0].hour,
                })
              }
            >
              Resolve
            </Button>
          }
        >
          <Typography fontWeight={700}>Scheduling conflict!</Typography>
          {conflictSlots.length} overlapping slot
          {conflictSlots.length > 1 ? 's' : ''}. Tap a conflict cell to accept both
          times or suggest another availability.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Tap <strong>Available</strong> to block (general or booking-linked). Tap{' '}
            <strong>Blocked</strong> to unblock. Tap <strong>Booked</strong> to suggest
            / move the customer. Tap <strong>Conflict</strong> to resolve.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Customers can request busy slots from the garage calendar; those land as
            conflicts here until you confirm or propose a new time.
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="success"
        size="large"
        fullWidth
        onClick={() => {
          /* slots persist live; button confirms UX */
        }}
      >
        Save Availability
      </Button>

      <BlockSlotDialog
        open={!!blockTarget}
        date={blockTarget?.date ?? ''}
        hour={blockTarget?.hour ?? 0}
        onClose={() => setBlockTarget(null)}
      />
      <ConflictResolveDialog
        open={!!conflictTarget}
        date={conflictTarget?.date ?? ''}
        hour={conflictTarget?.hour ?? 0}
        onClose={() => setConflictTarget(null)}
      />
      <BookedSlotDialog
        open={!!manageBooking}
        booking={manageBooking}
        onClose={() => setManageBooking(null)}
      />
    </Stack>
  );
}
