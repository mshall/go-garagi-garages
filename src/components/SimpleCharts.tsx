import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartDatum[];
  height?: number;
  valueFormatter?: (v: number) => string;
}

export function SimpleBarChart({
  data,
  height = 180,
  valueFormatter = (v) => String(v),
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{ height, width: '100%', px: 0.5 }}
    >
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <Stack key={d.label} flex={1} alignItems="center" spacing={0.5} height="100%">
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {valueFormatter(d.value)}
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 48,
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: `${pct}%`,
                  minHeight: d.value > 0 ? 8 : 2,
                  borderRadius: '8px 8px 4px 4px',
                  bgcolor: d.color ?? 'primary.main',
                  transition: 'height 0.3s ease',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}
            >
              {d.label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

interface HorizontalBarProps {
  data: ChartDatum[];
  valueFormatter?: (v: number) => string;
}

export function SimpleHorizontalBars({
  data,
  valueFormatter = (v) => `${v}%`,
}: HorizontalBarProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <Stack spacing={1.25}>
      {data.map((d) => (
        <Box key={d.label}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{d.label}</Typography>
            <Typography variant="body2" fontWeight={700}>
              {valueFormatter(d.value)}
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: 'action.hover',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${(d.value / max) * 100}%`,
                bgcolor: d.color ?? 'primary.main',
                borderRadius: 999,
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

interface LineChartProps {
  data: ChartDatum[];
  height?: number;
  color?: string;
}

export function SimpleLineChart({
  data,
  height = 160,
  color = '#4F46E5',
}: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = Math.max(max - min, 1);
  const pad = 16;
  const w = 320;
  const h = height;
  const points = data.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1);
    const y = pad + ((max - d.value) / range) * (h - pad * 2);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} role="img">
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
            <text
              x={p.x}
              y={h - 2}
              textAnchor="middle"
              fontSize="10"
              fill="#64748B"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
}
