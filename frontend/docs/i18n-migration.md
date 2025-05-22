# I18n Migration Guide: From [locale] Routes to Cookie-based Approach

This guide explains how the application has been migrated from using locale-based routes (`/app/[locale]/`) to a cookie-based approach with all routes under `/app/`.

## What Has Been Done

1. Files moved from `/app/[locale]/` to `/app/`
2. LanguageSwitcher updated to use cookies
3. Navigation component updated to handle routes without locale prefixes
4. Middleware configured to detect locale from cookies

## Testing the Migration

To test the migration:

1. Start the application:
```bash
npm run dev
```

2. Navigate to different pages and verify they load correctly
3. Switch languages using the language switcher
4. Verify that the selected language is preserved on page refresh
5. Check that the URLs no longer have locale prefixes (e.g., `/en/admin/` should now be just `/admin/`)

## Finalizing the Migration

After confirming everything works correctly:

1. Remove the `[locale]` directory completely:
```bash
rm -rf src/app/[locale]
```

2. If any issues are found, they can be fixed using the scripts in the `scripts/` directory:
   - `check-locale-usage.js` - Identifies files that still use locale parameters
   - `update-link-components.js` - Removes locale props from Link components

## How the Cookie-based Approach Works

1. The middleware (`middleware.ts`) detects the user's preferred language:
   - From the `NEXT_LOCALE` cookie if present
   - From the `Accept-Language` header as a fallback
   - Defaults to 'vi' if neither of the above can determine the locale

2. The detected locale is stored in a cookie named `NEXT_LOCALE`

3. The root layout and components read the locale from the cookie

4. The language switcher changes the language by:
   - Setting a new value in the `NEXT_LOCALE` cookie
   - Reloading the page to apply the changes

## Benefits of the Migration

- Cleaner URLs without locale prefixes
- Simpler routing structure
- Consistent language preference across sessions
- Reduced complexity in component implementation
