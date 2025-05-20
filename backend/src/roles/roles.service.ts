import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role as PrismaRole } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<PrismaRole> {
    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
      },
    });
  }

  async findAll(): Promise<PrismaRole[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: number): Promise<PrismaRole> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<PrismaRole> {
    await this.findOne(id);

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number): Promise<PrismaRole> {
    await this.findOne(id);

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async findUsersWithRole(roleId: number) {
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

  async getRolePermissions(roleId: number) {
    const role = await this.findOne(roleId);

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: role.id },
      include: { permission: true },
    });

    return rolePermissions.map(rp => rp.permission);
  }
}
