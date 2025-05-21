import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsInt()
  productId: number;

  @IsInt()
  warehouseId: number;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  minStockLevel?: number = 0;

  @IsNumber()
  @IsOptional()
  maxStockLevel?: number;
}
