import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

class InventoryItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity: number;
}

export class InventoryCheckDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  items: InventoryItemDto[];
}
