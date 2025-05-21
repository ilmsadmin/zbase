import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class CreateCustomerGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsNumber()
  @IsOptional()
  discountRate?: number = 0;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;
  
  @IsInt()
  @IsOptional()
  paymentTerms?: number;
  
  @IsInt()
  @IsOptional()
  priority?: number = 0;
}
