'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { locales, Locale, defaultLocale } from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale as Locale);
  
  useEffect(() => {
    // Get current locale from cookie on client side
    const savedLocale = Cookies.get('NEXT_LOCALE');
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setCurrentLocale(savedLocale as Locale);
    }
  }, []);
  
  const changeLanguage = (newLocale: Locale) => {
    // Set cookie
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365, path: '/' });
    
    // Reload the page to apply the new locale
    window.location.reload();
  };
  
  return (
    <div className={className}>
      <select 
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value as Locale)}
        className="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm"
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
