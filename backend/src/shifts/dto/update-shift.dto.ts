import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShiftDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  startAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
