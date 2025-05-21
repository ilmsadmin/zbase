import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { ReportTemplate, ReportTemplateDocument } from './schemas/report-template.schema';
import { CreateReportDto, ReportType, UpdateReportDto, QueryReportDto } from '../reports/dto';
import { 
  CreateReportTemplateDto, 
  UpdateReportTemplateDto, 
  QueryReportTemplateDto 
} from '../report-templates/dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(ReportTemplate.name) private reportTemplateModel: Model<ReportTemplateDocument>,
  ) {}

  // === Report methods ===
  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const createdReport = new this.reportModel({
      ...createReportDto,
      status: 'PENDING',
    });
    return createdReport.save();
  }

  async findAllReports(queryDto: QueryReportDto = {}): Promise<Report[]> {
    const query: any = {};
    
    if (queryDto.name) {
      query.name = { $regex: queryDto.name, $options: 'i' };
    }
    
    if (queryDto.type) {
      query.type = queryDto.type;
    }
    
    if (queryDto.createdBy) {
      query.createdBy = queryDto.createdBy;
    }
    
    if (queryDto.templateId) {
      query.templateId = queryDto.templateId;
    }
    
    if (queryDto.createdFrom || queryDto.createdTo) {
      query.createdAt = {};
      if (queryDto.createdFrom) {
        query.createdAt.$gte = new Date(queryDto.createdFrom);
      }
      if (queryDto.createdTo) {
        query.createdAt.$lte = new Date(queryDto.createdTo);
      }
    }
    
    return this.reportModel.find(query).sort({ createdAt: -1 }).exec();
  }
  async findReportById(id: string): Promise<Report | null> {
    return this.reportModel.findById(id).exec();
  }
  async updateReport(id: string, updateReportDto: UpdateReportDto): Promise<Report | null> {
    return this.reportModel
      .findByIdAndUpdate(id, updateReportDto, { new: true })
      .exec();
  }

  async updateReportStatus(id: string, status: string, errorMessage?: string): Promise<Report | null> {
    const updateData: any = { status };
    
    if (status === 'COMPLETED') {
      updateData.lastGeneratedAt = new Date();
    }
    
    if (errorMessage && status === 'FAILED') {
      updateData.errorMessage = errorMessage;
    }
    
    return this.reportModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async removeReport(id: string): Promise<Report | null> {
    return this.reportModel.findByIdAndDelete(id).exec();
  }

  async addGeneratedReportUrl(id: string, url: string): Promise<Report | null> {
    return this.reportModel
      .findByIdAndUpdate(
        id,
        { $push: { generatedReportUrls: url } },
        { new: true }
      )
      .exec();
  }

  // === Report Template methods ===
  async createReportTemplate(createDto: CreateReportTemplateDto): Promise<ReportTemplate> {
    const createdTemplate = new this.reportTemplateModel(createDto);
    return createdTemplate.save();
  }

  async findAllReportTemplates(queryDto: QueryReportTemplateDto = {}): Promise<ReportTemplate[]> {
    const query: any = { isActive: true };
    
    if (queryDto.name) {
      query.name = { $regex: queryDto.name, $options: 'i' };
    }
    
    if (queryDto.reportType) {
      query.reportType = queryDto.reportType;
    }
    
    if (queryDto.createdBy) {
      query.createdBy = queryDto.createdBy;
    }
    
    return this.reportTemplateModel.find(query).sort({ createdAt: -1 }).exec();
  }
  async findReportTemplateById(id: string): Promise<ReportTemplate | null> {
    return this.reportTemplateModel.findById(id).exec();
  }

  async getDefaultTemplateByType(reportType: ReportType): Promise<ReportTemplate | null> {
    return this.reportTemplateModel
      .findOne({ reportType, isDefault: true, isActive: true })
      .exec();
  }

  async updateReportTemplate(id: string, updateDto: UpdateReportTemplateDto): Promise<ReportTemplate | null> {
    return this.reportTemplateModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async removeReportTemplate(id: string): Promise<ReportTemplate | null> {
    // Soft delete - mark as inactive
    return this.reportTemplateModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async setDefaultTemplate(id: string, reportType: ReportType): Promise<void> {
    // Reset all existing defaults for this type
    await this.reportTemplateModel.updateMany(
      { reportType, isDefault: true },
      { isDefault: false }
    );
    
    // Set the new default
    await this.reportTemplateModel.findByIdAndUpdate(id, { isDefault: true });
  }
}
