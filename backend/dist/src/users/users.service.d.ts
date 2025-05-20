import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<any>;
    getUserRoles(userId: number): Promise<string[]>;
    assignRolesToUser(userId: number, roleIds: number[]): Promise<void>;
    updateUserRoles(userId: number, roleIds: number[]): Promise<void>;
}
