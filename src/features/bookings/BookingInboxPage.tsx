import { useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { BookingStatusChip } from '../../components/StatusChip';
import type { BookingStatus } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

type TabKey = 'pending' | 'confirmed' | 'rejected';

export function BookingInboxPage() {
  const navigate = useNavigate();
  const bookings = useGarageStore((s) => s.bookings);
  const acceptBooking = useGarageStore((s) => s.acceptBooking);
  const [tab, setTab] = useState<TabKey>('pending');

  const filtered = useMemo(
    () => bookings.filter((b) => b.status === (tab as BookingStatus)),
    [bookings, tab],
  );

  const today = filtered.filter((b) =>
    dayjs(b.scheduledAt).isSame(dayjs(), 'day'),
  );
  const others = filtered.filter(
    (b) => !dayjs(b.scheduledAt).isSame(dayjs(), 'day'),
  );

  const renderCard = (booking: (typeof bookings)[0]) => (
    <Card key={booking.id}>
      <CardContent>
        <Stack direction="row" spacing={1.5}>
          <Box
            sx={{
              minWidth: 56,
              bgcolor: '#F1F5F9',
              borderRadius: 2,
              textAlign: 'center',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography variant="body2" color="primary" fontWeight={700}>
              {dayjs(booking.scheduledAt).format('D MMM')}
            </Typography>
          </Box>
          <Box flex={1} minWidth={0}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography fontWeight={700} noWrap>
                {booking.customerName}
              </Typography>
              <BookingStatusChip status={booking.status} />
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={0.25}>
              {booking.serviceName}
            </Typography>
            {booking.vehicle && (
              <Typography variant="caption" color="text.secondary">
                {booking.vehicle}
              </Typography>
            )}
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.light' }}>
                {booking.customerInitials}
              </Avatar>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {dayjs(booking.scheduledAt).format('h:mm A')}
              </Typography>
            </Stack>
            {booking.status === 'pending' && (
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => acceptBooking(booking.id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => navigate(`/bookings/${booking.id}/reject`)}
                >
                  Reject
                </Button>
              </Stack>
            )}
            {booking.rejectionReason && (
              <Typography variant="caption" color="error" display="block" mt={1}>
                Reason: {booking.rejectionReason}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={2}>
      <Tabs
        value={tab}
        onChange={(_, v: TabKey) => setTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Pending" value="pending" />
        <Tab label="Confirmed" value="confirmed" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {today.length > 0 && (
        <Box>
          <Typography variant="subtitle1" mb={1.5}>
            Today&apos;s Bookings
          </Typography>
          <Stack spacing={1.5}>{today.map(renderCard)}</Stack>
        </Box>
      )}

      {others.length > 0 && (
        <Box>
          <Typography variant="subtitle1" mb={1.5}>
            Upcoming / Other
          </Typography>
          <Stack spacing={1.5}>{others.map(renderCard)}</Stack>
        </Box>
      )}

      {filtered.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              No {tab} bookings right now.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
