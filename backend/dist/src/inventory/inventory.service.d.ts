import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../mongo/logs.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private prisma;
    private logsService;
    constructor(prisma: PrismaService, logsService: LogsService);
    findAll(): Promise<({
        warehouse: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            managerId: number | null;
        };
        product: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
            categoryId: number | null;
            price: import("@prisma/client/runtime/library").Decimal;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: number;
        productId: number;
        warehouseId: number;
        quantity: number;
        lastUpdated: Date;
    })[]>;
    findByWarehouse(warehouseId: number): Promise<({
        product: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
            categoryId: number | null;
            price: import("@prisma/client/runtime/library").Decimal;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: number;
        productId: number;
        warehouseId: number;
        quantity: number;
        lastUpdated: Date;
    })[]>;
    findByProduct(productId: number): Promise<({
        warehouse: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            managerId: number | null;
        };
    } & {
        id: number;
        productId: number;
        warehouseId: number;
        quantity: number;
        lastUpdated: Date;
    })[]>;
    importProducts(data: UpdateInventoryDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        warehouseId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryTransactionType;
        employeeId: number;
    }>;
    exportProducts(data: UpdateInventoryDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        warehouseId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryTransactionType;
        employeeId: number;
    }>;
    getInventoryTransactions(warehouseId?: number, productId?: number): Promise<({
        warehouse: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            managerId: number | null;
        };
        product: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
            categoryId: number | null;
            price: import("@prisma/client/runtime/library").Decimal;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        };
        employee: {
            id: number;
            name: string;
            createdAt: Date;
            password: string;
            email: string;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        productId: number;
        warehouseId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryTransactionType;
        employeeId: number;
    })[]>;
    checkLowStock(threshold?: number): Promise<({
        warehouse: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            managerId: number | null;
        };
        product: {
            id: number;
            name: string;
            createdAt: Date;
            code: string;
            categoryId: number | null;
            price: import("@prisma/client/runtime/library").Decimal;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: number;
        productId: number;
        warehouseId: number;
        quantity: number;
        lastUpdated: Date;
    })[]>;
}
