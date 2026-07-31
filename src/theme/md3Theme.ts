import { createTheme, alpha, type ThemeOptions } from '@mui/material/styles';

/** Material Design 3 inspired theme options for Go Garagi Garage */
export const md3ThemeOptions: ThemeOptions = {
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
    },
    error: { main: '#DC2626', light: '#FECACA', dark: '#991B1B' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#B45309' },
    success: { main: '#16A34A', light: '#BBF7D0', dark: '#166534' },
    info: { main: '#2563EB', light: '#BFDBFE', dark: '#1E40AF' },
    background: {
      default: '#F4F6FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitTapHighlightColor: 'transparent',
        },
        body: {
          minHeight: '100dvh',
          overscrollBehaviorY: 'none',
        },
        '#root': {
          minHeight: '100dvh',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
          minHeight: 44,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        sizeLarge: {
          minHeight: 52,
          borderRadius: 14,
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'medium' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          borderTop: '1px solid #E2E8F0',
          backgroundColor: alpha('#FFFFFF', 0.96),
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          '&.Mui-selected': { color: '#4F46E5' },
        },
        label: {
          fontSize: '0.7rem',
          '&.Mui-selected': { fontSize: '0.7rem' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#FFFFFF', 0.92),
          color: '#0F172A',
          boxShadow: 'none',
          borderBottom: '1px solid #E2E8F0',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderInlineEnd: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20 },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { boxShadow: '0 8px 24px rgba(79, 70, 229, 0.28)' },
      },
    },
  },
};

export const md3Theme = createTheme(md3ThemeOptions);
