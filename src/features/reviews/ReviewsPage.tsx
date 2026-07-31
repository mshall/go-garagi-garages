import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useGarageStore } from '../../store/useGarageStore';

export function ReviewsPage() {
  const reviews = useGarageStore((s) => s.reviews);
  const garage = useGarageStore((s) => s.garage);
  const respondToReview = useGarageStore((s) => s.respondToReview);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  return (
    <Stack spacing={2}>
      <Card sx={{ bgcolor: 'primary.main', color: '#fff', border: 'none' }}>
        <CardContent>
          <Typography variant="h3" fontWeight={800}>
            {garage.rating.toFixed(1)}
          </Typography>
          <Rating value={garage.rating} precision={0.1} readOnly sx={{ color: '#FDE68A' }} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Based on {garage.reviewCount} customer reviews
          </Typography>
        </CardContent>
      </Card>

      {reviews.map((r) => (
        <Card key={r.id}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700}>{r.customerName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {dayjs(r.createdAt).format('D MMM YYYY')}
              </Typography>
            </Stack>
            <Rating value={r.rating} size="small" readOnly sx={{ my: 0.5 }} />
            <Typography variant="caption" color="text.secondary" display="block">
              {r.serviceName}
            </Typography>
            <Typography variant="body2" mt={1}>
              {r.comment}
            </Typography>
            {r.response ? (
              <Stack
                mt={1.5}
                p={1.5}
                bgcolor="#F8FAFC"
                borderRadius={2}
                spacing={0.5}
              >
                <Typography variant="caption" fontWeight={700} color="primary">
                  Your response
                </Typography>
                <Typography variant="body2">{r.response}</Typography>
              </Stack>
            ) : (
              <Button
                sx={{ mt: 1.5 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  setActiveId(r.id);
                  setResponse('');
                }}
              >
                Respond
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!activeId} onClose={() => setActiveId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Respond to Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 1 }}
            placeholder="Thank the customer and address their feedback…"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActiveId(null)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!response.trim()}
            onClick={() => {
              if (activeId) respondToReview(activeId, response.trim());
              setActiveId(null);
            }}
          >
            Send Response
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
