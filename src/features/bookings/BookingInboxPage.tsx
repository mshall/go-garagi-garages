import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookingStatusChip } from '../../components/StatusChip';
import type { Booking, BookingStatus } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';
import { ConfirmBookingDialog } from '../scheduling/SchedulingDialogs';

type TabKey = 'pending' | 'awaiting_customer' | 'confirmed' | 'rejected';

export function BookingInboxPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bookings = useGarageStore((s) => s.bookings);
  const getConflictsForBooking = useGarageStore((s) => s.getConflictsForBooking);
  const customerConfirmProposedTime = useGarageStore(
    (s) => s.customerConfirmProposedTime,
  );
  const [tab, setTab] = useState<TabKey>('pending');
  const [confirmTarget, setConfirmTarget] = useState<Booking | null>(null);

  const filtered = useMemo(
    () => bookings.filter((b) => b.status === (tab as BookingStatus)),
    [bookings, tab],
  );

  const demoToday = dayjs('2026-08-01');
  const today = filtered.filter((b) =>
    dayjs(b.scheduledAt).isSame(demoToday, 'day'),
  );
  const others = filtered.filter(
    (b) => !dayjs(b.scheduledAt).isSame(demoToday, 'day'),
  );

  const renderCard = (booking: Booking) => {
    const conflicts = getConflictsForBooking(booking.id);
    const hasConflict = conflicts.length > 0;

    return (
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
                <Avatar
                  sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.light' }}
                >
                  {booking.customerInitials}
                </Avatar>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {dayjs(booking.scheduledAt).format('h:mm A')}
                </Typography>
              </Stack>

              {booking.proposedAt && (
                <Alert severity="info" sx={{ mt: 1.5 }}>
                  Suggested time:{' '}
                  <strong>
                    {dayjs(booking.proposedAt).format('ddd D MMM · h:mm A')}
                  </strong>
                  . Waiting for customer confirmation.
                </Alert>
              )}

              {hasConflict && booking.status === 'pending' && (
                <Alert
                  severity="warning"
                  icon={<WarningAmberIcon fontSize="inherit" />}
                  sx={{ mt: 1.5 }}
                >
                  Conflicts with{' '}
                  {conflicts.map((c) => c.customerName).join(', ')} at this time.
                  Confirm carefully or suggest another slot.
                </Alert>
              )}

              {booking.lastCustomerNotice && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  {booking.lastCustomerNotice}
                </Typography>
              )}

              {booking.status === 'pending' && (
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setConfirmTarget(booking)}
                  >
                    Review & confirm
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => navigate(`/bookings/${booking.id}/reject`)}
                  >
                    {t('common.reject')}
                  </Button>
                </Stack>
              )}

              {booking.status === 'awaiting_customer' && (
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setConfirmTarget(booking)}
                  >
                    Change suggestion
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => customerConfirmProposedTime(booking.id)}
                  >
                    Simulate customer OK
                  </Button>
                </Stack>
              )}

              {booking.status === 'confirmed' && (
                <Button
                  sx={{ mt: 2 }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/calendar')}
                >
                  View on calendar
                </Button>
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
  };

  return (
    <Stack spacing={2}>
      <Tabs
        value={tab}
        onChange={(_, v: TabKey) => setTab(v)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={t('bookings.pending')} value="pending" />
        <Tab label="Awaiting customer" value="awaiting_customer" />
        <Tab label={t('bookings.confirmed')} value="confirmed" />
        <Tab label={t('bookings.rejected')} value="rejected" />
      </Tabs>

      {today.length > 0 && (
        <Box>
          <Typography variant="subtitle1" mb={1.5}>
            {t('bookings.todaysBookings')}
          </Typography>
          <Stack spacing={1.5}>{today.map(renderCard)}</Stack>
        </Box>
      )}

      {others.length > 0 && (
        <Box>
          <Typography variant="subtitle1" mb={1.5}>
            {t('bookings.upcomingOther')}
          </Typography>
          <Stack spacing={1.5}>{others.map(renderCard)}</Stack>
        </Box>
      )}

      {filtered.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              {t('bookings.empty', {
                status:
                  tab === 'awaiting_customer'
                    ? 'Awaiting customer'
                    : t(`bookings.${tab}`),
              })}
            </Typography>
          </CardContent>
        </Card>
      )}

      <ConfirmBookingDialog
        open={!!confirmTarget}
        booking={confirmTarget}
        onClose={() => setConfirmTarget(null)}
      />
    </Stack>
  );
}
