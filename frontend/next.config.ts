import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Disable the Next.js i18n routing features
  // as we're handling the locale ourselves via cookies
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localeDetection: false
  }
};

export default withNextIntl(nextConfig);
