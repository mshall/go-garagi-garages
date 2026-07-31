import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useGarageStore } from '../../store/useGarageStore';

export function EditProfilePage() {
  const navigate = useNavigate();
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
        Update how customers see your garage on Go Garagi.
      </Typography>
      <TextField
        label="Garage Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        fullWidth
      />
      <TextField
        label="WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        fullWidth
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
      />
      <TextField
        label="Description"
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
        Save Changes
      </Button>
    </Stack>
  );
}
