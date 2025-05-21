import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePriceListItemDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  minQuantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  maxQuantity?: number;

  @IsEnum(['percentage', 'fixed_amount'], { message: 'Discount type must be either percentage or fixed_amount' })
  @IsOptional()
  discountType?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  discountValue?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  discountRate?: number;

  @IsString()
  @IsOptional()
  specialConditions?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
