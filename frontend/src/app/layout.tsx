import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { AbilityProvider } from "@/abilities/AbilityContext";
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from '@/i18n';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZBase - Hệ thống quản lý",
  description: "Hệ thống quản lý với xác thực và phân quyền",
};

// Get messages for the locale
async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}/index`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale if the requested locale is not found
    return (await import(`@/messages/${defaultLocale}/index`)).default;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from cookie
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = cookieLocale && locales.includes(cookieLocale as any) ? cookieLocale : defaultLocale;
  
  // Get messages for the current locale
  const messages = await getMessages(locale);
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <AbilityProvider>
              {children}
            </AbilityProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
