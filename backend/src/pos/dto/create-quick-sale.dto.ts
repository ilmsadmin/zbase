import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';

class QuickSaleItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  unitPrice?: number;
}

export class CreateQuickSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuickSaleItemDto)
  items: QuickSaleItemDto[];

  @IsInt()
  @IsOptional()
  customerId?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  discountAmount?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  paidAmount?: number = 0;

  @IsEnum(['cash', 'card', 'bank_transfer', 'e_wallet'], { message: 'Payment method must be one of: cash, card, bank_transfer, e_wallet' })
  @IsOptional()
  paymentMethod?: string = 'cash';

  @IsString()
  @IsOptional()
  notes?: string;
}
