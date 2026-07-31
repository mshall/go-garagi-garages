import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../../store/useGarageStore';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const garage = useGarageStore((s) => s.garage);
  const updateGarage = useGarageStore((s) => s.updateGarage);
  const [name, setName] = useState(garage.name);
  const [ownerName, setOwnerName] = useState(garage.ownerName);
  const [whatsapp, setWhatsapp] = useState(garage.whatsapp);
  const [phone, setPhone] = useState(garage.phone ?? '');
  const [email, setEmail] = useState(garage.email ?? '');
  const [description, setDescription] = useState(garage.description);
  const [address, setAddress] = useState(garage.address);

  return (
    <Stack spacing={2.5} maxWidth={640}>
      <Typography variant="body2" color="text.secondary">
        {t('profile.editSubtitle')}
      </Typography>
      <TextField
        label={t('profile.garageName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.ownerName')}
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.whatsapp')}
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.phone')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.address')}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
      />
      <TextField
        label={t('profile.description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={4}
      />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => {
          updateGarage({
            name,
            ownerName,
            whatsapp,
            phone,
            email,
            address,
            description,
          });
          navigate('/profile');
        }}
      >
        {t('profile.saveChanges')}
      </Button>
    </Stack>
  );
}
