import { PrismaService } from '../prisma/prisma.service';
import { Permission } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
export declare class PermissionsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    createPermission(action: string, description?: string): Promise<Permission>;
    getAllPermissions(): Promise<Permission[]>;
    getPermissionsByRoleIds(roleIds: number[]): Promise<Permission[]>;
    assignPermissionToRole(roleId: number, permissionId: number): Promise<void>;
    hasPermission(userId: number, action: string): Promise<boolean>;
    getUserPermissions(userId: number): Promise<string[]>;
    updatePermission(id: number, updateData: {
        action?: string;
        description?: string;
    }): Promise<Permission>;
    removePermissionFromRole(roleId: number, permissionId: number): Promise<void>;
    normalizePermissions(): Promise<{
        updated: number;
        details: Array<{
            id: number;
            old: string;
            new: string;
        }>;
    }>;
}
