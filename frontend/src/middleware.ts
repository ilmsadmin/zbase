import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các routes cần được bảo vệ
const PROTECTED_ROUTES = [
  '/admin',
  '/pos',
];

// Routes dành cho người dùng đã đăng nhập (không thể truy cập khi đã đăng nhập)
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Middleware cho route protection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy token từ cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Kiểm tra nếu route cần đăng nhập
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Kiểm tra nếu route là trang đăng nhập/đăng ký
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  
  // Nếu truy cập route được bảo vệ mà không có token -> chuyển hướng đến login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Nếu đã đăng nhập mà truy cập vào trang login/register -> chuyển hướng đến dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Cấu hình để middleware chỉ chạy trên các routes cụ thể
export const config = {
  matcher: [
    '/admin/:path*',
    '/pos/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
