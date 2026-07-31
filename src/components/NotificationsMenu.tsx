import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  buildNotifications,
  type AppNotification,
  type NotificationType,
} from '../domain/notifications';
import { useGarageStore } from '../store/useGarageStore';

const typeIcon: Record<NotificationType, React.ReactNode> = {
  booking: <InboxOutlinedIcon fontSize="small" color="primary" />,
  reminder: <ScheduleOutlinedIcon fontSize="small" color="warning" />,
  quote: <RequestQuoteOutlinedIcon fontSize="small" color="secondary" />,
  review: <RateReviewOutlinedIcon fontSize="small" color="success" />,
};

export function NotificationsMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const bookings = useGarageStore((s) => s.bookings);
  const quotes = useGarageStore((s) => s.quotes);
  const reviews = useGarageStore((s) => s.reviews);
  const readIds = useGarageStore((s) => s.readNotificationIds);
  const markNotificationRead = useGarageStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useGarageStore(
    (s) => s.markAllNotificationsRead,
  );

  const notifications = useMemo(
    () => buildNotifications({ bookings, quotes, reviews }),
    [bookings, quotes, reviews],
  );

  const unread = notifications.filter((n) => !readIds.includes(n.id));
  const unreadCount = unread.length;

  const openItem = (item: AppNotification) => {
    markNotificationRead(item.id);
    setAnchor(null);
    navigate(item.path);
  };

  return (
    <>
      <Tooltip title={t('common.notifications')}>
        <IconButton
          aria-label={t('common.notifications')}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 'min(100vw - 24px, 380px)', sm: 380 },
              maxHeight: 480,
              mt: 1,
            },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1.5}
        >
          <Typography fontWeight={700}>{t('notifications.title')}</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={() => markAllNotificationsRead(notifications.map((n) => n.id))}>
              {t('common.markAllRead')}
            </Button>
          )}
        </Stack>
        <Divider />

        {notifications.length === 0 ? (
          <Box px={2} py={4} textAlign="center">
            <Typography color="text.secondary">{t('common.noNotifications')}</Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ overflowY: 'auto', maxHeight: 400 }}>
            {notifications.map((item) => {
              const isUnread = !readIds.includes(item.id);
              return (
                <ListItemButton
                  key={item.id}
                  onClick={() => openItem(item)}
                  sx={{
                    alignItems: 'flex-start',
                    gap: 1,
                    bgcolor: isUnread ? 'action.hover' : 'transparent',
                    py: 1.25,
                  }}
                >
                  <Box mt={0.5}>{typeIcon[item.type]}</Box>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="body2" fontWeight={isUnread ? 700 : 500}>
                          {t(`notifications.${item.titleKey}`, item.params)}
                        </Typography>
                        <Chip
                          size="small"
                          label={t(`notifications.types.${item.type}`)}
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </Stack>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {t(`notifications.${item.detailKey}`, item.params)}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {dayjs(item.createdAt).format('D MMM · h:mm A')}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Popover>
    </>
  );
}
