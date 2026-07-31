import { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import { formatAed } from '../../domain/format';
import type { Payout } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

const statusColor = {
  paid: 'success',
  pending: 'warning',
  held: 'info',
} as const;

type StatusFilter = 'all' | Payout['status'];
type CategoryFilter = 'all' | Payout['category'];
type PeriodPreset = '7d' | '30d' | '90d' | 'custom' | 'all';

export function EarningsPage() {
  const { t } = useTranslation();
  const payouts = useGarageStore((s) => s.payouts);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [period, setPeriod] = useState<PeriodPreset>('30d');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [from, setFrom] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));

  const filtered = useMemo(() => {
    const now = dayjs('2026-08-01');
    let start = dayjs('2000-01-01');
    let end = dayjs('2100-01-01');
    if (period === '7d') start = now.subtract(7, 'day');
    else if (period === '30d') start = now.subtract(30, 'day');
    else if (period === '90d') start = now.subtract(90, 'day');
    else if (period === 'custom') {
      start = dayjs(from).startOf('day');
      end = dayjs(to).endOf('day');
    }
    if (period !== 'custom' && period !== 'all') end = now.endOf('day');

    const q = query.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    return payouts
      .filter((p) => {
        if (period !== 'all') {
          const d = dayjs(p.createdAt);
          if (d.isBefore(start) || d.isAfter(end)) return false;
        }
        if (status !== 'all' && p.status !== status) return false;
        if (category !== 'all' && p.category !== category) return false;
        if (min != null && !Number.isNaN(min) && p.netAed < min) return false;
        if (max != null && !Number.isNaN(max) && p.netAed > max) return false;
        if (!q) return true;
        return (
          p.description.toLowerCase().includes(q) ||
          p.jobRef.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.serviceName.toLowerCase().includes(q) ||
          (p.vehicle?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
      );
  }, [payouts, query, status, category, period, minPrice, maxPrice, from, to]);

  const totals = useMemo(() => {
    const paid = filtered.filter((p) => p.status === 'paid');
    const held = filtered.filter((p) => p.status === 'held');
    const pending = filtered.filter((p) => p.status === 'pending');
    return {
      available: paid.reduce((s, p) => s + p.netAed, 0),
      held: held.reduce((s, p) => s + p.netAed, 0),
      pending: pending.reduce((s, p) => s + p.netAed, 0),
      gross: filtered.reduce((s, p) => s + p.grossAed, 0),
      fees: filtered.reduce((s, p) => s + p.platformFeeAed, 0),
      count: filtered.length,
    };
  }, [filtered]);

  return (
    <Stack spacing={2}>
      <Card sx={{ bgcolor: 'primary.main', color: '#fff', border: 'none' }}>
        <CardContent>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {t('earnings.availableBalance')}
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {formatAed(totals.available)}
          </Typography>
          <Grid container spacing={1} mt={1.5}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
                {t('earnings.heldEscrow')}
              </Typography>
              <Typography fontWeight={700}>{formatAed(totals.held)}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
                {t('earnings.pending')}
              </Typography>
              <Typography fontWeight={700}>{formatAed(totals.pending)}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
                {t('earnings.gross')}
              </Typography>
              <Typography fontWeight={700}>{formatAed(totals.gross)}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
                {t('earnings.platformFees')}
              </Typography>
              <Typography fontWeight={700}>{formatAed(totals.fees)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <TextField
              label={t('common.search')}
              placeholder={t('earnings.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              size="small"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('common.status')}</InputLabel>
                <Select
                  label={t('common.status')}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusFilter)}
                >
                  <MenuItem value="all">{t('earnings.allStatuses')}</MenuItem>
                  <MenuItem value="paid">{t('status.payout.paid')}</MenuItem>
                  <MenuItem value="pending">{t('status.payout.pending')}</MenuItem>
                  <MenuItem value="held">{t('status.payout.held')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>{t('common.category')}</InputLabel>
                <Select
                  label={t('common.category')}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                >
                  <MenuItem value="all">{t('earnings.allCategories')}</MenuItem>
                  <MenuItem value="service">{t('earnings.category.service')}</MenuItem>
                  <MenuItem value="accident">{t('earnings.category.accident')}</MenuItem>
                  <MenuItem value="wash">{t('earnings.category.wash')}</MenuItem>
                  <MenuItem value="parts">{t('earnings.category.parts')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>{t('earnings.timePeriod')}</InputLabel>
                <Select
                  label={t('earnings.timePeriod')}
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
                >
                  <MenuItem value="7d">{t('earnings.last7')}</MenuItem>
                  <MenuItem value="30d">{t('earnings.last30')}</MenuItem>
                  <MenuItem value="90d">{t('earnings.last90')}</MenuItem>
                  <MenuItem value="custom">{t('earnings.customRange')}</MenuItem>
                  <MenuItem value="all">{t('earnings.allTime')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            {period === 'custom' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
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
              </Stack>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label={t('earnings.minNet')}
                type="number"
                size="small"
                fullWidth
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <TextField
                label={t('earnings.maxNet')}
                type="number"
                size="small"
                fullWidth
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="subtitle1">
        {t('earnings.payoutHistory', { count: totals.count })}
      </Typography>

      {filtered.map((p) => (
        <Card key={p.id}>
          <CardContent>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Stack spacing={0.25}>
                  <Typography fontWeight={700}>{p.serviceName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.jobRef} · {dayjs(p.createdAt).format('D MMM YYYY')}
                  </Typography>
                </Stack>
                <Typography fontWeight={800} color="primary">
                  {formatAed(p.netAed)}
                </Typography>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                <Chip
                  size="small"
                  label={t(`status.payout.${p.status}`)}
                  color={statusColor[p.status]}
                />
                <Chip
                  size="small"
                  label={t(`earnings.category.${p.category}`)}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={t(`earnings.payment.${p.paymentMethod}`)}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Stack>

              <Grid container spacing={1}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('earnings.customer')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {p.customerName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('earnings.vehicle')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {p.vehicle || '—'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('earnings.grossFee')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatAed(p.grossAed)} / {formatAed(p.platformFeeAed)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('earnings.completed')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {p.completedAt
                      ? dayjs(p.completedAt).format('D MMM YYYY')
                      : '—'}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              {t('earnings.empty')}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
