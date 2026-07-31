import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { GarageApiError, garageApi } from '../../api/garageClient';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useGarageStore } from '../../store/useGarageStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const login = useGarageStore((s) => s.login);
  const isAuthenticated = useGarageStore((s) => s.isAuthenticated);
  const [email, setEmail] = useState('khalid@alquozgarage.ae');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await garageApi.login(email, password);
      login(email, password);
      navigate('/');
    } catch (err) {
      // Fall back to local demo store if API is offline (dev convenience)
      const offline =
        err instanceof TypeError ||
        (err instanceof GarageApiError && err.status >= 500);
      if (offline && login(email, password)) {
        navigate('/');
        return;
      }
      setError(
        err instanceof GarageApiError
          ? err.message
          : 'Unable to reach garage API',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
        background:
          'radial-gradient(1200px 600px at 10% -10%, #C7D2FE 0%, transparent 55%), radial-gradient(900px 500px at 100% 0%, #BAE6FD 0%, transparent 50%), #F4F6FB',
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, insetInlineEnd: 12 }}>
        <LanguageSwitcher />
      </Box>
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1} alignItems="center" textAlign="center">
              <BuildCircleOutlinedIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h5">{t('login.title')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('login.subtitle')}
              </Typography>
            </Stack>

            <TextField
              label={t('login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={busy}
            >
              {t('common.signIn')}
            </Button>

            <Typography variant="caption" color="text.secondary" textAlign="center">
              {t('login.demoHint')}{' '}
              <Button
                size="small"
                onClick={() => {
                  login(email, password);
                  navigate('/onboarding');
                }}
              >
                {t('login.startOnboarding')}
              </Button>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
