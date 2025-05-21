import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductAttributeDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  attributeName: string;

  @IsString()
  @IsNotEmpty()
  attributeValue: string;
}
