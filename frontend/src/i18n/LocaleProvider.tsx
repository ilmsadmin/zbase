'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Locale, locales } from '../i18n';
import Cookies from 'js-cookie';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const activeLocale = useLocale();
  const [locale, setLocaleState] = useState(activeLocale);

  useEffect(() => {
    // Initialize from cookie on first render
    const savedLocale = Cookies.get('NEXT_LOCALE');
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    // Set cookie
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    setLocaleState(newLocale);
    
    // Reload page to apply the new locale
    window.location.reload();
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// Language switcher component
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();
  const t = useTranslations('common');
  
  return (
    <div className="flex items-center gap-2">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-white border rounded px-2 py-1 text-sm"
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
