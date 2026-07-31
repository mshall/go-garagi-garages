import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import dayjs from 'dayjs';
import { QuoteStatusChip } from '../../components/StatusChip';
import { formatAed } from '../../domain/format';
import type { QuoteStatus } from '../../domain/types';
import { useGarageStore } from '../../store/useGarageStore';

export function QuotesPage() {
  const quotes = useGarageStore((s) => s.quotes);
  const submitQuote = useGarageStore((s) => s.submitQuote);
  const [tab, setTab] = useState<QuoteStatus>('new');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [price, setPrice] = useState('2500');
  const [eta, setEta] = useState('5');
  const [pickup, setPickup] = useState(true);
  const [notes, setNotes] = useState('OEM parts. Free pickup within Dubai.');

  const filtered = useMemo(
    () => quotes.filter((q) => q.status === tab),
    [quotes, tab],
  );

  const active = quotes.find((q) => q.id === activeId);

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Accident RFPs with masked customer PII until you win the job.
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v: QuoteStatus) => setTab(v)}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label="New" value="new" />
        <Tab label="Responded" value="responded" />
        <Tab label="Won" value="won" />
        <Tab label="Lost" value="lost" />
      </Tabs>

      <Stack spacing={1.5}>
        {filtered.map((q) => (
          <Card key={q.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700}>{q.id}</Typography>
                <QuoteStatusChip status={q.status} />
              </Stack>
              <Typography variant="body2" fontWeight={600}>
                {q.maskedCustomer} · {q.vehicle}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {q.damageSummary}
              </Typography>
              <Stack direction="row" spacing={2} mt={1.5} flexWrap="wrap">
                <Typography variant="caption" color="text.secondary">
                  Insurer: {q.insurer || 'Self-pay'}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhotoLibraryOutlinedIcon sx={{ fontSize: 14 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {q.mediaCount} media
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Expires {dayjs(q.expiresAt).format('D MMM, h:mm A')}
                </Typography>
              </Stack>
              {q.myQuote && (
                <Box mt={1.5} p={1.5} bgcolor="#F8FAFC" borderRadius={2}>
                  <Typography variant="body2" fontWeight={600}>
                    Your quote: {formatAed(q.myQuote.priceAed)} · {q.myQuote.etaDays} days
                    {q.myQuote.pickup ? ' · Pickup' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {q.myQuote.notes}
                  </Typography>
                </Box>
              )}
              {q.status === 'new' && (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => setActiveId(q.id)}
                >
                  Submit Quote
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent>
              <Typography color="text.secondary" textAlign="center">
                No {tab} quote requests.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>

      <Dialog open={!!active} onClose={() => setActiveId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Submit Quote — {active?.id}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Price (AED)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
            <TextField
              label="ETA (days)"
              type="number"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch checked={pickup} onChange={(e) => setPickup(e.target.checked)} />
              }
              label="Offer pickup / tow-in"
            />
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActiveId(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!activeId) return;
              submitQuote(activeId, {
                priceAed: Number(price),
                etaDays: Number(eta),
                pickup,
                notes,
              });
              setActiveId(null);
              setTab('responded');
            }}
          >
            Send Quote
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
