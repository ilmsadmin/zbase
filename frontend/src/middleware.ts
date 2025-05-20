import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';

// Create intl middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['vi', 'en'],
 
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'vi',

  // Auto-detection based on browser/cookie settings
  localeDetection: true
});

// Logger middleware for debugging
const debugMiddleware = async (request: NextRequest) => {
  // Only log for admin path
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Get the token
      const token = await getToken({ req: request });
      console.log(`Middleware - Admin route request:`, { 
        path: request.nextUrl.pathname,
        hasToken: !!token,
        role: token?.role,
      });
    } catch (error) {
      console.error("Middleware error:", error);
    }
  }
  
  // Continue to intl middleware
  return intlMiddleware(request);
};

export default debugMiddleware;
 
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
