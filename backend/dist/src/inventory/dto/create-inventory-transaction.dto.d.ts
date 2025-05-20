import { InventoryTransactionType } from '@prisma/client';
export declare class CreateInventoryTransactionDto {
    type: InventoryTransactionType;
    productId: number;
    warehouseId: number;
    quantity: number;
}
