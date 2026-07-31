import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import TireRepairOutlinedIcon from '@mui/icons-material/TireRepairOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import BatteryChargingFullOutlinedIcon from '@mui/icons-material/BatteryChargingFullOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import LocalCarWashOutlinedIcon from '@mui/icons-material/LocalCarWashOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { CATALOG_SERVICES } from '../../data/seed';
import { useGarageStore } from '../../store/useGarageStore';
import type { OperatingHours } from '../../domain/types';

const iconMap: Record<string, React.ReactNode> = {
  droplet: <WaterDropOutlinedIcon />,
  tire: <TireRepairOutlinedIcon />,
  car: <DirectionsCarOutlinedIcon />,
  brake: <SpeedOutlinedIcon />,
  ac: <AcUnitOutlinedIcon />,
  battery: <BatteryChargingFullOutlinedIcon />,
  body: <ConstructionOutlinedIcon />,
  wrap: <LayersOutlinedIcon />,
  polish: <BrushOutlinedIcon />,
  tint: <WbSunnyOutlinedIcon />,
  wash: <LocalCarWashOutlinedIcon />,
  other: <CheckCircleOutlineIcon />,
};

const defaultHours: OperatingHours[] = [
  { day: 'Monday', open: true, start: '09:00', end: '18:00' },
  { day: 'Tuesday', open: true, start: '09:00', end: '18:00' },
  { day: 'Wednesday', open: true, start: '09:00', end: '18:00' },
  { day: 'Thursday', open: true, start: '09:00', end: '18:00' },
  { day: 'Friday', open: true, start: '09:00', end: '17:00' },
  { day: 'Saturday', open: true, start: '10:00', end: '16:00' },
  { day: 'Sunday', open: false, start: '09:00', end: '18:00' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const completeOnboarding = useGarageStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Al Quoz Industrial Area 3, Dubai');
  const [hours, setHours] = useState(defaultHours);
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [selected, setSelected] = useState<string[]>([
    'oil',
    'diag',
    'brake',
    'ac',
  ]);

  const canNext = useMemo(() => {
    if (step === 0) return name.trim() && ownerName.trim() && whatsapp.trim();
    if (step === 1) return selected.length > 0;
    return true;
  }, [step, name, ownerName, whatsapp, selected]);

  const submit = () => {
    completeOnboarding(
      {
        name,
        ownerName,
        whatsapp,
        phone,
        email,
        description,
        address,
        city: 'Dubai',
        hours,
        tradeLicenseUploaded: licenseUploaded,
        status: 'pending',
      },
      selected,
    );
    navigate('/pending-approval');
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        pb: 4,
        background:
          step === 1
            ? 'linear-gradient(180deg, #FDBA74 0%, #FFF7ED 180px, #F4F6FB 180px)'
            : undefined,
      }}
    >
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, pt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {step === 0 ? 'Register Your Garage' : 'What Services Do You Offer?'}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Step {step + 1} of 2 — {step === 0 ? 'Business details' : 'Services catalog'}
        </Typography>

        {step === 0 && (
          <Stack spacing={2.5}>
            <TextField
              label="Garage Name"
              placeholder="Enter your garage's official name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Owner Name"
              placeholder="Full name of the garage owner"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="WhatsApp Number (Required)"
              placeholder="e.g., +971 50 123 4567"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Phone Number (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email Address (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <Card
              variant="outlined"
              sx={{
                borderStyle: 'dashed',
                cursor: 'pointer',
                bgcolor: licenseUploaded ? 'success.light' : 'background.paper',
              }}
              onClick={() => setLicenseUploaded(true)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                <Typography fontWeight={600}>
                  {licenseUploaded ? 'Trade license uploaded' : 'Upload Trade License'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag & drop or click to upload (PDF or image)
                </Typography>
              </CardContent>
            </Card>

            <TextField
              label="Garage Description"
              placeholder="Tell us more about your garage, services, and specialties."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />

            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PlaceOutlinedIcon color="primary" />
                  <Box flex={1}>
                    <Typography fontWeight={600}>Pin Garage Location</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </Box>
                  <Chip label="Pinned" color="primary" size="small" />
                </Stack>
                <TextField
                  sx={{ mt: 2 }}
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                />
              </CardContent>
            </Card>

            <Typography variant="subtitle1">Set Working Hours (Mon–Sun)</Typography>
            <Stack spacing={1}>
              {hours.map((h, idx) => (
                <Card key={h.day}>
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ sm: 'center' }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={h.open}
                            onChange={(e) => {
                              const next = [...hours];
                              next[idx] = { ...h, open: e.target.checked };
                              setHours(next);
                            }}
                          />
                        }
                        label={h.day}
                        sx={{ minWidth: 140 }}
                      />
                      {h.open ? (
                        <Stack direction="row" spacing={1} flex={1}>
                          <TextField
                            type="time"
                            size="small"
                            value={h.start}
                            onChange={(e) => {
                              const next = [...hours];
                              next[idx] = { ...h, start: e.target.value };
                              setHours(next);
                            }}
                            fullWidth
                          />
                          <TextField
                            type="time"
                            size="small"
                            value={h.end}
                            onChange={(e) => {
                              const next = [...hours];
                              next[idx] = { ...h, end: e.target.value };
                              setHours(next);
                            }}
                            fullWidth
                          />
                        </Stack>
                      ) : (
                        <Chip label="Closed" size="small" />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!canNext}
              onClick={() => setStep(1)}
            >
              Next
            </Button>
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={1.5}>
            {CATALOG_SERVICES.map((svc) => {
              const on = selected.includes(svc.id);
              return (
                <Card key={svc.id}>
                  <CardContent sx={{ py: 1.25, '&:last-child': { pb: 1.25 } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box color="text.secondary">{iconMap[svc.icon]}</Box>
                      <Typography flex={1} fontWeight={500}>
                        {svc.name}
                      </Typography>
                      <Switch
                        checked={on}
                        onChange={() =>
                          setSelected((prev) =>
                            on
                              ? prev.filter((id) => id !== svc.id)
                              : [...prev, svc.id],
                          )
                        }
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
            <Stack direction="row" spacing={1} pt={1}>
              <Button variant="outlined" fullWidth onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!canNext}
                onClick={submit}
                sx={{ bgcolor: '#EA580C', '&:hover': { bgcolor: '#C2410C' } }}
              >
                Submit Registration
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
