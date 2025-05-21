import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';

// Chỉ cho phép cập nhật một số trường cụ thể để đảm bảo tính nhất quán
export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(['pending', 'paid', 'canceled'])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
