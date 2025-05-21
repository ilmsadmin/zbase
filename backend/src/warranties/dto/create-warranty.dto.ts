import { IsBoolean, IsDate, IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum WarrantyStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export class CreateWarrantyDto {
  @IsString()
  @IsOptional()
  code?: string; // Nếu không cung cấp, sẽ được tạo tự động

  @IsNumber()
  @IsOptional()
  customerId!: number;

  @IsNumber()
  @IsOptional()
  productId!: number;

  @IsNumber()
  @IsOptional()
  invoiceId?: number;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  issueDescription?: string;

  @IsDateString()
  @IsOptional()
  receivedDate?: Date;

  @IsDateString()
  @IsOptional()
  expectedReturnDate?: Date;

  @IsEnum(WarrantyStatus)
  @IsOptional()
  status?: WarrantyStatus;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsDecimal()
  @IsOptional()
  cost?: number;

  @IsBoolean()
  @IsOptional()
  charged?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsNotEmpty()
  creatorId!: number;

  @IsNumber()
  @IsOptional()
  technicianId?: number;
}
