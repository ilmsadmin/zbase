import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsService as MongoReportsService } from '../mongo/reports.service';
import { CreateReportTemplateDto, UpdateReportTemplateDto, QueryReportTemplateDto } from './dto';
import { ReportType } from '../reports/dto/create-report.dto';

@Injectable()
export class ReportTemplatesService {
  constructor(private readonly mongoReportsService: MongoReportsService) {}

  async create(createReportTemplateDto: CreateReportTemplateDto) {
    return this.mongoReportsService.createReportTemplate(createReportTemplateDto);
  }

  async findAll(queryDto: QueryReportTemplateDto = {}) {
    return this.mongoReportsService.findAllReportTemplates(queryDto);
  }

  async findByType(type: ReportType) {
    return this.mongoReportsService.findAllReportTemplates({ reportType: type });
  }

  async findOne(id: string) {
    const template = await this.mongoReportsService.findReportTemplateById(id);
    if (!template) {
      throw new NotFoundException(`Report template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, updateReportTemplateDto: UpdateReportTemplateDto) {
    await this.findOne(id); // Check if exists
    return this.mongoReportsService.updateReportTemplate(id, updateReportTemplateDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists
    return this.mongoReportsService.removeReportTemplate(id);
  }

  async setDefault(id: string) {
    const template = await this.findOne(id);
    await this.mongoReportsService.setDefaultTemplate(id, template.reportType);
    return { success: true, message: 'Template set as default' };
  }
}
