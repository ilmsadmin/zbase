import { PermissionsService } from './permissions.service';
import { ActionsDiscoveryService } from './actions-discovery.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PermissionsController {
    private readonly permissionsService;
    private readonly actionsDiscoveryService;
    private readonly prisma;
    constructor(permissionsService: PermissionsService, actionsDiscoveryService: ActionsDiscoveryService, prisma: PrismaService);
    getAllPermissions(): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        action: string;
    }[]>;
    discoverActions(): Promise<string[]>;
    assignPermissionToRole(roleId: string, permissionId: string): Promise<{
        success: boolean;
    }>;
    getPermissionsByRole(roleId: string): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        action: string;
    }[]>;
    getUserPermissions(userId: string): Promise<string[]>;
    updatePermission(id: string, updateData: {
        action?: string;
        description?: string;
    }): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        action: string;
    }>;
    normalizePermissions(): Promise<{
        updated: number;
        details: Array<{
            id: number;
            old: string;
            new: string;
        }>;
    }>;
    removePermissionFromRole(roleId: string, permissionId: string): Promise<{
        success: boolean;
    }>;
}
