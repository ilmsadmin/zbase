import { IsString, IsOptional, IsInt, IsNumber, IsEmail } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  taxCode?: string;

  @IsInt()
  @IsOptional()
  paymentTerms?: number;

  @IsNumber()
  @IsOptional()
  creditBalance?: number = 0;
}
