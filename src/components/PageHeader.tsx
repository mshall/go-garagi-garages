import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../store/useGarageStore';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function PageHeader({
  title,
  showBack,
  onMenuClick,
  showMenu,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const user = useGarageStore((s) => s.user);
  const notifications = useGarageStore((s) => s.notifications);

  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar sx={{ gap: 0.5, minHeight: { xs: 56, sm: 64 } }}>
        {showBack ? (
          <IconButton edge="start" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
        ) : showMenu ? (
          <IconButton edge="start" onClick={onMenuClick} aria-label="Menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ width: 40 }} />
        )}
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: { xs: '1.05rem', sm: '1.25rem' },
          }}
        >
          {title}
        </Typography>
        <IconButton aria-label="Notifications" onClick={() => navigate('/bookings')}>
          <Badge badgeContent={notifications} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/profile')}
        >
          {user?.initials ?? 'GR'}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
