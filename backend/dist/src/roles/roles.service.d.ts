import { PrismaService } from '../prisma/prisma.service';
import { Role as PrismaRole } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<PrismaRole>;
    findAll(): Promise<PrismaRole[]>;
    findOne(id: number): Promise<PrismaRole>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<PrismaRole>;
    remove(id: number): Promise<PrismaRole>;
    findUsersWithRole(roleId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
    }[]>;
    getRolePermissions(roleId: number): Promise<{
        id: number;
        createdAt: Date;
        description: string | null;
        action: string;
    }[]>;
}
