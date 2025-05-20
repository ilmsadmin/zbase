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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRoleDto) {
        return this.prisma.role.create({
            data: {
                name: createRoleDto.name,
                description: createRoleDto.description,
            },
        });
    }
    async findAll() {
        return this.prisma.role.findMany();
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    async update(id, updateRoleDto) {
        await this.findOne(id);
        return this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.role.delete({
            where: { id },
        });
    }
    async findUsersWithRole(roleId) {
        const role = await this.findOne(roleId);
        const userRoles = await this.prisma.userRole.findMany({
            where: { roleId: role.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        return userRoles.map(ur => ur.user);
    }
    async getRolePermissions(roleId) {
        const role = await this.findOne(roleId);
        const rolePermissions = await this.prisma.rolePermission.findMany({
            where: { roleId: role.id },
            include: { permission: true },
        });
        return rolePermissions.map(rp => rp.permission);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map