'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { defaultLocale, locales } from '@/i18n';
import type { Locale } from '@/i18n';

export default function CookieLanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<string>(defaultLocale);
  
  useEffect(() => {
    // Get locale from cookie on client side
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale && locales.includes(cookieLocale as any)) {
      setCurrentLocale(cookieLocale);
    }
  }, []);
  
  const changeLanguage = (newLocale: string) => {
    if (newLocale && locales.includes(newLocale as any)) {
      // Set cookie with 1 year expiration
      Cookies.set('NEXT_LOCALE', newLocale, { 
        path: '/', 
        expires: 365 
      });
      
      // Reload the page to apply the new locale
      window.location.reload();
    }
  };
  
  return (
    <select 
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm"
      aria-label="Select language"
    >
      <option value="vi">Tiếng Việt</option>
      <option value="en">English</option>
    </select>
  );
}
