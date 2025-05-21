import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  parentId?: number;
}
