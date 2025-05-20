import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsNotEmpty()
  @IsInt()
  warehouseId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
