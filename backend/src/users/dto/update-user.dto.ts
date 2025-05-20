import { IsEmail, IsOptional, IsString, MinLength, IsArray, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];
}
