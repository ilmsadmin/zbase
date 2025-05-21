import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsISO8601 } from 'class-validator';
import { ReportType } from './create-report.dto';

export class QueryReportDto {
  @ApiProperty({ description: 'Tìm theo tên báo cáo', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ReportType, description: 'Lọc theo loại báo cáo', required: false })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiProperty({ description: 'Lọc báo cáo từ ngày', required: false })
  @IsOptional()
  @IsISO8601()
  createdFrom?: string;

  @ApiProperty({ description: 'Lọc báo cáo đến ngày', required: false })
  @IsOptional()
  @IsISO8601()
  createdTo?: string;

  @ApiProperty({ description: 'ID người tạo báo cáo', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ description: 'ID template báo cáo', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;
}
