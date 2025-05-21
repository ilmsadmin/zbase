import { IsString, IsOptional, IsInt, IsBoolean, IsDecimal } from 'class-validator';

export class CreateWarehouseLocationDto {
  @IsInt()
  warehouseId: number;

  @IsString()
  zone: string;

  @IsString()
  aisle: string;

  @IsString()
  rack: string;

  @IsString()
  shelf: string;

  @IsString()
  position: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string = 'active';

  @IsDecimal()
  @IsOptional()
  maxCapacity?: number;
}
