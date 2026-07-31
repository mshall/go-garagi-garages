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
import { useGarageStore } from '../../store/useGarageStore';
import type { SlotStatus } from '../../domain/types';

const statusStyles: Record<
  SlotStatus,
  { bgcolor: string; color: string; label: string }
> = {
  available: { bgcolor: '#F8FAFC', color: '#64748B', label: 'Available' },
  booked: { bgcolor: '#16A34A', color: '#fff', label: 'Booked' },
  blocked: { bgcolor: '#F97316', color: '#fff', label: 'Blocked' },
  conflict: { bgcolor: '#E2E8F0', color: '#B45309', label: 'Conflict' },
};

function formatHour(hour: number) {
  return dayjs().hour(hour).minute(0).format('h:mm A');
}

export function CalendarPage() {
  const slots = useGarageStore((s) => s.slots);
  const toggleSlot = useGarageStore((s) => s.toggleSlot);
  const [weekOffset, setWeekOffset] = useState(0);

  const days = useMemo(() => {
    const base = dayjs('2026-08-03').add(weekOffset * 7, 'day');
    return [0, 1, 2, 3].map((i) => base.add(i, 'day'));
  }, [weekOffset]);

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const hasConflict = slots.some((s) => s.status === 'conflict');

  const rangeLabel = `${days[0].format('MMM D')} – ${days[days.length - 1].format('MMM D, YYYY')}`;

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
                const locked = status === 'booked' || status === 'conflict';
                return (
                  <Chip
                    key={`${date}-${hour}`}
                    label={
                      status === 'conflict' ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <WarningAmberIcon sx={{ fontSize: 14 }} />
                          <span>{style.label}</span>
                        </Stack>
                      ) : (
                        style.label
                      )
                    }
                    onClick={() => {
                      if (!locked && weekOffset === 0) toggleSlot(date, hour);
                    }}
                    sx={{
                      width: '100%',
                      height: 36,
                      borderRadius: 2,
                      bgcolor: style.bgcolor,
                      color: style.color,
                      fontWeight: 600,
                      cursor: locked ? 'default' : 'pointer',
                      opacity: weekOffset !== 0 ? 0.55 : 1,
                    }}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {hasConflict && weekOffset === 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon />}>
          <Typography fontWeight={700}>Scheduling Conflict!</Typography>
          Some time slots overlap with existing bookings or events. Please review
          them to avoid double-bookings.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Tap Available ↔ Blocked to update availability. Booked and conflict
            slots are locked.
          </Typography>
        </CardContent>
      </Card>

      <Button variant="contained" color="success" size="large" fullWidth>
        Save Availability
      </Button>
    </Stack>
  );
}
