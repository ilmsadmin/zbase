import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsPositive,
  Min,
  IsISO8601,
} from 'class-validator';

export class CreateInvoiceItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountRate?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number = 0;

  @IsInt()
  @IsOptional()
  locationId?: number;

  @IsString()
  @IsOptional()
  serialNumbers?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsISO8601()
  @IsOptional()
  warrantyExpiration?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
