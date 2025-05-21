import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CloseShiftDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  endAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
