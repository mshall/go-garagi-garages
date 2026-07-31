import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import { formatPercent } from '../../domain/format';
import { useGarageStore } from '../../store/useGarageStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const kpis = useGarageStore((s) => s.kpis);
  const garage = useGarageStore((s) => s.garage);
  const pendingCount = useGarageStore(
    (s) => s.bookings.filter((b) => b.status === 'pending').length,
  );

  const kpiCards = [
    {
      label: 'Bookings This Week',
      value: kpis.bookingsThisWeek,
      trend: kpis.bookingsTrend,
      color: '#2563EB',
      icon: <CalendarMonthOutlinedIcon />,
    },
    {
      label: 'Pending Bookings',
      value: pendingCount || kpis.pendingBookings,
      trend: kpis.pendingTrend,
      color: '#DC2626',
      icon: <InboxOutlinedIcon />,
    },
    {
      label: 'Average Rating',
      value: kpis.averageRating,
      trend: kpis.ratingTrend,
      color: '#16A34A',
      icon: <StarOutlineIcon />,
    },
  ];

  const shortcuts = [
    { label: 'Edit Profile', icon: <PersonOutlineIcon />, path: '/profile/edit' },
    { label: 'Manage Services', icon: <WorkOutlineIcon />, path: '/services' },
    {
      label: 'Calendar Availability',
      icon: <CalendarMonthOutlinedIcon />,
      path: '/calendar',
    },
    { label: 'Booking Inbox', icon: <InboxOutlinedIcon />, path: '/bookings' },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Welcome back
        </Typography>
        <Typography variant="h5">{garage.name}</Typography>
        <Chip
          size="small"
          label={garage.status === 'live' ? 'Live' : garage.status}
          color={garage.status === 'live' ? 'success' : 'warning'}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" mb={1.5}>
          Key Performance Indicators
        </Typography>
        <Grid container spacing={2}>
          {kpiCards.map((kpi) => (
            <Grid key={kpi.label} size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  bgcolor: kpi.color,
                  color: '#fff',
                  border: 'none',
                  minHeight: 140,
                }}
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" mb={1.5}>
          Quick Access
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
