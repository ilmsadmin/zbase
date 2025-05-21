import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddPriceListItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  minQuantity?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  maxQuantity?: number;

  @IsEnum(['percentage', 'fixed_amount'], { message: 'Discount type must be either percentage or fixed_amount' })
  @IsOptional()
  discountType?: string = 'percentage';

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  discountValue?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  discountRate?: number = 0;

  @IsString()
  @IsOptional()
  specialConditions?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
