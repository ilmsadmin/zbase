import { IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export enum TransactionType {
  RECEIPT = 'receipt',
  PAYMENT = 'payment',
}

export enum TransactionMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  FAILED = 'failed',
}

export enum TransactionCategory {
  SALE = 'sale',
  PURCHASE = 'purchase',
  EXPENSE = 'expense',
  INCOME = 'income',
  REFUND = 'refund',
  OTHER = 'other',
}

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  code?: string; // if not provided, will be auto-generated

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsEnum(TransactionMethod)
  @IsNotEmpty()
  transactionMethod: TransactionMethod;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  transactionDate?: Date;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsEnum(TransactionCategory)
  @IsOptional()
  category?: TransactionCategory;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsNumber()
  @IsOptional()
  customerId?: number;

  @IsNumber()
  @IsOptional()
  partnerId?: number;

  @IsNumber()
  @IsOptional()
  invoiceId?: number;

  @IsString()
  @IsOptional()
  referenceType?: string;

  @IsNumber()
  @IsOptional()
  referenceId?: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  shiftId?: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsString()
  @IsOptional()
  attachments?: string; // JSON string of file paths or URLs

  @IsString()
  @IsOptional()
  @MinLength(1)
  notes?: string;
}
