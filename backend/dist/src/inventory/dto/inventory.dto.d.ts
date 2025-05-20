import { Warehouse } from '../../warehouse/dto/warehouse.dto';
import { ProductDto } from '../../products/dto/product.dto';
export declare class InventoryDto {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
    lastUpdated: Date;
    product?: ProductDto;
    warehouse?: Warehouse;
}
