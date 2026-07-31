import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../../store/useGarageStore';

export function PendingApprovalPage() {
  const navigate = useNavigate();
  const garage = useGarageStore((s) => s.garage);
  const setGarageStatus = useGarageStore((s) => s.setGarageStatus);

  const rows = [
    { icon: <PersonOutlineIcon fontSize="small" />, label: 'Garage Name', value: garage.name },
    { icon: <PlaceOutlinedIcon fontSize="small" />, label: 'Address', value: garage.address },
    { icon: <EmailOutlinedIcon fontSize="small" />, label: 'Email', value: garage.email || '—' },
    { icon: <PhoneOutlinedIcon fontSize="small" />, label: 'Phone', value: garage.whatsapp },
    {
      icon: <CalendarTodayOutlinedIcon fontSize="small" />,
      label: 'Submitted On',
      value: garage.submittedOn || '—',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 520 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Thanks for submitting your garage!
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
          We&apos;re reviewing your application. You&apos;ll be notified once it&apos;s approved.
        </Typography>

        <Stack alignItems="center" spacing={2} mb={3}>
          <Chip
            icon={<HourglassEmptyIcon />}
            label="Pending Approval"
            sx={{ bgcolor: '#FFEDD5', color: '#C2410C', fontWeight: 700 }}
          />
          <HourglassEmptyIcon sx={{ fontSize: 96, color: 'primary.light' }} />
        </Stack>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <PersonOutlineIcon color="primary" />
              <Typography fontWeight={700} color="primary">
                Submitted Garage Details
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {rows.map((row) => (
                <Stack
                  key={row.label}
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} color="text.secondary" alignItems="center">
                    {row.icon}
                    <Typography variant="body2" color="text.secondary">
                      {row.label}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600} textAlign="right" maxWidth="60%">
                    {row.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={1.5} mt={3}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => {
              setGarageStatus('live');
              navigate('/');
            }}
          >
            Simulate Admin Approval
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/login')}>
            Back to login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
