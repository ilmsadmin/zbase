import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '../i18n';
 
// Re-export the locales and defaultLocale from i18n.ts
export { locales, defaultLocale };

// Function to strip locale prefix from a path
// This is kept for backward compatibility with existing code but is not 
// needed for cookie-based i18n where paths don't have locale prefixes
export function stripLocaleFromPath(path: string): string {
  if (typeof path !== 'string') return path;
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);
  return path.replace(localePattern, '/');
}

// Create navigation utilities for i18n with cookie-based approach
export const { Link, redirect, useRouter: baseUseRouter, usePathname } = createNavigation({
  locales,
  defaultLocale,
  // For cookie-based i18n, we use a custom linking strategy with no locale prefix
  urlFromPath: (path) => path // No locale prefix
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
  // In client environment we need to use the cookie
  if (typeof document !== 'undefined') {
    // Browser environment
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (cookieMatch && locales.includes(cookieMatch[1] as any)) {
      return cookieMatch[1];
    }
  }
  // Fallback to default locale
  return defaultLocale;
}
