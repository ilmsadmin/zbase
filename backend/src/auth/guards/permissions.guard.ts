import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const debugMode = process.env.PERMISSIONS_DEBUG === 'true';
    
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (debugMode) {
      const request = context.switchToHttp().getRequest();
      console.log(`🛡️ [PermissionsGuard] Checking permissions for ${request.method} ${request.url}`, {
        requiredPermissions
      });
    }

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      if (debugMode) {
        console.log(`✅ [PermissionsGuard] No permissions required - allowing access`);
      }
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      if (debugMode) {
        console.warn(`🚫 [PermissionsGuard] No user authenticated`);
      }
      throw new ForbiddenException('User not authenticated');
    }

    if (debugMode) {
      console.log(`👤 [PermissionsGuard] Checking permissions for user ${user.id}`, {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        userPermissions: user.permissions || [],
        requiredPermissions
      });
    }

    // Check if user has all required permissions
    if (user.permissions) {
      // Check if permissions are in the JWT payload
      const hasAllPermissions = requiredPermissions.every(permission => 
        user.permissions.includes(permission)
      );
      
      if (hasAllPermissions) {
        if (debugMode) {
          console.log(`✅ [PermissionsGuard] All required permissions found in JWT - allowing access`);
        }
        return true;
      } else if (debugMode) {
        const missingPermissions = requiredPermissions.filter(p => !user.permissions.includes(p));
        console.log(`⚠️ [PermissionsGuard] Some permissions missing in JWT, checking database...`, {
          missingPermissions
        });
      }
    }
    
    // Double-check with database
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permissionsService.hasPermission(user.id, permission);
      if (!hasPermission) {
        if (debugMode) {
          console.warn(`🚫 [PermissionsGuard] Permission "${permission}" denied for user ${user.id}`);
        }
        return false;
      }
    }

    if (debugMode) {
      console.log(`✅ [PermissionsGuard] All permissions verified - allowing access`);
    }

    return true;
  }
}
