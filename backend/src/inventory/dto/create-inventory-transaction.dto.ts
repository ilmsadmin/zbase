import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInventoryTransactionDto {
  @IsInt()
  productId: number;

  @IsInt()
  warehouseId: number;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsString()
  transactionType: string; // 'in', 'out', 'transfer', 'adjustment'

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  referenceType?: string; // 'order', 'return', 'internal', etc.

  @IsInt()
  @IsOptional()
  referenceId?: number;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
