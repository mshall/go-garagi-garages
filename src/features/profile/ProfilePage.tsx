import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../../store/useGarageStore';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const garage = useGarageStore((s) => s.garage);
  const user = useGarageStore((s) => s.user);
  const logout = useGarageStore((s) => s.logout);
  const resetDemoData = useGarageStore((s) => s.resetDemoData);
  const selectedCatalogIds = useGarageStore((s) => s.selectedCatalogIds);

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">{garage.name}</Typography>
            <Chip
              size="small"
              label={t(`status.garage.${garage.status}`)}
              color={garage.status === 'live' ? 'success' : 'warning'}
              sx={{ width: 'fit-content' }}
            />
            <Typography variant="body2" color="text.secondary">
              {garage.description}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1.5}>
            {t('profile.contactLocation')}
          </Typography>
          <Stack spacing={1}>
            <Row label={t('profile.owner')} value={garage.ownerName} />
            <Row label={t('profile.whatsapp')} value={garage.whatsapp} />
            <Row label={t('profile.phone')} value={garage.phone || '—'} />
            <Row label={t('profile.email')} value={garage.email || user?.email || '—'} />
            <Row label={t('profile.address')} value={`${garage.address}, ${garage.city}`} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1.5}>
            {t('profile.insurerNetworks')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {garage.insurers.map((ins) => (
              <Chip key={ins} label={ins} color="primary" variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1.5}>
            {t('profile.operatingHours')}
          </Typography>
          <Stack spacing={0.75}>
            {garage.hours.map((h) => (
              <Stack key={h.day} direction="row" justifyContent="space-between">
                <Typography variant="body2">{t(`days.${h.day}`)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {h.open ? `${h.start} – ${h.end}` : t('common.closed')}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1}>
            {t('profile.catalogSelected')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('profile.categoriesEnabled', { count: selectedCatalogIds.length })}
          </Typography>
        </CardContent>
      </Card>

      <Button variant="contained" size="large" onClick={() => navigate('/profile/edit')}>
        {t('profile.editGarage')}
      </Button>
      <Button variant="outlined" onClick={() => navigate('/promotions')}>
        {t('profile.promotionsManager')}
      </Button>
      <Button variant="outlined" onClick={() => navigate('/onboarding')}>
        {t('profile.rerunOnboarding')}
      </Button>
      <Divider />
      <Button variant="outlined" color="secondary" onClick={() => resetDemoData()}>
        {t('profile.resetDemo')}
      </Button>
      <Button
        variant="text"
        color="error"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        {t('common.signOut')}
      </Button>
    </Stack>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}
