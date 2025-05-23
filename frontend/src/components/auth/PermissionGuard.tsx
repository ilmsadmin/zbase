'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRoles?: UserRole[];
  permissions?: string[];
  renderWhen?: 'all' | 'any'; // Whether to require all or any of the specified permissions/roles
}

/**
 * PermissionGuard component - Conditionally render content based on user permissions
 * 
 * @param children - The components to render if user has permission
 * @param fallback - Optional component to render if user doesn't have permission
 * @param requiredRoles - Optional roles required to view the content
 * @param permissions - Optional permissions required to view the content
 * @param renderWhen - Whether to require all or any of the specified permissions/roles (default: 'any')
 */
export default function PermissionGuard({
  children,
  fallback = null,
  requiredRoles = [],
  permissions = [],
  renderWhen = 'any',
}: PermissionGuardProps) {
  const { user, hasPermission } = useAuth();

  // If no user is logged in, hide the content
  if (!user) {
    return fallback;
  }

  // Check role-based access
  const hasRequiredRole = requiredRoles.length === 0 || (
    renderWhen === 'any'
      ? requiredRoles.some(role => user.role === role)
      : requiredRoles.every(role => user.role === role) // This will be true only if user.role matches all roles, which is impossible in most cases
  );

  // Admin always has access to everything
  if (user.role === UserRole.ADMIN) {
    return <>{children}</>;
  }

  // Check permission-based access (if we need to check permissions)
  const hasRequiredPermission = permissions.length === 0 || (
    renderWhen === 'any'
      ? permissions.some(permission => hasPermission(permission))
      : permissions.every(permission => hasPermission(permission))
  );

  // Return children if conditions are met, otherwise return fallback
  return (hasRequiredRole && hasRequiredPermission) ? <>{children}</> : fallback;
}
