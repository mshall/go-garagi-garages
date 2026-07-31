import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../../store/useGarageStore';

export function ProfilePage() {
  const navigate = useNavigate();
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
              label={garage.status}
              color={garage.status === 'live' ? 'success' : 'warning'}
              sx={{ width: 'fit-content', textTransform: 'capitalize' }}
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
            Contact & location
          </Typography>
          <Stack spacing={1}>
            <Row label="Owner" value={garage.ownerName} />
            <Row label="WhatsApp" value={garage.whatsapp} />
            <Row label="Phone" value={garage.phone || '—'} />
            <Row label="Email" value={garage.email || user?.email || '—'} />
            <Row label="Address" value={`${garage.address}, ${garage.city}`} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1.5}>
            Insurer networks
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
            Operating hours
          </Typography>
          <Stack spacing={0.75}>
            {garage.hours.map((h) => (
              <Stack key={h.day} direction="row" justifyContent="space-between">
                <Typography variant="body2">{h.day}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {h.open ? `${h.start} – ${h.end}` : 'Closed'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography fontWeight={700} mb={1}>
            Catalog services selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCatalogIds.length} service categories enabled
          </Typography>
        </CardContent>
      </Card>

      <Button variant="contained" size="large" onClick={() => navigate('/profile/edit')}>
        Edit Garage Profile
      </Button>
      <Button variant="outlined" onClick={() => navigate('/promotions')}>
        Promotions Manager
      </Button>
      <Button variant="outlined" onClick={() => navigate('/onboarding')}>
        Re-run Onboarding
      </Button>
      <Divider />
      <Button variant="outlined" color="secondary" onClick={() => resetDemoData()}>
        Reset Demo Data
      </Button>
      <Button
        variant="text"
        color="error"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Sign out
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
