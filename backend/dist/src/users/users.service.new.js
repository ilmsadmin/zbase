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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                name: createUserDto.name,
            },
        });
        if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
            await this.assignRolesToUser(user.id, createUserDto.roleIds);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        const data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.roleIds) {
            await this.updateUserRoles(id, updateUserDto.roleIds);
            delete data.roleIds;
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async remove(id) {
        await this.findOne(id);
        const user = await this.prisma.user.delete({
            where: { id },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getUserRoles(userId) {
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: { role: true },
        });
        return userRoles.map(ur => ur.role);
    }
    async assignRolesToUser(userId, roleIds) {
        const existingRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: { roleId: true },
        });
        const existingRoleIds = existingRoles.map(role => role.roleId);
        const rolesToAdd = roleIds.filter(id => !existingRoleIds.includes(id));
        for (const roleId of rolesToAdd) {
            await this.prisma.userRole.create({
                data: { userId, roleId },
            });
        }
    }
    async updateUserRoles(userId, roleIds) {
        await this.prisma.userRole.deleteMany({
            where: { userId },
        });
        await this.assignRolesToUser(userId, roleIds);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.new.js.map