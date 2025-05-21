import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportType } from '../../reports/dto/create-report.dto';

export class QueryReportTemplateDto {
  @ApiProperty({ description: 'Tìm theo tên template', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ReportType, description: 'Lọc theo loại báo cáo', required: false })
  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @ApiProperty({ description: 'ID người tạo template', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
