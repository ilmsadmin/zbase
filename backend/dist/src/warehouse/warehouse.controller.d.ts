import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        managerId: number | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        managerId: number | null;
    }>;
    create(createWarehouseDto: CreateWarehouseDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        managerId: number | null;
    }>;
    update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        managerId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        managerId: number | null;
    }>;
}
