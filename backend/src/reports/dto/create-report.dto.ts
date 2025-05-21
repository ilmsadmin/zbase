import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsObject, IsISO8601, IsArray } from 'class-validator';

export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  CUSTOMERS = 'CUSTOMERS',
  FINANCIAL = 'FINANCIAL',
  CUSTOM = 'CUSTOM',
}

export enum ReportFrequency {
  ONCE = 'ONCE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

export class CreateReportDto {
  @ApiProperty({ description: 'Tên báo cáo' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả báo cáo', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportType, description: 'Loại báo cáo' })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ description: 'Cấu hình báo cáo (JSON)', required: false })
  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @ApiProperty({ description: 'Template ID nếu sử dụng template', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;
  
  @ApiProperty({ description: 'Thời gian bắt đầu dữ liệu báo cáo', required: false })
  @IsOptional()
  @IsISO8601()
  startDate?: string;
  
  @ApiProperty({ description: 'Thời gian kết thúc dữ liệu báo cáo', required: false })
  @IsOptional()
  @IsISO8601()
  endDate?: string;
  
  @ApiProperty({ enum: ReportFrequency, description: 'Tần suất tạo báo cáo', required: false })
  @IsOptional()
  @IsEnum(ReportFrequency)
  frequency?: ReportFrequency;
  
  @ApiProperty({ enum: ReportFormat, description: 'Định dạng xuất báo cáo', required: false, isArray: true, default: [ReportFormat.PDF] })
  @IsOptional()
  @IsArray()
  @IsEnum(ReportFormat, { each: true })
  formats?: ReportFormat[];
  
  @ApiProperty({ description: 'ID của người tạo báo cáo', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
