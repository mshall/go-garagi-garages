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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { useGarageStore } from '../store/useGarageStore';

const DRAWER_WIDTH = 280;

const navItems = [
  { label: 'Home', path: '/', icon: <HomeOutlinedIcon />, mobile: true },
  {
    label: 'Bookings',
    path: '/bookings',
    icon: <InboxOutlinedIcon />,
    mobile: true,
    badge: true,
  },
  {
    label: 'Quotes',
    path: '/quotes',
    icon: <RequestQuoteOutlinedIcon />,
    mobile: false,
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: <CalendarMonthOutlinedIcon />,
    mobile: false,
  },
  {
    label: 'Services',
    path: '/services',
    icon: <HandymanOutlinedIcon />,
    mobile: true,
  },
  {
    label: 'Promotions',
    path: '/promotions',
    icon: <LocalOfferOutlinedIcon />,
    mobile: false,
  },
  {
    label: 'Reviews',
    path: '/reviews',
    icon: <ReviewsOutlinedIcon />,
    mobile: false,
  },
  {
    label: 'Earnings',
    path: '/earnings',
    icon: <PaymentsOutlinedIcon />,
    mobile: false,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <AssessmentOutlinedIcon />,
    mobile: true,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <PersonOutlineIcon />,
    mobile: false,
  },
];

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/bookings': 'Booking Inbox',
  '/quotes': 'Quote Requests',
  '/calendar': 'Calendar Availability',
  '/services': 'Services & Pricing',
  '/promotions': 'Promotions Manager',
  '/reviews': 'Reviews',
  '/earnings': 'Earnings & Payouts',
  '/reports': 'Reports',
  '/profile': 'Garage Profile',
  '/profile/edit': 'Edit Garage Profile',
};

export function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifications = useGarageStore((s) => s.notifications);

  const mobileValue = useMemo(() => {
    const mobilePaths = ['/', '/bookings', '/services', '/reports'];
    const match = mobilePaths.find(
      (p) => location.pathname === p || (p !== '/' && location.pathname.startsWith(p)),
    );
    return match ?? '/';
  }, [location.pathname]);

  const title =
    titles[location.pathname] ??
    (location.pathname.startsWith('/bookings/')
      ? 'Reject Booking'
      : 'Go Garagi');

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Box>
          <Typography variant="subtitle1" color="primary" fontWeight={800}>
            Go Garagi
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Garage Operating System
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
              <ListItemIcon sx={{ minWidth: 40, color: selected ? 'primary.main' : 'inherit' }}>
                {item.badge ? (
                  <Badge badgeContent={notifications} color="error">
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
          showBack={location.pathname.includes('/reject') || location.pathname.includes('/edit')}
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
            <BottomNavigationAction label="Home" value="/" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction
              label="Bookings"
              value="/bookings"
              icon={
                <Badge badgeContent={notifications} color="error">
                  <InboxOutlinedIcon />
                </Badge>
              }
            />
            <BottomNavigationAction
              label="Services"
              value="/services"
              icon={<HandymanOutlinedIcon />}
            />
            <BottomNavigationAction
              label="Reports"
              value="/reports"
              icon={<AssessmentOutlinedIcon />}
            />
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
}
