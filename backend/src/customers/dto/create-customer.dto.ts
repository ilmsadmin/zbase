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

  @IsInt()
  @IsOptional()
  groupId?: number;
}
