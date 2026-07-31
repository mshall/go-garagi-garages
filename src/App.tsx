import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './navigation/AppRouter';
import { md3Theme } from './theme/md3Theme';

export default function App() {
  return (
    <ThemeProvider theme={md3Theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}
