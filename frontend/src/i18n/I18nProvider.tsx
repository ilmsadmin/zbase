'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { locales, Locale, defaultLocale } from '@/i18n';

// Create context with default values
type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale as Locale,
  setLocale: () => {}
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale: Locale;
}

export default function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  
  useEffect(() => {
    // Check if we have a cookie that overrides the initial locale
    const savedLocale = Cookies.get('NEXT_LOCALE');
    if (savedLocale && locales.includes(savedLocale as Locale) && savedLocale !== locale) {
      setLocaleState(savedLocale as Locale);
    }
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale && locales.includes(newLocale)) {
      // Set cookie
      Cookies.set('NEXT_LOCALE', newLocale, { expires: 365, path: '/' });
      setLocaleState(newLocale);
      
      // Refresh the page to apply the new locale
      window.location.reload();
    }
  };
  
  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
