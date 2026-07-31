import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { bookingSlotParts } from '../../domain/availability';
import type { BlockReason, Booking, SlotStatus } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <Stack spacing={0.5} p={1.5} bgcolor="#F8FAFC" borderRadius={2}>
      <Typography fontWeight={700}>
        #{booking.id} · {booking.customerName}
      </Typography>
      <Typography variant="body2">{booking.serviceName}</Typography>
      {booking.vehicle && (
        <Typography variant="caption" color="text.secondary">
          {booking.vehicle}
        </Typography>
      )}
      <Typography variant="body2" fontWeight={600}>
        Requested: {dayjs(booking.scheduledAt).format('ddd D MMM · h:mm A')}
      </Typography>
      {booking.proposedAt && (
        <Typography variant="body2" color="info.main" fontWeight={600}>
          Proposed: {dayjs(booking.proposedAt).format('ddd D MMM · h:mm A')}
        </Typography>
      )}
      {booking.customerRequestedDespiteConflict && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Customer selected this slot knowing it may conflict. Garage confirmation required.
        </Alert>
      )}
      {booking.notes && (
        <Typography variant="caption" color="text.secondary">
          {booking.notes}
        </Typography>
      )}
    </Stack>
  );
}

const pickerStyles: Record<
  SlotStatus,
  { bgcolor: string; color: string; label: string }
> = {
  available: { bgcolor: '#F8FAFC', color: '#64748B', label: 'Free' },
  booked: { bgcolor: '#E2E8F0', color: '#64748B', label: 'Busy' },
  blocked: { bgcolor: '#FED7AA', color: '#9A3412', label: 'Blocked' },
  conflict: { bgcolor: '#FEF3C7', color: '#B45309', label: 'Conflict' },
};

function slotIso(date: string, hour: number) {
  return dayjs(
    `${date}T${String(hour).padStart(2, '0')}:00:00+04:00`,
  ).toISOString();
}

/** Calendar grid to pick an available booking time for suggestions / moves */
function SuggestTimeCalendar({
  value,
  onChange,
  excludeBookingId,
  highlightIso,
}: {
  value: string;
  onChange: (iso: string) => void;
  /** Booking being moved — its current slot is marked but not selectable as “new” */
  excludeBookingId?: string;
  /** Original requested time to highlight as context */
  highlightIso?: string;
}) {
  const slots = useGarageStore((s) => s.slots);
  const bookings = useGarageStore((s) => s.bookings);
  const [weekOffset, setWeekOffset] = useState(0);

  const highlight = highlightIso ? bookingSlotParts(highlightIso) : null;
  const selected = value ? bookingSlotParts(value) : null;

  const days = useMemo(() => {
    const base = dayjs('2026-08-01').add(weekOffset * 7, 'day');
    return [0, 1, 2, 3, 4].map((i) => base.add(i, 'day'));
  }, [weekOffset]);

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const rangeLabel = `${days[0].format('MMM D')} – ${days[days.length - 1].format('MMM D')}`;

  const isSelectable = (date: string, hour: number, status: SlotStatus) => {
    if (status === 'available') return true;
    if (status === 'blocked') return false;
    const at = bookings.filter((b) => {
      const p = bookingSlotParts(b.proposedAt || b.scheduledAt);
      return (
        p.date === date &&
        p.hour === hour &&
        b.id !== excludeBookingId &&
        ['pending', 'confirmed', 'awaiting_customer', 'rescheduled', 'in_progress'].includes(
          b.status,
        )
      );
    });
    return at.length === 0 && status !== 'conflict';
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" fontWeight={700}>
          Select a free time on the calendar
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" fontWeight={700} sx={{ minWidth: 110, textAlign: 'center' }}>
            {rangeLabel}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Next week"
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {value && (
        <Alert severity="success" sx={{ py: 0.5 }}>
          Suggested:{' '}
          <strong>{dayjs(value).format('ddd D MMM · h:mm A')}</strong>
        </Alert>
      )}

      <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `52px repeat(${days.length}, minmax(72px, 1fr))`,
            gap: 0.75,
            minWidth: 420,
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
                sx={{ alignSelf: 'center', fontSize: 11 }}
              >
                {dayjs().hour(hour).minute(0).format('h A')}
              </Typography>
              {days.map((d) => {
                const date = d.format('YYYY-MM-DD');
                const slot = slots.find((s) => s.date === date && s.hour === hour);
                const status = slot?.status ?? 'available';
                const style = pickerStyles[status];
                const selectable = isSelectable(date, hour, status);
                const isSelected =
                  selected?.date === date && selected?.hour === hour;
                const isOriginal =
                  highlight?.date === date && highlight?.hour === hour;
                const iso = slotIso(date, hour);

                return (
                  <Chip
                    key={`${date}-${hour}`}
                    size="small"
                    label={
                      isSelected
                        ? 'Selected'
                        : isOriginal
                          ? 'Current'
                          : selectable
                            ? style.label
                            : style.label
                    }
                    onClick={() => {
                      if (!selectable) return;
                      onChange(iso);
                    }}
                    sx={{
                      width: '100%',
                      height: 30,
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: 11,
                      bgcolor: isSelected
                        ? 'primary.main'
                        : isOriginal
                          ? '#DBEAFE'
                          : style.bgcolor,
                      color: isSelected
                        ? '#fff'
                        : isOriginal
                          ? '#1D4ED8'
                          : style.color,
                      cursor: selectable ? 'pointer' : 'not-allowed',
                      opacity: selectable || isSelected || isOriginal ? 1 : 0.55,
                      border: isSelected
                        ? '2px solid'
                        : isOriginal
                          ? '1px solid #93C5FD'
                          : selectable
                            ? '1px solid #CBD5E1'
                            : '1px solid transparent',
                      borderColor: isSelected ? 'primary.dark' : undefined,
                      '&:hover': selectable
                        ? {
                            bgcolor: isSelected ? 'primary.dark' : '#E0F2FE',
                          }
                        : undefined,
                    }}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="text.secondary">
          Tap a free cell to propose that time. Busy / blocked / conflict slots stay
          unavailable.
        </Typography>
      </Stack>
    </Stack>
  );
}

/** Confirm pending booking: accept requested time or suggest another */
export function ConfirmBookingDialog({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  const acceptBooking = useGarageStore((s) => s.acceptBooking);
  const suggestBookingTime = useGarageStore((s) => s.suggestBookingTime);
  const getConflictsForBooking = useGarageStore((s) => s.getConflictsForBooking);
  const [mode, setMode] = useState<'accept' | 'suggest'>('accept');
  const [suggested, setSuggested] = useState('');

  const conflicts = booking ? getConflictsForBooking(booking.id) : [];

  useEffect(() => {
    if (open) {
      setMode(conflicts.length > 0 ? 'suggest' : 'accept');
      setSuggested('');
    }
  }, [open, booking?.id, conflicts.length]);

  if (!booking) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={mode === 'suggest' ? 'md' : 'sm'}
    >
      <DialogTitle>Confirm booking</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <BookingSummary booking={booking} />
          {conflicts.length > 0 && (
            <Alert severity="error">
              Conflicts with {conflicts.length} other booking
              {conflicts.length > 1 ? 's' : ''}:{' '}
              {conflicts.map((c) => `${c.customerName} (${c.id})`).join(', ')}
            </Alert>
          )}
          <RadioGroup
            value={mode}
            onChange={(_, v) => {
              setMode(v as 'accept' | 'suggest');
              if (v === 'accept') setSuggested('');
            }}
          >
            <FormControlLabel
              value="accept"
              control={<Radio />}
              label={
                conflicts.length
                  ? `Accept at requested time anyway (${dayjs(booking.scheduledAt).format('h:mm A')})`
                  : `Accept at requested time (${dayjs(booking.scheduledAt).format('ddd D MMM · h:mm A')})`
              }
            />
            <FormControlLabel
              value="suggest"
              control={<Radio />}
              label="Suggest another time for the customer to confirm"
            />
          </RadioGroup>
          {mode === 'suggest' && (
            <SuggestTimeCalendar
              value={suggested}
              onChange={setSuggested}
              excludeBookingId={booking.id}
              highlightIso={booking.scheduledAt}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={mode === 'suggest' && !suggested}
          onClick={() => {
            if (mode === 'accept') {
              acceptBooking(booking.id, {
                forceDespiteConflict: conflicts.length > 0,
              });
            } else if (suggested) {
              suggestBookingTime(booking.id, suggested);
            }
            onClose();
          }}
        >
          {mode === 'accept' ? 'Confirm booking' : 'Send suggestion'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Resolve calendar conflict: accept both or reschedule one */
export function ConflictResolveDialog({
  date,
  hour,
  open,
  onClose,
}: {
  date: string;
  hour: number;
  open: boolean;
  onClose: () => void;
}) {
  const bookings = useGarageStore((s) => s.bookings);
  const resolveConflictAcceptBoth = useGarageStore(
    (s) => s.resolveConflictAcceptBoth,
  );
  const resolveConflictReschedule = useGarageStore(
    (s) => s.resolveConflictReschedule,
  );
  const at = bookings.filter((b) => {
    const p = bookingSlotParts(b.proposedAt || b.scheduledAt);
    return (
      p.date === date &&
      p.hour === hour &&
      ['pending', 'confirmed', 'awaiting_customer'].includes(b.status)
    );
  });
  const defaultTarget =
    at.find((b) => b.status !== 'confirmed')?.id ?? at[0]?.id ?? '';
  const [mode, setMode] = useState<'accept_both' | 'reschedule'>('reschedule');
  const [targetId, setTargetId] = useState(defaultTarget);
  const [suggested, setSuggested] = useState('');
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (open) {
      setMode('reschedule');
      setTargetId(
        at.find((b) => b.status !== 'confirmed')?.id ?? at[0]?.id ?? '',
      );
      setSuggested('');
      setNotify(true);
    }
    // only reset when dialog opens for a slot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, date, hour]);

  const targetBooking = at.find((b) => b.id === targetId) ?? at[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={mode === 'reschedule' ? 'md' : 'sm'}
    >
      <DialogTitle>Resolve scheduling conflict</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Alert severity="warning">
            {dayjs(`${date}T${String(hour).padStart(2, '0')}:00:00`).format(
              'ddd D MMM · h:mm A',
            )}{' '}
            has overlapping bookings. Accept both at the same time, or pick another
            time from the calendar.
          </Alert>
          {at.map((b) => (
            <BookingSummary key={b.id} booking={b} />
          ))}
          <RadioGroup
            value={mode}
            onChange={(_, v) => {
              setMode(v as 'accept_both' | 'reschedule');
              if (v === 'accept_both') setSuggested('');
            }}
          >
            <FormControlLabel
              value="accept_both"
              control={<Radio />}
              label="Accept both at this time (double-book)"
            />
            <FormControlLabel
              value="reschedule"
              control={<Radio />}
              label="Suggest / move one booking — pick from calendar"
            />
          </RadioGroup>
          {mode === 'reschedule' && (
            <Stack spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Booking to move</InputLabel>
                <Select
                  label="Booking to move"
                  value={targetId}
                  onChange={(e) => {
                    setTargetId(e.target.value);
                    setSuggested('');
                  }}
                >
                  {at.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.customerName} · {b.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <SuggestTimeCalendar
                value={suggested}
                onChange={setSuggested}
                excludeBookingId={targetId}
                highlightIso={
                  targetBooking
                    ? targetBooking.proposedAt || targetBooking.scheduledAt
                    : undefined
                }
              />
              <RadioGroup
                row
                value={notify ? 'notify' : 'direct'}
                onChange={(_, v) => setNotify(v === 'notify')}
              >
                <FormControlLabel
                  value="notify"
                  control={<Radio />}
                  label="Suggest & notify customer"
                />
                <FormControlLabel
                  value="direct"
                  control={<Radio />}
                  label="Move directly & notify"
                />
              </RadioGroup>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={mode === 'reschedule' && (!targetId || !suggested)}
          onClick={() => {
            if (mode === 'accept_both') {
              resolveConflictAcceptBoth(date, hour);
            } else if (targetId && suggested) {
              resolveConflictReschedule(targetId, suggested, notify);
            }
            onClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Block available slot: general vs booking-linked */
export function BlockSlotDialog({
  date,
  hour,
  open,
  onClose,
}: {
  date: string;
  hour: number;
  open: boolean;
  onClose: () => void;
}) {
  const bookings = useGarageStore((s) => s.bookings);
  const blockSlot = useGarageStore((s) => s.blockSlot);
  const [reason, setReason] = useState<BlockReason>('general');
  const [bookingId, setBookingId] = useState('');
  const [note, setNote] = useState('');

  const pendingOrConfirmed = bookings.filter((b) =>
    ['pending', 'confirmed', 'awaiting_customer'].includes(b.status),
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Block time slot</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography fontWeight={600}>
            {dayjs(`${date}T${String(hour).padStart(2, '0')}:00:00`).format(
              'ddd D MMM · h:mm A',
            )}
          </Typography>
          <RadioGroup
            value={reason}
            onChange={(_, v) => setReason(v as BlockReason)}
          >
            <FormControlLabel
              value="general"
              control={<Radio />}
              label="General blocking (closed / staff / maintenance)"
            />
            <FormControlLabel
              value="booking"
              control={<Radio />}
              label="Block due to a booking"
            />
          </RadioGroup>
          {reason === 'booking' && (
            <FormControl fullWidth size="small">
              <InputLabel>Booking</InputLabel>
              <Select
                label="Booking"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              >
                {pendingOrConfirmed.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.customerName} · {b.serviceName} · {b.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="warning"
          disabled={reason === 'booking' && !bookingId}
          onClick={() => {
            blockSlot(date, hour, reason, {
              bookingId: reason === 'booking' ? bookingId : undefined,
              note: note || undefined,
            });
            onClose();
          }}
        >
          Block slot
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Manage booked slot: suggest new time or move */
export function BookedSlotDialog({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  const moveBooking = useGarageStore((s) => s.moveBooking);
  const suggestBookingTime = useGarageStore((s) => s.suggestBookingTime);
  const customerConfirmProposedTime = useGarageStore(
    (s) => s.customerConfirmProposedTime,
  );
  const [mode, setMode] = useState<'suggest' | 'direct'>('suggest');
  const [suggested, setSuggested] = useState('');

  useEffect(() => {
    if (open) {
      setMode('suggest');
      setSuggested('');
    }
  }, [open, booking?.id]);

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Manage booked slot</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <BookingSummary booking={booking} />
          {booking.lastCustomerNotice && (
            <Alert severity="info">{booking.lastCustomerNotice}</Alert>
          )}
          <RadioGroup
            value={mode}
            onChange={(_, v) => setMode(v as 'suggest' | 'direct')}
          >
            <FormControlLabel
              value="suggest"
              control={<Radio />}
              label="Suggest another time — customer must confirm"
            />
            <FormControlLabel
              value="direct"
              control={<Radio />}
              label="Move directly and notify customer"
            />
          </RadioGroup>
          <SuggestTimeCalendar
            value={suggested}
            onChange={setSuggested}
            excludeBookingId={booking.id}
            highlightIso={booking.proposedAt || booking.scheduledAt}
          />
          {booking.status === 'awaiting_customer' && booking.proposedAt && (
            <Button
              variant="outlined"
              onClick={() => {
                customerConfirmProposedTime(booking.id);
                onClose();
              }}
            >
              Simulate customer confirmation
            </Button>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          disabled={!suggested}
          onClick={() => {
            if (!suggested) return;
            if (mode === 'suggest') suggestBookingTime(booking.id, suggested);
            else moveBooking(booking.id, suggested, 'direct_confirm');
            onClose();
          }}
        >
          {mode === 'suggest' ? 'Send suggestion' : 'Move & notify'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
