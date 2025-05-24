import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateInvoiceTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsNotEmpty()
  @IsString()
  type: string; // 'default', 'thermal', 'a4', etc.
}
