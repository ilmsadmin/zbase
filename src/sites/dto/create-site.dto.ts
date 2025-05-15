import { IsNotEmpty, IsString, IsUrl, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty({ description: 'Site name', example: 'My WordPress Blog' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'WordPress site URL', 
    example: 'https://example.com' 
  })
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  wp_url: string;

  @ApiPropertyOptional({ 
    description: 'WordPress username', 
    example: 'admin' 
  })
  @IsOptional()
  @IsString()
  wp_user?: string;

  @ApiPropertyOptional({ 
    description: 'WordPress application password',
    example: 'xxxx xxxx xxxx xxxx xxxx xxxx' 
  })
  @IsOptional()
  @IsString()
  app_password?: string;

  @ApiPropertyOptional({ 
    description: 'WooCommerce consumer key',
    example: 'ck_xxxxxxxxxxxxxxxxxxxx' 
  })
  @IsOptional()
  @IsString()
  wc_key?: string;

  @ApiPropertyOptional({ 
    description: 'WooCommerce consumer secret',
    example: 'cs_xxxxxxxxxxxxxxxxxxxx' 
  })
  @IsOptional()
  @IsString()
  wc_secret?: string;
  @ApiPropertyOptional({ 
    description: 'Is the site active',
    default: true 
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
  
  @ApiPropertyOptional({ 
    description: 'Site has WooCommerce installed',
    default: false 
  })
  @IsOptional()
  @IsBoolean()
  has_woocommerce?: boolean;
}
