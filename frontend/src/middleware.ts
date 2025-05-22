import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { defaultLocale, locales } from './i18n';

// Get locale from cookie, header, or default
function getLocale(request: NextRequest): string {
  // Check if locale is in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Use accept-language header for negotiation if no cookie
  let languages: string[] = [];
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    languages = new Negotiator({
      headers: { 'accept-language': acceptLanguage }
    }).languages();
  }

  try {
    return match(languages, locales as unknown as string[], defaultLocale) || defaultLocale;
  } catch (e) {
    return defaultLocale;
  }
}

// Middleware function that handles both locale detection and auth logging
export async function middleware(request: NextRequest) {
  // Get locale from cookie or headers
  const locale = getLocale(request);
  
  // Log admin access attempts for debugging
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const token = await getToken({ req: request });
      console.log(`Middleware - Admin route request:`, { 
        path: request.nextUrl.pathname,
        hasToken: !!token,
        role: token?.role,
        locale
      });
    } catch (error) {
      console.error("Middleware error:", error);
    }
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Always set the locale cookie to ensure consistency
  if (!request.cookies.has('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE')?.value !== locale) {
    response.cookies.set('NEXT_LOCALE', locale, { 
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }
  
  return response;
}
 
export const config = {
  // Skip all paths that should not be handled by this middleware
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
