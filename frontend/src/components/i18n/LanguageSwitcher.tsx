'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Locale, locales, defaultLocale } from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale as Locale);
  
  // Get current locale on first render
  useEffect(() => {
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale as Locale)) {
      setCurrentLocale(cookieLocale as Locale);
    }
  }, []);

  const changeLanguage = useCallback((locale: Locale) => {
    // Save the locale in a cookie
    Cookies.set('NEXT_LOCALE', locale, { 
      path: '/', 
      expires: 365 // 1 year
    });

    // Update state
    setCurrentLocale(locale);
    
    // Reload the page to apply the new locale
    window.location.reload();
  }, []);

  return (
    <div className={className}>
      <select
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value as Locale)}
        className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm"
      >
        <option value="vi">🇻🇳 Tiếng Việt</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
  );
}
