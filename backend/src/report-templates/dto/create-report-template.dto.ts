import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject, IsEnum, IsArray } from 'class-validator';
import { ReportType, ReportFormat } from '../../reports/dto/create-report.dto';

export class CreateReportTemplateDto {
  @ApiProperty({ description: 'Tên template báo cáo' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả template báo cáo', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportType, description: 'Loại báo cáo áp dụng cho template' })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ description: 'Cấu hình mẫu báo cáo (JSON)' })
  @IsNotEmpty()
  @IsObject()
  templateConfig: Record<string, any>;
  
  @ApiProperty({ description: 'Nội dung HTML của template', required: false })
  @IsOptional()
  @IsString()
  htmlContent?: string;

  @ApiProperty({ description: 'Các trường dữ liệu cần thiết cho template', required: false })
  @IsOptional()
  @IsArray()
  requiredFields?: string[];

  @ApiProperty({ enum: ReportFormat, description: 'Các định dạng xuất hỗ trợ', required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ReportFormat, { each: true })
  supportedFormats?: ReportFormat[];
  
  @ApiProperty({ description: 'ID của người tạo template', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
