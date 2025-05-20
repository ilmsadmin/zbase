import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

type User = Prisma.UserGetPayload<{}>;
type Role = Prisma.RoleGetPayload<{}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      },
    });    // Assign default role if specified
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      await this.assignRolesToUser(user.id, createUserDto.roleIds);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    // Remove passwords from response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    const data: any = { ...updateUserDto };

    // Hash password if it's included in the update
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user roles if specified
    if (updateUserDto.roleIds) {
      await this.updateUserRoles(id, updateUserDto.roleIds);
      delete data.roleIds;
    }    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async remove(id: number): Promise<User> {
    // Check if user exists
    await this.findOne(id);    // Delete user
    const user = await this.prisma.user.delete({
      where: { id },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return userRoles.map(ur => ur.role);
  }

  async assignRolesToUser(userId: number, roleIds: number[]): Promise<void> {
    // First get existing roles
    const existingRoles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const existingRoleIds = existingRoles.map(role => role.roleId);
    
    // Find roles to add (not in existing roles)
    const rolesToAdd = roleIds.filter(id => !existingRoleIds.includes(id));
    
    // Create connections for new roles
    for (const roleId of rolesToAdd) {
      await this.prisma.userRole.create({
        data: { userId, roleId },
      });
    }
  }

  async updateUserRoles(userId: number, roleIds: number[]): Promise<void> {
    // Delete all existing roles
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // Assign new roles
    await this.assignRolesToUser(userId, roleIds);
  }
}
