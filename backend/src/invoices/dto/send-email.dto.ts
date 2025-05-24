import { IsNotEmpty, IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsInt()
  templateId?: number;
}
