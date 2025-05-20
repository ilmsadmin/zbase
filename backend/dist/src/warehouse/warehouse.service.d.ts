import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';
import { Warehouse } from '@prisma/client';
export declare class WarehouseService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Warehouse[]>;
    findOne(id: number): Promise<Warehouse>;
    create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse>;
    update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse>;
    remove(id: number): Promise<Warehouse>;
}
