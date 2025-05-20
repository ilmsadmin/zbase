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
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has all required permissions
    if (user.permissions) {
      // Check if permissions are in the JWT payload
      const hasAllPermissions = requiredPermissions.every(permission => 
        user.permissions.includes(permission)
      );
      
      if (hasAllPermissions) {
        return true;
      }
    }
    
    // Double-check with database
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permissionsService.hasPermission(user.id, permission);
      if (!hasPermission) {
        return false;
      }
    }

    return true;
  }
}
