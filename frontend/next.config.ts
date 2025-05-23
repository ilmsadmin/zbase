import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Create the next-intl plugin
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Note: i18n configuration in next.config.ts is not supported in App Router
// We're now handling i18n through the middleware.ts and i18n/request.ts
const nextConfig: NextConfig = {
  // Configuration options go here
};

export default withNextIntl(nextConfig);
