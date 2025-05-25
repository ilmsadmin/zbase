import { IsString, IsOptional, IsInt, IsNumber, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductAttributeDto {
  @IsString()
  attributeName: string;

  @IsString()
  attributeValue: string;
}

export class CreateProductDto {
  @IsString()
  sku: string; // Required field, replaces code

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  price: number; // Required field, replaces basePrice

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @IsOptional()
  taxRate?: number = 0;

  @IsString()
  @IsOptional()
  barcode?: string;
  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsInt()
  @IsOptional()
  warrantyMonths?: number = 0;

  @IsNumber()
  @IsOptional()
  minStockLevel?: number;

  @IsNumber()
  @IsOptional()
  maxStockLevel?: number;

  @IsNumber()
  @IsOptional()
  reorderLevel?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];
}
