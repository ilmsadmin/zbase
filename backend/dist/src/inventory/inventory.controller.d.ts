import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
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
    importProducts(updateInventoryDto: UpdateInventoryDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        warehouseId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryTransactionType;
        employeeId: number;
    }>;
    exportProducts(updateInventoryDto: UpdateInventoryDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        warehouseId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.InventoryTransactionType;
        employeeId: number;
    }>;
    getTransactions(warehouseId?: string, productId?: string): Promise<({
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
    checkLowStock(threshold?: string): Promise<({
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
