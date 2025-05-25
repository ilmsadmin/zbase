import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createPermission(action: string, description?: string): Promise<Permission> {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { action },
    });

    if (existingPermission) {
      return existingPermission;
    }

    const permission = await this.prisma.permission.create({
      data: {
        action,
        description,
      },
    });

    // Clear cache
    await this.redis.del('permissions:all');
    
    return permission;
  }

  async getAllPermissions(): Promise<Permission[]> {
    // Try to get from cache
    const cachedPermissions = await this.redis.get('permissions:all');
    if (cachedPermissions) {
      return JSON.parse(cachedPermissions);
    }

    const permissions = await this.prisma.permission.findMany();
    
    // Cache for 10 minutes
    await this.redis.set('permissions:all', JSON.stringify(permissions), 600);
    
    return permissions;
  }

  async getPermissionsByRoleIds(roleIds: number[]): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            roleId: {
              in: roleIds,
            },
          },
        },
      },
    });

    return permissions;
  }

  async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    await this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });

    // Clear user permissions cache
    const roleUsers = await this.prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });

    for (const { userId } of roleUsers) {
      await this.redis.del(`permissions:user:${userId}`);
    }
  }
  async hasPermission(userId: number, action: string): Promise<boolean> {
    const debugMode = process.env.PERMISSIONS_DEBUG === 'true';
    
    if (debugMode) {
      console.log(`🔍 [PermissionsService] Checking permission for user ${userId}: "${action}"`);
    }

    // Try to get from cache
    const cacheKey = `permissions:user:${userId}:has:${action}`;
    const cachedResult = await this.redis.get(cacheKey);
    
    if (cachedResult !== null) {
      const result = cachedResult === 'true';
      if (debugMode) {
        console.log(`💾 [PermissionsService] Cache hit for ${userId}:${action} = ${result ? '✅ GRANTED' : '❌ DENIED'}`);
      }
      return result;
    }

    if (debugMode) {
      console.log(`🔄 [PermissionsService] Cache miss for ${userId}:${action}, checking database...`);
    }

    // Get user roles
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map(ur => ur.roleId);

    if (debugMode) {
      console.log(`👥 [PermissionsService] User ${userId} has roles:`, roleIds);
    }

    // Get permissions for these roles
    const hasPermission = await this.prisma.permission.count({
      where: {
        action,
        rolePermissions: {
          some: {
            roleId: {
              in: roleIds,
            },
          },
        },
      },
    }) > 0;

    if (debugMode) {
      console.log(`🎯 [PermissionsService] Permission check result for ${userId}:${action} = ${hasPermission ? '✅ GRANTED' : '❌ DENIED'}`, {
        userId,
        action,
        userRoles: roleIds,
        hasPermission,
        cacheKey
      });
    }

    // Cache for 10 minutes
    await this.redis.set(cacheKey, hasPermission ? 'true' : 'false', 600);

    return hasPermission;
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    // Try to get from cache
    const cacheKey = `permissions:user:${userId}`;
    const cachedPermissions = await this.redis.get(cacheKey);
    
    if (cachedPermissions) {
      return JSON.parse(cachedPermissions);
    }

    // Get user roles
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map(ur => ur.roleId);

    if (roleIds.length === 0) {
      return [];
    }

    // Get permissions for these roles
    const permissions = await this.prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            roleId: {
              in: roleIds,
            },
          },
        },
      },
      select: { action: true },
    });

    const permissionActions = permissions.map(p => p.action);

    // Cache for 10 minutes
    await this.redis.set(cacheKey, JSON.stringify(permissionActions), 600);

    return permissionActions;
  }

  async updatePermission(
    id: number,
    updateData: { action?: string; description?: string },
  ): Promise<Permission> {
    // Update permission
    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: updateData,
    });

    // Clear cache
    await this.redis.del('permissions:all');
    
    return updatedPermission;
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      },
    });

    // Clear user permissions cache
    const roleUsers = await this.prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });

    for (const { userId } of roleUsers) {
      await this.redis.del(`permissions:user:${userId}`);
    }
  }

  async normalizePermissions(): Promise<{ updated: number; details: Array<{id: number, old: string, new: string}> }> {
    // Get all permissions
    const permissions = await this.prisma.permission.findMany();
    const updatedPermissions: Array<{id: number, old: string, new: string}> = [];
    
    for (const permission of permissions) {
      // Skip if it's already in the correct format (action:resource)
      if (permission.action.includes(':')) {
        continue;
      }
      
      const oldAction = permission.action;
      let newAction = '';
      
      // Handle pattern like "3_users", "1_logins", etc.
      if (/^\d+_\w+$/.test(oldAction)) {
        const parts = oldAction.split('_');
        const prefixNum = parts[0];
        const resource = parts[1].toLowerCase();
        
        // Convert prefix number to action verb
        let action = 'access';
        switch (prefixNum) {
          case '1': // Typically GET operations
            action = 'read';
            break;
          case '3': // Typically GET with params
            action = 'view';
            break;
          case '4': // Typically POST/PUT operations
            action = 'update';
            break;
          case 'delete':
          case '5':
            action = 'delete';
            break;
          default:
            action = 'access';
        }
        
        newAction = `${action}:${resource}`;
      } else if (oldAction.includes('_')) {
        // Handle format like "update_users"
        const [action, resource] = oldAction.split('_');
        newAction = `${action}:${resource}`;
      } else {
        // If format is unknown, mark as general access
        newAction = `access:${oldAction.toLowerCase()}`;
      }
      
      // Update permission record
      try {
        const updated = await this.updatePermission(permission.id, {
          action: newAction,
        });
        
        updatedPermissions.push({
          id: permission.id,
          old: oldAction,
          new: newAction
        });
      } catch (e) {
        console.error(`Failed to update permission ${permission.id}:`, e);
      }
    }
    
    // Clear all permission-related cache
    await this.redis.del('permissions:all');
    
    return {
      updated: updatedPermissions.length,
      details: updatedPermissions
    };
  }
}
