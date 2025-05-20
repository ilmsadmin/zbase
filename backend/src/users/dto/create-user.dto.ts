import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];
}
