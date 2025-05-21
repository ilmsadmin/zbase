import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsDate,
  IsBoolean,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePriceListDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  customerGroupId?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsEnum(['percentage', 'fixed_amount'], { message: 'Discount type must be either percentage or fixed_amount' })
  @IsOptional()
  discountType?: string;

  @IsEnum(['active', 'inactive', 'expired'], { message: 'Status must be one of: active, inactive, expired' })
  @IsOptional()
  status?: string;

  @IsEnum(['all', 'selected_products', 'product_categories'], { message: 'Applicable on must be one of: all, selected_products, product_categories' })
  @IsOptional()
  applicableOn?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
