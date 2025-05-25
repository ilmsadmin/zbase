import { IsOptional, IsString, IsDateString, IsIn, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsFiltersDto {
  @ApiPropertyOptional({
    description: 'Facebook Page ID',
    example: 'page123',
  })
  @IsOptional()
  @IsString()
  pageId?: string;

  @ApiProperty({
    description: 'Start date for analytics period (ISO 8601 format)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'End date for analytics period (ISO 8601 format)',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDateString()
  toDate: string;

  @ApiPropertyOptional({
    description: 'Period granularity for insights',
    enum: ['day', 'week', 'days_28'],
    default: 'day',
  })
  @IsOptional()
  @IsIn(['day', 'week', 'days_28'])
  period?: 'day' | 'week' | 'days_28';

  @ApiPropertyOptional({
    description: 'Specific metric to focus on',
    enum: ['messages', 'comments', 'engagement', 'reach'],
  })
  @IsOptional()
  @IsIn(['messages', 'comments', 'engagement', 'reach'])
  metric?: 'messages' | 'comments' | 'engagement' | 'reach';

  @ApiPropertyOptional({
    description: 'Include detailed breakdown',
    default: false,
  })
  @IsOptional()
  includeDetails?: boolean;
}

export class ExportAnalyticsDto extends AnalyticsFiltersDto {
  @ApiPropertyOptional({
    description: 'Export format',
    enum: ['json', 'csv'],
    default: 'json',
  })
  @IsOptional()
  @IsIn(['json', 'csv'])
  format?: 'json' | 'csv';

  @ApiPropertyOptional({
    description: 'Include raw data in export',
    default: false,
  })
  @IsOptional()
  includeRawData?: boolean;
}

export class ResponseTimeFiltersDto {
  @ApiProperty({
    description: 'Start date for analysis',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'End date for analysis',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDateString()
  toDate: string;

  @ApiPropertyOptional({
    description: 'Group by period',
    enum: ['hour', 'day', 'week'],
    default: 'day',
  })
  @IsOptional()
  @IsIn(['hour', 'day', 'week'])
  groupBy?: 'hour' | 'day' | 'week';

  @ApiPropertyOptional({
    description: 'Communication type to analyze',
    enum: ['messages', 'comments', 'both'],
    default: 'both',
  })
  @IsOptional()
  @IsIn(['messages', 'comments', 'both'])
  type?: 'messages' | 'comments' | 'both';
}

export class InsightMetricsDto {
  @ApiPropertyOptional({
    description: 'Specific metrics to retrieve',
    type: [String],
    example: ['page_fans', 'page_impressions', 'page_engaged_users'],
  })
  @IsOptional()
  metrics?: string[];

  @ApiPropertyOptional({
    description: 'Period for metrics',
    enum: ['day', 'week', 'days_28'],
    default: 'day',
  })
  @IsOptional()
  @IsIn(['day', 'week', 'days_28'])
  period?: 'day' | 'week' | 'days_28';

  @ApiPropertyOptional({
    description: 'Number of data points to retrieve',
    minimum: 1,
    maximum: 100,
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class CustomDateRangeDto {
  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date (ISO 8601 format)',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Timezone for date interpretation',
    example: 'UTC',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class BenchmarkDto {
  @ApiProperty({
    description: 'Metric to benchmark',
    enum: ['response_time', 'engagement_rate', 'resolution_rate'],
  })
  @IsIn(['response_time', 'engagement_rate', 'resolution_rate'])
  metric: 'response_time' | 'engagement_rate' | 'resolution_rate';

  @ApiProperty({
    description: 'Time period for comparison',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDateString()
  compareFromDate: string;

  @ApiProperty({
    description: 'End date for comparison period',
    example: '2025-01-31T23:59:59Z',
  })
  @IsDateString()
  compareToDate: string;

  @ApiPropertyOptional({
    description: 'Industry benchmark to compare against',
    enum: ['retail', 'hospitality', 'tech', 'healthcare'],
  })
  @IsOptional()
  @IsIn(['retail', 'hospitality', 'tech', 'healthcare'])
  industry?: 'retail' | 'hospitality' | 'tech' | 'healthcare';
}

// Alias for backward compatibility
export class AnalyticsFilterDto extends AnalyticsFiltersDto {}
