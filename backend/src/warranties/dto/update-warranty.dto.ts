import { PartialType } from '@nestjs/mapped-types';
import { CreateWarrantyDto, WarrantyStatus } from './create-warranty.dto';
import { IsBoolean, IsDate, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateWarrantyDto extends PartialType(CreateWarrantyDto) {
  @IsEnum(WarrantyStatus)
  @IsOptional()
  status?: WarrantyStatus;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  solution?: string;

  @IsDateString()
  @IsOptional()
  actualReturnDate?: Date;

  @IsBoolean()
  @IsOptional()
  charged?: boolean;
}
