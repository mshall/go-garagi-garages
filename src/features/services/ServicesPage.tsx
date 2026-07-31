import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { formatAed, formatDuration } from '../../domain/format';
import type { ServiceOffering } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

const emptyForm = {
  name: '',
  category: 'General Maintenance',
  durationMinutes: 60,
  priceAed: 100,
  compareAtAed: undefined as number | undefined,
  active: true,
};

export function ServicesPage() {
  const services = useGarageStore((s) => s.services);
  const addService = useGarageStore((s) => s.addService);
  const updateService = useGarageStore((s) => s.updateService);
  const deleteService = useGarageStore((s) => s.deleteService);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceOffering | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (svc: ServiceOffering) => {
    setEditing(svc);
    setForm({
      name: svc.name,
      category: svc.category,
      durationMinutes: svc.durationMinutes,
      priceAed: svc.priceAed,
      compareAtAed: svc.compareAtAed,
      active: svc.active,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) updateService(editing.id, form);
    else addService(form);
    setOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Your Service Offerings</Typography>
      <Button variant="contained" size="large" fullWidth onClick={openCreate}>
        + Add New Service
      </Button>

      <Typography variant="subtitle2" color="text.secondary">
        List of Services
      </Typography>

      <Stack spacing={1.5}>
        {services.map((svc) => (
          <Card key={svc.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={700}>{svc.name}</Typography>
                  <Chip
                    size="small"
                    label={svc.category}
                    sx={{ mt: 0.75, bgcolor: '#F1F5F9' }}
                  />
                  <Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
                    <TimerOutlinedIcon sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(svc.durationMinutes)}
                    </Typography>
                  </Stack>
                </Box>
                <Stack alignItems="flex-end" spacing={0.5}>
                  {svc.compareAtAed != null && (
                    <Chip
                      size="small"
                      label={formatAed(svc.compareAtAed)}
                      sx={{ bgcolor: '#F1F5F9' }}
                    />
                  )}
                  <Typography fontWeight={800} color="primary">
                    {formatAed(svc.priceAed)}
                  </Typography>
                  <Stack direction="row" spacing={0.5} mt={1}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(svc)}
                      aria-label="Edit service"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteService(svc.id)}
                      aria-label="Delete service"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Service Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Price (AED)"
              type="number"
              value={form.priceAed}
              onChange={(e) =>
                setForm({ ...form, priceAed: Number(e.target.value) })
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
