import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  IsPositive,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @IsInt()
  @IsOptional()
  customerId?: number;

  @IsInt()
  userId: number;

  @IsInt()
  @IsOptional()
  shiftId?: number;

  @IsInt()
  warehouseId: number;

  @IsISO8601()
  @IsOptional()
  invoiceDate?: string;

  @IsNumber()
  @IsOptional()
  discountAmount?: number = 0;

  @IsNumber()
  @IsOptional()
  paidAmount?: number = 0;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsEnum(['pending', 'paid', 'canceled'])
  @IsOptional()
  status?: string = 'pending';

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
