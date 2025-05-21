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
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  basePrice: number;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];
}
