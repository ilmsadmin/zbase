import { InventoryTransactionType } from '@prisma/client';
import { ProductDto } from '../../products/dto/product.dto';
import { Warehouse } from '../../warehouse/dto/warehouse.dto';
import { UserDto } from '../../users/dto/user.dto';
export declare class InventoryTransactionDto {
    id: number;
    type: InventoryTransactionType;
    productId: number;
    warehouseId: number;
    quantity: number;
    employeeId: number;
    createdAt: Date;
    product?: ProductDto;
    warehouse?: Warehouse;
    employee?: UserDto;
}
