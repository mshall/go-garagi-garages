import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../store/useGarageStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationsMenu } from './NotificationsMenu';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onMenuClick?: () => void;
  showMenu?: boolean;
  onLanguageChanged?: () => void;
}

export function PageHeader({
  title,
  showBack,
  onMenuClick,
  showMenu,
  onLanguageChanged,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useGarageStore((s) => s.user);

  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar sx={{ gap: 0.25, minHeight: { xs: 56, sm: 64 } }}>
        {showBack ? (
          <IconButton edge="start" onClick={() => navigate(-1)} aria-label={t('common.back')}>
            <ArrowBackIcon />
          </IconButton>
        ) : showMenu ? (
          <IconButton edge="start" onClick={onMenuClick} aria-label={t('common.menu')}>
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
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        <LanguageSwitcher onLanguageChanged={() => onLanguageChanged?.()} />
        <NotificationsMenu />
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            fontSize: '0.85rem',
            cursor: 'pointer',
            ml: 0.25,
          }}
          onClick={() => navigate('/profile')}
        >
          {user?.initials ?? 'GR'}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
