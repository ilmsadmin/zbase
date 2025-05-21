import { IsString, IsOptional, IsInt, IsNumber, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  name: string;

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
  groupId?: number;

  @IsNumber()
  @IsOptional()
  creditBalance?: number = 0;
}
