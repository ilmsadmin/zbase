import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Site } from '../../entities/site.entity';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title', example: 'How to Use WordPress Hub' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Post slug', example: 'how-to-use-wordpress-hub' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Post content in HTML format', example: '<p>This is a detailed guide...</p>' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Post excerpt/summary', example: 'A quick guide to WordPress Hub integration' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'Post metadata',
    example: {
      meta_title: 'WordPress Hub Guide',
      meta_description: 'Learn how to use WordPress Hub effectively',
      featured_image: 'https://example.com/images/featured.jpg'
    }
  })
  @IsOptional()
  meta?: {
    meta_title?: string;
    meta_description?: string;
    featured_image?: string;
  };

  @ApiPropertyOptional({ description: 'Post categories', example: ['Tutorial', 'WordPress'] })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Post tags', example: ['guide', 'wordpress', 'hub'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Post status', example: 'draft', default: 'draft' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Related site ID', example: 1 })
  @IsOptional()
  @IsNumber()
  siteId?: number;
  @ApiPropertyOptional({ description: 'Related site object' })
  @IsOptional()
  site?: Site;

  @ApiPropertyOptional({ description: 'WordPress post ID (when synced from WordPress)', example: 12345 })
  @IsOptional()
  @IsNumber()
  wp_post_id?: number;
}
