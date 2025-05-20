import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '../i18n';
 
// Re-export the locales and defaultLocale from i18n.ts
export { locales, defaultLocale };

// Function to strip locale prefix from a path
export function stripLocaleFromPath(path: string): string {
  if (typeof path !== 'string') return path;
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);
  return path.replace(localePattern, '/');
}

// Create navigation utilities for i18n
export const { Link, redirect, useRouter: baseUseRouter, usePathname } = createNavigation({
  locales,
  defaultLocale
});

// Wrapper for useRouter to fix duplicate locale issue
export function useRouter() {
  const router = baseUseRouter();
  const originalPush = router.push;
    router.push = (href, options) => {
    if (typeof href === 'string') {
      // If href already starts with a locale, strip it
      const processedHref = stripLocaleFromPath(href);
      return originalPush(processedHref, options);
    }
    
    return originalPush(href, options);
  };
  
  const originalReplace = router.replace;
  router.replace = (href, options) => {
    if (typeof href === 'string') {
      // Same logic for replace
      const processedHref = stripLocaleFromPath(href);
      return originalReplace(processedHref, options);
    }
    
    return originalReplace(href, options);
  };
  
  return router;
}

export function getLocale() {
  // In client environment, can't use headers() from next/headers
  // so we use the defaultLocale
  return defaultLocale;
}
