import { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  SimpleBarChart,
  SimpleHorizontalBars,
  SimpleLineChart,
} from '../../components/SimpleCharts';
import { formatAed } from '../../domain/format';
import { useGarageStore } from '../../store/useGarageStore';

type PeriodPreset = '7d' | '30d' | '90d' | 'custom';

export function ReportsPage() {
  const { t } = useTranslation();
  const garage = useGarageStore((s) => s.garage);
  const bookings = useGarageStore((s) => s.bookings);
  const quotes = useGarageStore((s) => s.quotes);
  const payouts = useGarageStore((s) => s.payouts);
  const reviews = useGarageStore((s) => s.reviews);
  const [period, setPeriod] = useState<PeriodPreset>('30d');
  const [from, setFrom] = useState(dayjs('2026-07-01').format('YYYY-MM-DD'));
  const [to, setTo] = useState(dayjs('2026-08-01').format('YYYY-MM-DD'));

  const range = useMemo(() => {
    const now = dayjs('2026-08-01').endOf('day');
    if (period === '7d') return { start: now.subtract(7, 'day'), end: now };
    if (period === '30d') return { start: now.subtract(30, 'day'), end: now };
    if (period === '90d') return { start: now.subtract(90, 'day'), end: now };
    return {
      start: dayjs(from).startOf('day'),
      end: dayjs(to).endOf('day'),
    };
  }, [period, from, to]);

  const inRange = (iso: string) => {
    const d = dayjs(iso);
    return !d.isBefore(range.start) && !d.isAfter(range.end);
  };

  const filteredBookings = bookings.filter((b) => inRange(b.scheduledAt));
  const filteredQuotes = quotes.filter((q) => inRange(q.submittedAt));
  const filteredPayouts = payouts.filter((p) => inRange(p.createdAt));
  const filteredReviews = reviews.filter((r) => inRange(r.createdAt));

  const completed = filteredBookings.filter((b) => b.status === 'completed').length;
  const confirmed = filteredBookings.filter((b) => b.status === 'confirmed').length;
  const pending = filteredBookings.filter((b) => b.status === 'pending').length;
  const rejected = filteredBookings.filter((b) => b.status === 'rejected').length;
  const wonQuotes = filteredQuotes.filter((q) => q.status === 'won').length;
  const newQuotes = filteredQuotes.filter((q) => q.status === 'new').length;
  const respondedQuotes = filteredQuotes.filter((q) => q.status === 'responded').length;
  const gmv = filteredPayouts.reduce((sum, p) => sum + p.grossAed, 0);
  const net = filteredPayouts.reduce((sum, p) => sum + p.netAed, 0);
  const avgRating =
    filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
    Math.max(filteredReviews.length, 1);

  const metrics = [
    { label: t('reports.completedJobs'), value: String(completed) },
    { label: t('reports.confirmedBookings'), value: String(confirmed) },
    { label: t('reports.pendingBookings'), value: String(pending) },
    { label: t('reports.quotesWon'), value: String(wonQuotes) },
    {
      label: t('reports.quoteWinRate'),
      value: `${Math.round(
        (wonQuotes / Math.max(filteredQuotes.filter((q) => q.status !== 'new').length, 1)) *
          100,
      )}%`,
    },
    { label: t('reports.gmv'), value: formatAed(gmv) },
    { label: t('reports.netEarnings'), value: formatAed(net) },
    {
      label: t('reports.avgReview'),
      value: filteredReviews.length ? avgRating.toFixed(1) : '—',
    },
  ];

  const bookingStatusChart = [
    { label: t('status.booking.pending'), value: pending, color: '#F59E0B' },
    { label: t('status.booking.confirmed'), value: confirmed, color: '#2563EB' },
    { label: t('status.booking.completed'), value: completed, color: '#16A34A' },
    { label: t('status.booking.rejected'), value: rejected, color: '#DC2626' },
  ];

  const quoteStatusChart = [
    { label: t('status.quote.new'), value: newQuotes, color: '#F97316' },
    { label: t('status.quote.responded'), value: respondedQuotes, color: '#6366F1' },
    { label: t('status.quote.won'), value: wonQuotes, color: '#16A34A' },
    {
      label: t('status.quote.lost'),
      value: filteredQuotes.filter((q) => q.status === 'lost').length,
      color: '#94A3B8',
    },
  ];

  const demandByService = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of filteredBookings) {
      const key = b.serviceName.split('&')[0].trim().slice(0, 22);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const total = Math.max(filteredBookings.length, 1);
    return Array.from(counts.entries())
      .map(([name, count]) => ({
        label: name,
        value: Math.round((count / total) * 100),
        color: '#4F46E5',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredBookings]);

  const earningsTrend = useMemo(() => {
    const buckets: { label: string; value: number }[] = [];
    const days = Math.min(Math.max(range.end.diff(range.start, 'day') + 1, 1), 14);
    for (let i = days - 1; i >= 0; i--) {
      const day = range.end.subtract(i, 'day');
      const value = filteredPayouts
        .filter((p) => dayjs(p.createdAt).isSame(day, 'day'))
        .reduce((s, p) => s + p.netAed, 0);
      buckets.push({ label: day.format('D MMM'), value });
    }
    return buckets;
  }, [filteredPayouts, range]);

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    label: `${stars}★`,
    value: filteredReviews.filter((r) => r.rating === stars).length,
    color: stars >= 4 ? '#16A34A' : stars === 3 ? '#F59E0B' : '#DC2626',
  }));

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography fontWeight={700}>{t('reports.timeRange')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('reports.marketplaceFor', {
                name: garage.name,
                range: `${range.start.format('D MMM YYYY')} – ${range.end.format('D MMM YYYY')}`,
              })}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('reports.period')}</InputLabel>
                <Select
                  label={t('reports.period')}
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
                >
                  <MenuItem value="7d">{t('reports.last7')}</MenuItem>
                  <MenuItem value="30d">{t('reports.last30')}</MenuItem>
                  <MenuItem value="90d">{t('reports.last90')}</MenuItem>
                  <MenuItem value="custom">{t('reports.customRange')}</MenuItem>
                </Select>
              </FormControl>
              {period === 'custom' && (
                <>
                  <TextField
                    label={t('common.from')}
                    type="date"
                    size="small"
                    fullWidth
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label={t('common.to')}
                    type="date"
                    size="small"
                    fullWidth
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {metrics.map((m) => (
          <Grid key={m.label} size={{ xs: 6, sm: 3 }}>
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {t('reports.bookingsByStatus')}
              </Typography>
              <SimpleBarChart data={bookingStatusChart} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {t('reports.quotesByStatus')}
              </Typography>
              <SimpleBarChart data={quoteStatusChart} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {t('reports.earningsTrend')}
              </Typography>
              <SimpleLineChart data={earningsTrend} color="#0EA5E9" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {t('reports.ratingDistribution')}
              </Typography>
              <SimpleBarChart data={ratingDistribution} height={160} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>
                {t('reports.demandByService')}
              </Typography>
              {demandByService.length > 0 ? (
                <SimpleHorizontalBars data={demandByService} />
              ) : (
                <Typography color="text.secondary">
                  {t('reports.noBookings')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
