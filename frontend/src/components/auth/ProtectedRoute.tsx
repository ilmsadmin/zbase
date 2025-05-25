'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { getCookie } from '@/utils/cookies';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute component - Handles route protection based on authentication and permissions
 * 
 * @param children - The components to render if user is authorized
 * @param allowedRoles - Optional array of roles allowed to access this route
 * @param redirectTo - Optional redirect path if user is not authenticated
 * @param fallback - Optional component to show while checking auth or if user is not authorized
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
  fallback = <LoadingState />,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Debug logging
  console.log('🔒 [ProtectedRoute] Checking authorization:', {
    isLoading,
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
  });  useEffect(() => {
    console.log('🔄 [ProtectedRoute] useEffect triggered:', {
      isLoading,
      isAuthenticated,
      userRole: user?.role,
      allowedRoles,
      hasUser: !!user
    });

    // If still loading, wait
    if (isLoading) {
      console.log('⏳ [ProtectedRoute] Still loading, waiting...');
      return;
    }

    // Not authenticated - check cookies as fallback then redirect if still not authenticated
    if (!isAuthenticated) {
      console.log('🚪 [ProtectedRoute] User not authenticated, checking cookies...');
      const cookieToken = getCookie('auth_token');
      if (cookieToken) {
        // Token exists in cookie, but don't trigger checkAuth here as useAuth already handles it
        console.log('🍪 [ProtectedRoute] Found auth token in cookie, useAuth should handle validation...');
        // Wait for useAuth to complete the authentication process
        return;
      }
      
      // No auth found anywhere, redirect to login
      console.log('❌ [ProtectedRoute] No auth found, redirecting to login');
      router.push(redirectTo);
      return;
    }

    // If no role restrictions or no user, show content
    if (!allowedRoles || !user) {
      console.log('✅ [ProtectedRoute] No role restrictions or no user data, allowing access');
      setIsAuthorized(true);
      return;
    }// Check if user has one of the allowed roles
    const hasAllowedRole = allowedRoles.includes(user.role);
    console.log('🔒 [ProtectedRoute] Role check result:', {
      userRole: user.role,
      allowedRoles,
      hasAllowedRole,
      willRedirect: !hasAllowedRole
    });
    
    setIsAuthorized(hasAllowedRole);
    
    // Redirect if not authorized
    if (!hasAllowedRole) {
      console.log('🚫 [ProtectedRoute] Redirecting to /unauthorized - role check failed');
      // Unauthorized - redirect to 403 page or fallback to dashboard
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router, hasPermission]);

  // Show loading state while checking
  if (isLoading || isAuthorized === null) {
    return fallback;
  }

  // Render children if authorized
  return isAuthorized ? <>{children}</> : null;
}

/**
 * Simple loading state component
 */
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
}
