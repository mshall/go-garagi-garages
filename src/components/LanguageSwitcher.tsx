import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import TranslateIcon from '@mui/icons-material/Translate';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SUPPORTED_LANGUAGES,
  setAppLanguage,
  type AppLanguage,
} from '../i18n';

interface LanguageSwitcherProps {
  onLanguageChanged?: (lang: AppLanguage) => void;
}

export function LanguageSwitcher({ onLanguageChanged }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      <Tooltip title={t('common.language')}>
        <IconButton
          aria-label={t('common.language')}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = i18n.language === lang.code;
          return (
            <MenuItem
              key={lang.code}
              selected={selected}
              onClick={async () => {
                await setAppLanguage(lang.code);
                onLanguageChanged?.(lang.code);
                setAnchor(null);
              }}
            >
              {selected && (
                <ListItemIcon>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText inset={!selected}>
                {t(`languages.${lang.code}`)}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
