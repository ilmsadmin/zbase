import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '../i18n';
import { cookies } from 'next/headers';
 
export default getRequestConfig(async ({ locale: defaultLocaleParam }) => {
  // Get locale from cookie if available
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Use cookie locale if it's valid, otherwise use the default
  const resolvedLocale = 
    cookieLocale && locales.includes(cookieLocale as any) 
      ? cookieLocale 
      : defaultLocaleParam || defaultLocale;
  
  try {
    const messages = (await import(`../messages/${resolvedLocale}/index`)).default;
    return {
      locale: resolvedLocale,
      messages,
      timeZone: 'Asia/Ho_Chi_Minh'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${resolvedLocale}`, error);
    // Fallback to default locale
    const messages = (await import(`../messages/${defaultLocale}/index`)).default;
    return {
      locale: defaultLocale,
      messages,
      timeZone: 'Asia/Ho_Chi_Minh'
    };
  }
});
