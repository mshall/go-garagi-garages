import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { isRtlLanguage } from './i18n';
import { AppRouter } from './navigation/AppRouter';
import { md3ThemeOptions } from './theme/md3Theme';

const ltrCache = createCache({ key: 'muiltr' });
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function App() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const rtl = isRtlLanguage(lang);

  useEffect(() => {
    const onChange = (next: string) => setLang(next);
    i18n.on('languageChanged', onChange);
    return () => {
      i18n.off('languageChanged', onChange);
    };
  }, [i18n]);

  const theme = useMemo(
    () =>
      createTheme({
        ...md3ThemeOptions,
        direction: rtl ? 'rtl' : 'ltr',
      }),
    [rtl],
  );

  return (
    <CacheProvider value={rtl ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}
