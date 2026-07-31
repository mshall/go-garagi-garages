import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useGarageStore } from '../../store/useGarageStore';

type ResponseFilter = 'all' | 'awaiting' | 'responded';
type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';

export function ReviewsPage() {
  const reviews = useGarageStore((s) => s.reviews);
  const garage = useGarageStore((s) => s.garage);
  const respondToReview = useGarageStore((s) => s.respondToReview);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [query, setQuery] = useState('');
  const [responseFilter, setResponseFilter] = useState<ResponseFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>(
    'newest',
  );

  const services = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.serviceName))).sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    let list = [...reviews];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q),
      );
    }
    if (responseFilter === 'awaiting') list = list.filter((r) => !r.response);
    if (responseFilter === 'responded') list = list.filter((r) => !!r.response);
    if (ratingFilter !== 'all') {
      list = list.filter((r) => r.rating === Number(ratingFilter));
    }
    if (serviceFilter !== 'all') {
      list = list.filter((r) => r.serviceName === serviceFilter);
    }
    list.sort((a, b) => {
      if (sortBy === 'newest')
        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
      if (sortBy === 'oldest')
        return dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf();
      if (sortBy === 'highest') return b.rating - a.rating;
      return a.rating - b.rating;
    });
    return list;
  }, [reviews, query, responseFilter, ratingFilter, serviceFilter, sortBy]);

  return (
    <Stack spacing={2}>
      <Card sx={{ bgcolor: 'primary.main', color: '#fff', border: 'none' }}>
        <CardContent>
          <Typography variant="h3" fontWeight={800}>
            {garage.rating.toFixed(1)}
          </Typography>
          <Rating value={garage.rating} precision={0.1} readOnly sx={{ color: '#FDE68A' }} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Based on {garage.reviewCount} customer reviews · showing {filtered.length}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Search reviews"
              placeholder="Customer, service, or comment"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              size="small"
            />
            <ToggleButtonGroup
              exclusive
              size="small"
              value={responseFilter}
              onChange={(_, v: ResponseFilter | null) => v && setResponseFilter(v)}
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="awaiting">Awaiting reply</ToggleButton>
              <ToggleButton value="responded">Responded</ToggleButton>
            </ToggleButtonGroup>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Rating</InputLabel>
                <Select
                  label="Rating"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
                >
                  <MenuItem value="all">All ratings</MenuItem>
                  <MenuItem value="5">5 stars</MenuItem>
                  <MenuItem value="4">4 stars</MenuItem>
                  <MenuItem value="3">3 stars</MenuItem>
                  <MenuItem value="2">2 stars</MenuItem>
                  <MenuItem value="1">1 star</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Service</InputLabel>
                <Select
                  label="Service"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <MenuItem value="all">All services</MenuItem>
                  {services.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as typeof sortBy)
                  }
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="highest">Highest rating</MenuItem>
                  <MenuItem value="lowest">Lowest rating</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {filtered.map((r) => (
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
              <Stack mt={1.5} p={1.5} bgcolor="#F8FAFC" borderRadius={2} spacing={0.5}>
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

      {filtered.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              No reviews match your filters.
            </Typography>
          </CardContent>
        </Card>
      )}

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
