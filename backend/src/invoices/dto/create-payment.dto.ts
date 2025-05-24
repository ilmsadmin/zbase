import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
