import { createNavigation } from 'next-intl/navigation';

// Define locale settings here so they can be shared across the app
export const locales = ['vi', 'en'] as const;
export const defaultLocale = 'vi' as const;

// Export shared navigation configuration
export const { Link, redirect, usePathname, useRouter } = 
  createNavigation({ locales, defaultLocale });
