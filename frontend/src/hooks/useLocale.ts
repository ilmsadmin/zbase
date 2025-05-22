'use client';

import { useCallback, useEffect, useState } from 'react';
import { Locale, locales, defaultLocale } from '@/i18n';
import Cookies from 'js-cookie';

export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale as Locale);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get locale from cookie on first render
  useEffect(() => {
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      setCurrentLocale(cookieLocale as Locale);
    }
    setIsLoaded(true);
  }, []);

  const changeLocale = useCallback((locale: Locale) => {
    if (!locales.includes(locale)) return;
    
    // Save in cookie
    Cookies.set('NEXT_LOCALE', locale, { 
      expires: 365, // 1 year
      path: '/' 
    });
    
    // Update state
    setCurrentLocale(locale);
    
    // Reload page to apply changes
    window.location.reload();
  }, []);

  return {
    locale: currentLocale,
    isLoaded,
    changeLocale,
  };
}
