import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Site } from '../../entities/site.entity';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Áo thun nam cao cấp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Product description', example: '<p>Áo thun nam cao cấp với chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt...</p>' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product short description', example: 'Áo thun nam cao cấp, chất liệu cotton 100%' })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiProperty({ description: 'Product price', example: 299000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Product regular price', example: 350000 })
  @IsOptional()
  @IsNumber()
  regular_price?: number;

  @ApiPropertyOptional({ description: 'Product sale price', example: 299000 })
  @IsOptional()
  @IsNumber()
  sale_price?: number;

  @ApiPropertyOptional({ description: 'Product stock quantity', example: 100 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ description: 'Product stock status', example: 'instock', enum: ['instock', 'outofstock', 'onbackorder'] })
  @IsOptional()
  @IsString()
  stock_status?: string;

  @ApiPropertyOptional({ 
    description: 'Product images',
    example: [
      { src: 'https://example.com/image1.jpg', name: 'front-view', alt: 'Front view of product' },
      { src: 'https://example.com/image2.jpg', name: 'back-view', alt: 'Back view of product' }
    ]
  })
  @IsOptional()
  @IsArray()
  images?: { src: string; name: string; alt: string }[];

  @ApiPropertyOptional({ description: 'Product categories', example: ['Áo thun', 'Thời trang nam'] })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiPropertyOptional({ 
    description: 'Product attributes', 
    example: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'], visible: true },
      { name: 'Màu sắc', options: ['Đen', 'Trắng', 'Xanh'], visible: true }
    ]
  })
  @IsOptional()
  @IsArray()
  attributes?: { name: string; options: string[]; visible: boolean }[];

  @ApiPropertyOptional({ description: 'Product type', example: 'simple', enum: ['simple', 'variable', 'grouped', 'external'] })
  @IsOptional()
  @IsString()
  type?: string;
  
  @ApiPropertyOptional({ description: 'Featured product', example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ description: 'Site ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  siteId: number;

  // Will be populated by the service
  site?: Site;
}
