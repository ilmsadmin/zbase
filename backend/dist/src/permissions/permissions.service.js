"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let PermissionsService = class PermissionsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async createPermission(action, description) {
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
        await this.redis.del('permissions:all');
        return permission;
    }
    async getAllPermissions() {
        const cachedPermissions = await this.redis.get('permissions:all');
        if (cachedPermissions) {
            return JSON.parse(cachedPermissions);
        }
        const permissions = await this.prisma.permission.findMany();
        await this.redis.set('permissions:all', JSON.stringify(permissions), 600);
        return permissions;
    }
    async getPermissionsByRoleIds(roleIds) {
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
    async assignPermissionToRole(roleId, permissionId) {
        await this.prisma.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
        });
        const roleUsers = await this.prisma.userRole.findMany({
            where: { roleId },
            select: { userId: true },
        });
        for (const { userId } of roleUsers) {
            await this.redis.del(`permissions:user:${userId}`);
        }
    }
    async hasPermission(userId, action) {
        const cacheKey = `permissions:user:${userId}:has:${action}`;
        const cachedResult = await this.redis.get(cacheKey);
        if (cachedResult !== null) {
            return cachedResult === 'true';
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: { roleId: true },
        });
        const roleIds = userRoles.map(ur => ur.roleId);
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
        await this.redis.set(cacheKey, hasPermission ? 'true' : 'false', 600);
        return hasPermission;
    }
    async getUserPermissions(userId) {
        const cacheKey = `permissions:user:${userId}`;
        const cachedPermissions = await this.redis.get(cacheKey);
        if (cachedPermissions) {
            return JSON.parse(cachedPermissions);
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: { roleId: true },
        });
        const roleIds = userRoles.map(ur => ur.roleId);
        if (roleIds.length === 0) {
            return [];
        }
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
        await this.redis.set(cacheKey, JSON.stringify(permissionActions), 600);
        return permissionActions;
    }
    async updatePermission(id, updateData) {
        const updatedPermission = await this.prisma.permission.update({
            where: { id },
            data: updateData,
        });
        await this.redis.del('permissions:all');
        return updatedPermission;
    }
    async removePermissionFromRole(roleId, permissionId) {
        await this.prisma.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId
                }
            },
        });
        const roleUsers = await this.prisma.userRole.findMany({
            where: { roleId },
            select: { userId: true },
        });
        for (const { userId } of roleUsers) {
            await this.redis.del(`permissions:user:${userId}`);
        }
    }
    async normalizePermissions() {
        const permissions = await this.prisma.permission.findMany();
        const updatedPermissions = [];
        for (const permission of permissions) {
            if (permission.action.includes(':')) {
                continue;
            }
            const oldAction = permission.action;
            let newAction = '';
            if (/^\d+_\w+$/.test(oldAction)) {
                const parts = oldAction.split('_');
                const prefixNum = parts[0];
                const resource = parts[1].toLowerCase();
                let action = 'access';
                switch (prefixNum) {
                    case '1':
                        action = 'read';
                        break;
                    case '3':
                        action = 'view';
                        break;
                    case '4':
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
            }
            else if (oldAction.includes('_')) {
                const [action, resource] = oldAction.split('_');
                newAction = `${action}:${resource}`;
            }
            else {
                newAction = `access:${oldAction.toLowerCase()}`;
            }
            try {
                const updated = await this.updatePermission(permission.id, {
                    action: newAction,
                });
                updatedPermissions.push({
                    id: permission.id,
                    old: oldAction,
                    new: newAction
                });
            }
            catch (e) {
                console.error(`Failed to update permission ${permission.id}:`, e);
            }
        }
        await this.redis.del('permissions:all');
        return {
            updated: updatedPermissions.length,
            details: updatedPermissions
        };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map