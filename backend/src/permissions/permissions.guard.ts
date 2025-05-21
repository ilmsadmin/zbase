import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false;
    }

    // Get user with role and role permissions
    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      return false;
    }

    // Collect all permissions from the user's primary role and additional roles
    const permissions = new Set<string>();
    
    // Add permissions from primary role if it exists
    if (userWithPermissions.role) {
      userWithPermissions.role.rolePermissions.forEach((rp) => {
        permissions.add(rp.permission.action);
      });
    }
    
    // Add permissions from additional roles
    userWithPermissions.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(rp.permission.action);
      });
    });

    // Check if the user has all required permissions
    return requiredPermissions.every((permission) => 
      permissions.has(permission) || permissions.has('manage:system')
    );
  }
}
