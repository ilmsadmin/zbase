import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => PermissionsService))
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles or permissions are required, allow access
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // If we need to check roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => 
        user.roles && user.roles.includes(role)
      );
      
      if (!hasRole) {
        return false;
      }
    }

    // If we need to check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      // User has permissions in JWT already
      if (user.permissions) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          user.permissions.includes(permission)
        );
        
        if (hasAllPermissions) {
          return true;
        }
      }
      
      // Double-check with database if needed
      for (const permission of requiredPermissions) {
        const hasPermission = await this.permissionsService.hasPermission(user.id, permission);
        if (!hasPermission) {
          return false;
        }
      }
    }

    return true;
  }
}
