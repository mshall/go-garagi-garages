import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { formatAed } from '../../domain/format';
import type { DiscountType } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

export function PromotionsPage() {
  const { t } = useTranslation();
  const promotions = useGarageStore((s) => s.promotions);
  const services = useGarageStore((s) => s.services);
  const addPromotion = useGarageStore((s) => s.addPromotion);
  const deletePromotion = useGarageStore((s) => s.deletePromotion);
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [value, setValue] = useState('15');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(30, 'day').format('YYYY-MM-DD'));

  const avgDiscount =
    promotions.length === 0
      ? 0
      : promotions.reduce((sum, p) => sum + p.value, 0) / promotions.length;

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Card>
            <CardContent>
              <LocalOfferOutlinedIcon color="primary" />
              <Typography variant="subtitle2" mt={1}>
                {t('promotions.active')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('promotions.currentlyRunning')}
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight={700} mt={0.5}>
                {t('promotions.thisMonth', { count: promotions.length })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Card>
            <CardContent>
              <PercentOutlinedIcon color="primary" />
              <Typography variant="subtitle2" mt={1}>
                {t('promotions.avgDiscount')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('promotions.acrossServices')}
              </Typography>
              <Typography variant="body2" fontWeight={700} mt={0.5}>
                {t('promotions.stable', { value: avgDiscount.toFixed(0) })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack spacing={1.5}>
        {promotions.map((p) => {
          const svc = services.find((s) => s.id === p.serviceId);
          return (
            <Card key={p.id}>
              <CardContent>
                <Stack direction="row" spacing={1.5}>
                  <LocalOfferOutlinedIcon color="secondary" />
                  <Stack flex={1} spacing={0.75}>
                    <Typography fontWeight={700}>{p.title}</Typography>
                    <Chip
                      size="small"
                      label={
                        p.discountType === 'percentage'
                          ? t('promotions.percentageDiscount')
                          : t('promotions.fixedDiscount')
                      }
                      sx={{ width: 'fit-content', bgcolor: '#FCE7F3' }}
                    />
                    <Typography fontWeight={600} color="primary">
                      {p.discountType === 'percentage'
                        ? t('promotions.percentOff', { value: p.value })
                        : t('promotions.fixedOff', { value: formatAed(p.value) })}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(p.startDate).format('MMM DD, YYYY')} –{' '}
                        {dayjs(p.endDate).format('MMM DD, YYYY')}
                      </Typography>
                    </Stack>
                    {svc && (
                      <Typography variant="caption" color="text.secondary">
                        {t('promotions.serviceLabel', { name: svc.name })}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} pt={1}>
                      <Button size="small" variant="outlined">
                        {t('common.edit')}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => deletePromotion(p.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<LocalOfferOutlinedIcon />}
        onClick={() => setOpen(true)}
      >
        {t('promotions.add')}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('promotions.addTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>{t('promotions.selectService')}</InputLabel>
              <Select
                label={t('promotions.selectService')}
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {services.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <RadioGroup
              row
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            >
              <FormControlLabel
                value="percentage"
                control={<Radio />}
                label={t('promotions.percentage')}
              />
              <FormControlLabel
                value="fixed"
                control={<Radio />}
                label={t('promotions.fixedAed')}
              />
            </RadioGroup>
            <TextField
              label={t('promotions.discountValue')}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('promotions.startDate')}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t('promotions.endDate')}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              const svc = services.find((s) => s.id === serviceId);
              addPromotion({
                title: svc?.name ?? t('promotions.fallbackTitle'),
                serviceId,
                discountType,
                value: Number(value),
                startDate,
                endDate,
                active: true,
              });
              setOpen(false);
            }}
          >
            {t('promotions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
