import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatPercent } from '../../domain/format';
import { useGarageStore } from '../../store/useGarageStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const kpis = useGarageStore((s) => s.kpis);
  const garage = useGarageStore((s) => s.garage);
  const bookings = useGarageStore((s) => s.bookings);
  const quotes = useGarageStore((s) => s.quotes);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const quoteStats = useMemo(() => {
    const weekStart = dayjs('2026-08-01').subtract(7, 'day');
    const doneThisWeek = quotes.filter(
      (q) =>
        (q.status === 'responded' || q.status === 'won' || q.status === 'lost') &&
        !dayjs(q.submittedAt).isBefore(weekStart),
    ).length;
    const pendingQuotes = quotes.filter((q) => q.status === 'new').length;
    return { doneThisWeek, pendingQuotes };
  }, [quotes]);

  const kpiCards = [
    {
      label: t('dashboard.bookingsThisWeek'),
      value: kpis.bookingsThisWeek,
      trend: kpis.bookingsTrend,
      color: '#2563EB',
      icon: <CalendarMonthOutlinedIcon />,
      path: '/bookings',
    },
    {
      label: t('dashboard.pendingBookings'),
      value: pendingCount || kpis.pendingBookings,
      trend: kpis.pendingTrend,
      color: '#DC2626',
      icon: <InboxOutlinedIcon />,
      path: '/bookings',
    },
    {
      label: t('dashboard.quotesDoneWeek'),
      value: quoteStats.doneThisWeek,
      trend: 8.0,
      color: '#7C3AED',
      icon: <CheckCircleOutlineIcon />,
      path: '/quotes',
    },
    {
      label: t('dashboard.quotesPending'),
      value: quoteStats.pendingQuotes,
      trend: 4.2,
      color: '#EA580C',
      icon: <RequestQuoteOutlinedIcon />,
      path: '/quotes',
    },
    {
      label: t('dashboard.averageRating'),
      value: kpis.averageRating,
      trend: kpis.ratingTrend,
      color: '#16A34A',
      icon: <StarOutlineIcon />,
      path: '/reviews',
    },
  ];

  const shortcuts = [
    {
      label: t('dashboard.editProfile'),
      icon: <PersonOutlineIcon />,
      path: '/profile/edit',
    },
    {
      label: t('dashboard.manageServices'),
      icon: <WorkOutlineIcon />,
      path: '/services',
    },
    {
      label: t('dashboard.calendarAvailability'),
      icon: <CalendarMonthOutlinedIcon />,
      path: '/calendar',
    },
    {
      label: t('dashboard.bookingInbox'),
      icon: <InboxOutlinedIcon />,
      path: '/bookings',
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {t('dashboard.welcome')}
        </Typography>
        <Typography variant="h5">{garage.name}</Typography>
        <Chip
          size="small"
          label={t(`status.garage.${garage.status}`)}
          color={garage.status === 'live' ? 'success' : 'warning'}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" mb={1.5}>
          {t('dashboard.kpis')}
        </Typography>
        <Grid container spacing={2}>
          {kpiCards.map((kpi) => (
            <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  bgcolor: kpi.color,
                  color: '#fff',
                  border: 'none',
                  minHeight: 140,
                }}
              >
                <CardActionArea
                  onClick={() => navigate(kpi.path)}
                  sx={{ height: '100%', alignItems: 'stretch' }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: '75%' }}>
                        {kpi.label}
                      </Typography>
                      <Box sx={{ opacity: 0.85 }}>{kpi.icon}</Box>
                    </Stack>
                    <Typography variant="h3" fontWeight={800} mt={1}>
                      {kpi.value}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${kpi.trend >= 0 ? '↑' : '↓'} ${formatPercent(Math.abs(kpi.trend))}`}
                      sx={{
                        mt: 1.5,
                        bgcolor: 'rgba(255,255,255,0.22)',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" mb={1.5}>
          {t('dashboard.quickAccess')}
        </Typography>
        <Grid container spacing={2}>
          {shortcuts.map((item) => (
            <Grid key={item.label} size={{ xs: 6, sm: 3 }}>
              <Card>
                <CardActionArea onClick={() => navigate(item.path)}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box color="primary.main" mb={1}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
