import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '../i18n';
 
export default getRequestConfig(async ({ locale }) => {
  // Make sure locale is defined and is a string
  const resolvedLocale = locale || defaultLocale;
  
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
