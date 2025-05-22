import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { defaultLocale, locales } from './i18n';

// Các đường dẫn cần xác thực
const protectedRoutes = ['/dashboard', '/admin'];
// Các đường dẫn dành cho người dùng chưa xác thực (đã xác thực sẽ được chuyển hướng)
const authRoutes = ['/auth/login'];

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

// Middleware function that handles locale detection, auth protection and redirects
export async function middleware(request: NextRequest) {
  // Get locale from cookie or headers
  const locale = getLocale(request);
  
  // Get session token
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;
  
  // Handle protected routes - chuyển hướng đến login nếu chưa xác thực
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle auth routes - chuyển hướng đến dashboard nếu đã xác thực
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Log admin access attempts for debugging
  if (path.startsWith('/admin')) {
    try {
      console.log(`Middleware - Admin route request:`, { 
        path: path,
        hasToken: isAuthenticated,
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
  // Apply middleware to all paths except API routes, static files, and Next.js system routes
  matcher: [
    // Apply to all paths
    '/((?!api|_next|_vercel|.*\\..*).+)', 
    // Specifically apply to auth and protected routes
    '/auth/:path*',
    '/dashboard/:path*',
    '/admin/:path*'
  ]
};
