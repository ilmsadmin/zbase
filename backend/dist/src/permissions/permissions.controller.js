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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_service_1 = require("./permissions.service");
const actions_discovery_service_1 = require("./actions-discovery.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let PermissionsController = class PermissionsController {
    permissionsService;
    actionsDiscoveryService;
    prisma;
    constructor(permissionsService, actionsDiscoveryService, prisma) {
        this.permissionsService = permissionsService;
        this.actionsDiscoveryService = actionsDiscoveryService;
        this.prisma = prisma;
    }
    async getAllPermissions() {
        return this.permissionsService.getAllPermissions();
    }
    async discoverActions() {
        return this.actionsDiscoveryService.discoverActions();
    }
    async assignPermissionToRole(roleId, permissionId) {
        await this.permissionsService.assignPermissionToRole(parseInt(roleId, 10), parseInt(permissionId, 10));
        return { success: true };
    }
    async getPermissionsByRole(roleId) {
        const rolePermissions = await this.prisma.rolePermission.findMany({
            where: { roleId: parseInt(roleId, 10) },
            include: { permission: true },
        });
        return rolePermissions.map(rp => rp.permission);
    }
    async getUserPermissions(userId) {
        return this.permissionsService.getUserPermissions(parseInt(userId, 10));
    }
    async updatePermission(id, updateData) {
        return this.permissionsService.updatePermission(parseInt(id, 10), updateData);
    }
    async normalizePermissions() {
        return this.permissionsService.normalizePermissions();
    }
    async removePermissionFromRole(roleId, permissionId) {
        await this.permissionsService.removePermissionFromRole(parseInt(roleId, 10), parseInt(permissionId, 10));
        return { success: true };
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Get)('discover'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "discoverActions", null);
__decorate([
    (0, common_1.Post)('role/:roleId/permission/:permissionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "assignPermissionToRole", null);
__decorate([
    (0, common_1.Get)('role/:roleId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getPermissionsByRole", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Post)('normalize'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "normalizePermissions", null);
__decorate([
    (0, common_1.Delete)('role/:roleId/permission/:permissionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "removePermissionFromRole", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService,
        actions_discovery_service_1.ActionsDiscoveryService,
        prisma_service_1.PrismaService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map