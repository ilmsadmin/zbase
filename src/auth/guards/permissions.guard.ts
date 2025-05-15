import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
      return true; // No permissions required, allow access
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // If user doesn't exist or doesn't have permissions, deny access
    if (!user || !user.permissions) {
      return false;
    }
    
    // Check if the user has at least one of the required permissions
    return requiredPermissions.some((permission) => 
      user.permissions.includes(permission)
    );
  }
}
