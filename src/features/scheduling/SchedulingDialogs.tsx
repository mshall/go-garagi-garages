import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  bookingSlotParts,
  listSuggestableSlots,
} from '../../domain/availability';
import type { BlockReason, Booking } from '../../domain/types';
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

function TimeSlotPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const slots = useGarageStore((s) => s.slots);
  const bookings = useGarageStore((s) => s.bookings);
  const options = useMemo(
    () => listSuggestableSlots(slots, bookings, '2026-08-01'),
    [slots, bookings],
  );

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Suggested time</InputLabel>
      <Select
        label="Suggested time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => {
          const iso = dayjs(
            `${o.date}T${String(o.hour).padStart(2, '0')}:00:00+04:00`,
          ).toISOString();
          return (
            <MenuItem key={`${o.date}-${o.hour}`} value={iso}>
              {o.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
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

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
            onChange={(_, v) => setMode(v as 'accept' | 'suggest')}
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
            <TimeSlotPicker value={suggested} onChange={setSuggested} />
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
  const [mode, setMode] = useState<'accept_both' | 'reschedule'>('accept_both');
  const [targetId, setTargetId] = useState(at.find((b) => b.status !== 'confirmed')?.id ?? at[0]?.id ?? '');
  const [suggested, setSuggested] = useState('');
  const [notify, setNotify] = useState(true);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Resolve scheduling conflict</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Alert severity="warning">
            {dayjs(`${date}T${String(hour).padStart(2, '0')}:00:00`).format(
              'ddd D MMM · h:mm A',
            )}{' '}
            has overlapping bookings. Accept both at the same time, or move one.
          </Alert>
          {at.map((b) => (
            <BookingSummary key={b.id} booking={b} />
          ))}
          <RadioGroup
            value={mode}
            onChange={(_, v) => setMode(v as 'accept_both' | 'reschedule')}
          >
            <FormControlLabel
              value="accept_both"
              control={<Radio />}
              label="Accept both at this time (double-book)"
            />
            <FormControlLabel
              value="reschedule"
              control={<Radio />}
              label="Suggest / move one booking to another availability"
            />
          </RadioGroup>
          {mode === 'reschedule' && (
            <Stack spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Booking to move</InputLabel>
                <Select
                  label="Booking to move"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                >
                  {at.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.customerName} · {b.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TimeSlotPicker value={suggested} onChange={setSuggested} />
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

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          <TimeSlotPicker value={suggested} onChange={setSuggested} />
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
