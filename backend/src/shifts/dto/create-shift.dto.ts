import { IsNumber, IsOptional, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShiftDto {
  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  startAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
