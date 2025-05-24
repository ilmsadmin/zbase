import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum CustomerTransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
}

export class AddCustomerTransactionDto {
  @IsNotEmpty()
  @IsEnum(CustomerTransactionType)
  type: CustomerTransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  referenceType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
