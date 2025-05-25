import { IsString, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FacebookUserDto {
  @ApiProperty({ description: 'Facebook User ID' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Facebook user email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Facebook user name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: 'Granted permissions/scopes', type: [String] })
  @IsArray()
  @IsString({ each: true })
  scopes: string[];

  @ApiProperty({ description: 'Whether account is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'When account was connected' })
  @IsDateString()
  connectedAt: string;

  @ApiPropertyOptional({ description: 'Last synchronization time' })
  @IsOptional()
  @IsDateString()
  lastSyncAt?: string;
}

export class CreateFacebookUserDto {
  @ApiProperty({ description: 'Facebook User ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Facebook access token (will be encrypted)' })
  @IsString()
  accessToken: string;

  @ApiPropertyOptional({ description: 'Facebook refresh token (will be encrypted)' })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Token expiration timestamp' })
  @IsOptional()
  @IsDateString()
  tokenExpiresAt?: string;

  @ApiPropertyOptional({ description: 'User email from Facebook' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'User name from Facebook' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: 'Granted permissions/scopes', type: [String] })
  @IsArray()
  @IsString({ each: true })
  scopes: string[];
}

export class UpdateFacebookUserDto {
  @ApiPropertyOptional({ description: 'Facebook access token (will be encrypted)' })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Facebook refresh token (will be encrypted)' })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Token expiration timestamp' })
  @IsOptional()
  @IsDateString()
  tokenExpiresAt?: string;

  @ApiPropertyOptional({ description: 'Updated scopes' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

  @ApiPropertyOptional({ description: 'Whether account is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ConnectFacebookDto {
  @ApiProperty({ description: 'Facebook authorization code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'State parameter for security' })
  @IsOptional()
  @IsString()
  state?: string;
}
