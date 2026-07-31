import { useMemo, useState } from 'react';
import Badge from '@mui/material/Badge';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { buildNotifications } from '../domain/notifications';
import { useGarageStore } from '../store/useGarageStore';
import { PageHeader } from './PageHeader';

const DRAWER_WIDTH = 280;

export function AppShell() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setLangTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const bookings = useGarageStore((s) => s.bookings);
  const quotes = useGarageStore((s) => s.quotes);
  const reviews = useGarageStore((s) => s.reviews);
  const readIds = useGarageStore((s) => s.readNotificationIds);

  const unreadCount = useMemo(() => {
    const all = buildNotifications({ bookings, quotes, reviews });
    return all.filter((n) => !readIds.includes(n.id)).length;
  }, [bookings, quotes, reviews, readIds]);

  const navItems = useMemo(
    () => [
      { label: t('nav.home'), path: '/', icon: <HomeOutlinedIcon />, badge: false },
      {
        label: t('nav.bookings'),
        path: '/bookings',
        icon: <InboxOutlinedIcon />,
        badge: true,
      },
      {
        label: t('nav.quotes'),
        path: '/quotes',
        icon: <RequestQuoteOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.calendar'),
        path: '/calendar',
        icon: <CalendarMonthOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.services'),
        path: '/services',
        icon: <HandymanOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.promotions'),
        path: '/promotions',
        icon: <LocalOfferOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.reviews'),
        path: '/reviews',
        icon: <ReviewsOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.earnings'),
        path: '/earnings',
        icon: <PaymentsOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.reports'),
        path: '/reports',
        icon: <AssessmentOutlinedIcon />,
        badge: false,
      },
      {
        label: t('nav.profile'),
        path: '/profile',
        icon: <PersonOutlineIcon />,
        badge: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- i18n.language drives re-translate
    [t, i18n.language],
  );

  const titleMap: Record<string, string> = {
    '/': t('titles.dashboard'),
    '/bookings': t('titles.bookingInbox'),
    '/quotes': t('titles.quoteRequests'),
    '/calendar': t('titles.calendar'),
    '/services': t('titles.services'),
    '/promotions': t('titles.promotions'),
    '/reviews': t('titles.reviews'),
    '/earnings': t('titles.earnings'),
    '/reports': t('titles.reports'),
    '/profile': t('titles.profile'),
    '/profile/edit': t('titles.editProfile'),
  };

  const mobileValue = useMemo(() => {
    const mobilePaths = ['/', '/bookings', '/services', '/reports'];
    const match = mobilePaths.find(
      (p) =>
        location.pathname === p ||
        (p !== '/' && location.pathname.startsWith(p)),
    );
    return match ?? '/';
  }, [location.pathname]);

  const title =
    titleMap[location.pathname] ??
    (location.pathname.includes('/reject')
      ? t('titles.rejectBooking')
      : t('app.name'));

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Box>
          <Typography variant="subtitle1" color="primary" fontWeight={800}>
            {t('app.name')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('app.tagline')}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon
                sx={{ minWidth: 40, color: selected ? 'primary.main' : 'inherit' }}
              >
                {item.badge ? (
                  <Badge badgeContent={unreadCount} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: DRAWER_WIDTH }}>{drawer}</Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          pb: { xs: 'calc(72px + env(safe-area-inset-bottom))', md: 0 },
        }}
      >
        <PageHeader
          title={title}
          showMenu={!isDesktop}
          onMenuClick={() => setDrawerOpen(true)}
          showBack={
            location.pathname.includes('/reject') ||
            location.pathname.includes('/edit')
          }
          onLanguageChanged={() => setLangTick((n) => n + 1)}
        />
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            maxWidth: 1100,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>

        {!isDesktop && (
          <BottomNavigation
            value={mobileValue}
            onChange={(_, value: string) => navigate(value)}
            showLabels
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: (t) => t.zIndex.appBar,
              pb: 'env(safe-area-inset-bottom)',
            }}
          >
            <BottomNavigationAction
              label={t('nav.home')}
              value="/"
              icon={<HomeOutlinedIcon />}
            />
            <BottomNavigationAction
              label={t('nav.bookings')}
              value="/bookings"
              icon={
                <Badge badgeContent={unreadCount} color="error">
                  <InboxOutlinedIcon />
                </Badge>
              }
            />
            <BottomNavigationAction
              label={t('nav.services')}
              value="/services"
              icon={<HandymanOutlinedIcon />}
            />
            <BottomNavigationAction
              label={t('nav.reports')}
              value="/reports"
              icon={<AssessmentOutlinedIcon />}
            />
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
}
