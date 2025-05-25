import { IsString, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FacebookPageDto {
  @ApiProperty({ description: 'Facebook Page ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Page name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Page category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ description: 'Cover photo URL' })
  @IsOptional()
  @IsString()
  coverPhoto?: string;

  @ApiPropertyOptional({ description: 'Page about description' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ description: 'Page website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Page phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Page email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Page-level permissions', type: [String] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ description: 'Whether page is connected' })
  @IsBoolean()
  isConnected: boolean;

  @ApiProperty({ description: 'When page was connected' })
  @IsDateString()
  connectedAt: string;

  @ApiPropertyOptional({ description: 'Last synchronization time' })
  @IsOptional()
  @IsDateString()
  lastSyncAt?: string;
}

export class CreateFacebookPageDto {
  @ApiProperty({ description: 'Facebook Page ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Page name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Page access token (will be encrypted)' })
  @IsString()
  accessToken: string;

  @ApiPropertyOptional({ description: 'Page category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ description: 'Cover photo URL' })
  @IsOptional()
  @IsString()
  coverPhoto?: string;

  @ApiPropertyOptional({ description: 'Page about description' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ description: 'Page website' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Page phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Page email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Page-level permissions', type: [String] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

export class UpdatePageDto {
  @ApiPropertyOptional({ description: 'Whether page is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page settings' })
  @IsOptional()
  settings?: {
    autoReply?: boolean;
    notifications?: boolean;
    moderateComments?: boolean;
  };
}

export class PageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Search by page name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class ConnectPageDto {
  @ApiProperty({ description: 'Facebook Page ID to connect' })
  @IsString()
  facebookPageId: string;

  @ApiProperty({ description: 'Page name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Initial page settings' })
  @IsOptional()
  settings?: {
    autoReply?: boolean;
    notifications?: boolean;
    moderateComments?: boolean;
  };
}

export class DisconnectPageDto {
  @ApiProperty({ description: 'Facebook Page ID to disconnect' })
  @IsString()
  pageId: string;

  @ApiPropertyOptional({ description: 'Reason for disconnection' })
  @IsOptional()
  @IsString()
  reason?: string;
}
