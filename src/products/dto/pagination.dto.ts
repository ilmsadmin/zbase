import { ApiProperty } from '@nestjs/swagger';

export class PaginatedProductsResponseDto {
  @ApiProperty({ description: 'List of products', isArray: true })
  products: any[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}
