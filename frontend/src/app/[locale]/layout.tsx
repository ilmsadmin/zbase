import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { defaultLocale } from '../../i18n';
 
// Trích xuất message tương ứng với locale từ file messages
async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}/index`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale if the requested locale is not found
    return (await import(`../../messages/${defaultLocale}/index`)).default;
  }
}
 
export async function generateStaticParams() {
  const { locales } = await import('../../i18n');
  return locales.map((locale) => ({ locale }));
}
 
type Props = {
  children: ReactNode;
  params: { locale: string };
};
 
export default async function LocaleLayout({ children, params }: Props) {
  // In Next.js 14+ we need to be very careful with dynamic params
  // First, let's ensure the params is awaited properly
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Get messages for the locale
  const messages = await getMessages(locale);
 
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
