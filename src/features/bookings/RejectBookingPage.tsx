import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BookingStatusChip } from '../../components/StatusChip';
import { useGarageStore } from '../../store/useGarageStore';

export function RejectBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = useGarageStore((s) => s.bookings.find((b) => b.id === id));
  const rejectBooking = useGarageStore((s) => s.rejectBooking);
  const [reason, setReason] = useState('');

  if (!booking) return <Navigate to="/bookings" replace />;

  const rows = [
    { label: 'Service Type:', value: booking.serviceName },
    {
      label: 'Scheduled Date:',
      value: dayjs(booking.scheduledAt).format('MMMM D, YYYY'),
    },
    {
      label: 'Scheduled Time:',
      value: dayjs(booking.scheduledAt).format('hh:mm A'),
    },
    { label: 'Customer Name:', value: booking.customerName },
  ];

  return (
    <Stack spacing={3} maxWidth={560} mx="auto">
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography color="text.secondary">#{booking.id}</Typography>
            <BookingStatusChip status={booking.status} />
          </Stack>
          <Stack spacing={1.25}>
            {rows.map((row) => (
              <Stack
                key={row.label}
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography variant="body2" color="text.secondary">
                  {row.label}
                </Typography>
                <Typography variant="body2" fontWeight={600} textAlign="right">
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box>
        <Typography fontWeight={600} mb={1}>
          Add a reason or suggestion
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="Please book another time or suggest alternative dates."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!reason.trim()}
        onClick={() => {
          rejectBooking(booking.id, reason.trim());
          navigate('/bookings');
        }}
      >
        Send Rejection
      </Button>
    </Stack>
  );
}
