// Define locale settings here so they can be shared across the app
export const locales = ['vi', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'vi' as const;
