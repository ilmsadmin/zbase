import { ApiProperty } from '@nestjs/swagger';
import { SiteResponseDto } from './site-response.dto';

export class SiteConnectionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Connection successful' })
  message: string;

  @ApiProperty()
  site?: SiteResponseDto;
  
  @ApiProperty({ example: '6.4.2', required: false })
  version?: string;
  
  @ApiProperty({ required: false })
  details?: Record<string, any>;

  constructor(partial: Partial<SiteConnectionResponseDto>) {
    Object.assign(this, partial);
  }
}
