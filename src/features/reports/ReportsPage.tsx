import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatAed } from '../../domain/format';
import { useGarageStore } from '../../store/useGarageStore';

export function ReportsPage() {
  const bookings = useGarageStore((s) => s.bookings);
  const quotes = useGarageStore((s) => s.quotes);
  const payouts = useGarageStore((s) => s.payouts);
  const reviews = useGarageStore((s) => s.reviews);

  const completed = bookings.filter((b) => b.status === 'completed').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const wonQuotes = quotes.filter((q) => q.status === 'won').length;
  const gmv = payouts.reduce((sum, p) => sum + p.amountAed, 0);
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1);

  const metrics = [
    { label: 'Completed jobs', value: String(completed) },
    { label: 'Confirmed bookings', value: String(confirmed) },
    { label: 'Quotes won', value: String(wonQuotes) },
    { label: 'Quote win rate', value: `${Math.round((wonQuotes / Math.max(quotes.length, 1)) * 100)}%` },
    { label: 'GMV (period)', value: formatAed(gmv) },
    { label: 'Avg. review score', value: avgRating.toFixed(1) },
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Snapshot of marketplace performance for Al Quoz Auto Care (demo data).
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((m) => (
          <Grid key={m.label} size={{ xs: 6, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {m.label}
                </Typography>
                <Typography variant="h5" fontWeight={800} mt={0.5}>
                  {m.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <Typography fontWeight={700} gutterBottom>
            Demand by service type
          </Typography>
          {[
            { name: 'Oil Change', pct: 28 },
            { name: 'Accident repair', pct: 22 },
            { name: 'AC / Cooling', pct: 18 },
            { name: 'Brakes', pct: 16 },
            { name: 'Detailing / Wash', pct: 16 },
          ].map((row) => (
            <Stack key={row.name} direction="row" justifyContent="space-between" py={0.75}>
              <Typography variant="body2">{row.name}</Typography>
              <Typography variant="body2" fontWeight={700}>
                {row.pct}%
              </Typography>
            </Stack>
          ))}
        </CardContent>
      </Card>
    </Stack>
  );
}
