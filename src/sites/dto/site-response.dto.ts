import { ApiProperty } from '@nestjs/swagger';
import { Site } from '../../entities/site.entity';

export class SiteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My WordPress Blog' })
  name: string;

  @ApiProperty({ example: 'https://example.com' })
  wp_url: string;

  @ApiProperty({ example: 'admin' })
  wp_user: string;

  @ApiProperty({ example: '[REDACTED]' })
  app_password: string;

  @ApiProperty({ example: 'ck_xxxxx' })
  wc_key: string;

  @ApiProperty({ example: '[REDACTED]' })
  wc_secret: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<SiteResponseDto>) {
    Object.assign(this, partial);
  }
  static fromEntity(site: Site): SiteResponseDto {
    // Mask sensitive information
    return new SiteResponseDto({
      ...site,
      app_password: site.app_password ? '[REDACTED]' : undefined,
      wc_secret: site.wc_secret ? '[REDACTED]' : undefined,
    });
  }
}
