'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { PermissionsDebug } from '@/utils/permissions-debug';

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRoles?: UserRole[];
  permissions?: string[];
  renderWhen?: 'all' | 'any'; // Whether to require all or any of the specified permissions/roles
  debugMode?: boolean; // Enable detailed debugging information
}

/**
 * PermissionGuard component - Conditionally render content based on user permissions
 * 
 * @param children - The components to render if user has permission
 * @param fallback - Optional component to render if user doesn't have permission
 * @param requiredRoles - Optional roles required to view the content
 * @param permissions - Optional permissions required to view the content
 * @param renderWhen - Whether to require all or any of the specified permissions/roles (default: 'any')
 * @param debugMode - Enable detailed debugging information
 */
export default function PermissionGuard({
  children,
  fallback = null,
  requiredRoles = [],
  permissions = [],
  renderWhen = 'any',
  debugMode = false,
}: PermissionGuardProps) {  const { user, hasPermission } = useAuth();
  // Enhanced logging for debugging
  useEffect(() => {
    if (debugMode || PermissionsDebug.isEnabled()) {
      const debugInfo = {
        component: 'PermissionGuard',
        timestamp: new Date().toISOString(),
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions || []
        } : null,
        requiredRoles,
        requiredPermissions: permissions,
        renderWhen,        checkResults: {} as Record<string, boolean>
      };

      // Check each required permission individually
      permissions.forEach(permission => {
        const hasThisPermission = hasPermission(permission);
        (debugInfo.checkResults as Record<string, boolean>)[permission] = hasThisPermission;
        
        PermissionsDebug.logPermissionCheck(permission, hasThisPermission, {
          userId: user?.id,
          userRole: user?.role,
          userPermissions: user?.permissions,
          component: 'PermissionGuard'
        });
      });

      console.log('🛡️ PermissionGuard Debug Info:', debugInfo);
    }
  }, [user, hasPermission, permissions, requiredRoles, renderWhen, debugMode]);
  // If no user is logged in, log and hide the content
  if (!user) {
    if (debugMode || PermissionsDebug.isEnabled()) {
      PermissionsDebug.logRenderDecision(
        'PermissionGuard',
        false,
        'No user logged in',
        {
          requiredRoles,
          requiredPermissions: permissions,
          fallback: !!fallback
        }
      );
    }
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
    if (debugMode || PermissionsDebug.isEnabled()) {
      PermissionsDebug.logRenderDecision(
        'PermissionGuard',
        true,
        'Admin user - granting full access',
        {
          userId: user.id,
          userRole: user.role
        }
      );
    }
    return <>{children}</>;
  }

  // Check permission-based access (if we need to check permissions)
  const hasRequiredPermission = permissions.length === 0 || (
    renderWhen === 'any'
      ? permissions.some(permission => hasPermission(permission))
      : permissions.every(permission => hasPermission(permission))
  );
  // Enhanced debugging for permission decision
  if (debugMode || PermissionsDebug.isEnabled()) {
    const accessGranted = hasRequiredRole && hasRequiredPermission;
    
    PermissionsDebug.logRenderDecision(
      'PermissionGuard',
      accessGranted,
      accessGranted ? 'All permissions satisfied' : 'Missing required permissions',
      {
        hasRequiredRole,
        hasRequiredPermission,
        renderWhen,
        requiredRoles,
        permissions,
        userRole: user.role,
        userPermissions: user.permissions
      }
    );

    // If access is denied and we're in debug mode, show detailed information
    if (!accessGranted) {
      const denialReasons = [];
      if (!hasRequiredRole && requiredRoles.length > 0) {
        denialReasons.push(`Missing required role(s): ${requiredRoles.join(', ')}`);
      }
      if (!hasRequiredPermission && permissions.length > 0) {
        const missingPermissions = permissions.filter(p => !hasPermission(p));
        denialReasons.push(`Missing required permission(s): ${missingPermissions.join(', ')}`);
      }
      
      PermissionsDebug.logAccessDenial(
        permissions,
        permissions.filter(p => !hasPermission(p)),
        {
          userId: user.id,
          userRole: user.role,
          userPermissions: user.permissions,
          component: 'PermissionGuard',
          showPopup: true
        }
      );
    }
  }

  // Return children if conditions are met, otherwise return fallback
  return (hasRequiredRole && hasRequiredPermission) ? <>{children}</> : fallback;
}
