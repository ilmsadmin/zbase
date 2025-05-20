import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
type User = Prisma.UserGetPayload<{}>;
type Role = Prisma.RoleGetPayload<{}>;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
    getUserRoles(userId: number): Promise<Role[]>;
    assignRolesToUser(userId: number, roleIds: number[]): Promise<void>;
    updateUserRoles(userId: number, roleIds: number[]): Promise<void>;
}
export {};
