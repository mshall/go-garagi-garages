import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { formatAed } from '../../domain/format';
import { useGarageStore } from '../../store/useGarageStore';

const statusColor = {
  paid: 'success',
  pending: 'warning',
  held: 'info',
} as const;

export function EarningsPage() {
  const payouts = useGarageStore((s) => s.payouts);

  const available = payouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amountAed, 0);
  const held = payouts
    .filter((p) => p.status === 'held')
    .reduce((sum, p) => sum + p.amountAed, 0);
  const pending = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amountAed, 0);

  return (
    <Stack spacing={2}>
      <Card sx={{ bgcolor: 'primary.main', color: '#fff', border: 'none' }}>
        <CardContent>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Available balance
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {formatAed(available)}
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Typography variant="caption">Held in escrow: {formatAed(held)}</Typography>
            <Typography variant="caption">Pending: {formatAed(pending)}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="subtitle1">Payout history</Typography>
      {payouts.map((p) => (
        <Card key={p.id}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Stack spacing={0.5}>
                <Typography fontWeight={700}>{p.description}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.jobRef} · {dayjs(p.createdAt).format('D MMM YYYY')}
                </Typography>
                <Chip
                  size="small"
                  label={p.status}
                  color={statusColor[p.status]}
                  sx={{ width: 'fit-content', textTransform: 'capitalize' }}
                />
              </Stack>
              <Typography fontWeight={800} color="primary">
                {formatAed(p.amountAed)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
