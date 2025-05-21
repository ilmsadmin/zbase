import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WarrantyStatus } from './create-warranty.dto';

export class FilterWarrantyDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(WarrantyStatus)
  @IsOptional()
  status?: WarrantyStatus;

  @IsString()
  @IsOptional()
  creatorId?: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
