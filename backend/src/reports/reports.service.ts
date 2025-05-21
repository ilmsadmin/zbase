import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReportsService as MongoReportsService } from '../mongo/reports.service';
import { AnalyticsService } from '../mongo/analytics.service';
import { CreateReportDto, UpdateReportDto, QueryReportDto, ReportType, ReportFormat } from './dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

@Injectable()
export class ReportsService {
  private readonly uploadsDir = './uploads/reports';
  private readonly reportsDir = './generated-reports';

  constructor(
    private readonly mongoReportsService: MongoReportsService,
    private readonly analyticsService: AnalyticsService,
  ) {
    // Tạo thư mục nếu chưa tồn tại
    this.ensureDirectoryExists(this.uploadsDir);
    this.ensureDirectoryExists(this.reportsDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }  async create(createReportDto: CreateReportDto) {
    // Tạo báo cáo trong MongoDB
    const report = await this.mongoReportsService.createReport(createReportDto);    // Nếu yêu cầu tạo báo cáo ngay lập tức
    if (createReportDto.frequency === 'ONCE' && report) {
      // Tạo báo cáo bất đồng bộ - MongoDB uses _id for document IDs
      // We need to cast the report to any since the TypeScript type doesn't match the actual runtime object
      const mongoReport = report as any;
      const reportId = mongoReport._id ? mongoReport._id.toString() : undefined;
      if (reportId) {
        this.generateReport(reportId);
      }
    }
    
    return report;
  }

  async findAll(queryDto: QueryReportDto) {
    return this.mongoReportsService.findAllReports(queryDto);
  }

  async findOne(id: string) {
    const report = await this.mongoReportsService.findReportById(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const existingReport = await this.findOne(id);
    return this.mongoReportsService.updateReport(id, updateReportDto);
  }

  async remove(id: string) {
    const existingReport = await this.findOne(id);
    return this.mongoReportsService.removeReport(id);
  }

  async generateReport(id: string) {
    const report = await this.findOne(id);
    
    try {
      // Cập nhật trạng thái báo cáo thành đang xử lý
      await this.mongoReportsService.updateReportStatus(id, 'PROCESSING');
      
      // Lấy dữ liệu báo cáo dựa trên loại báo cáo
      const reportData = await this.getReportData(report);
      
      // Lấy template báo cáo
      let template;
      if (report.templateId) {
        template = await this.mongoReportsService.findReportTemplateById(report.templateId);
      } else {
        // Lấy template mặc định cho loại báo cáo
        template = await this.mongoReportsService.getDefaultTemplateByType(report.type);
      }
        // Nếu không có định dạng yêu cầu, sử dụng định dạng mặc định là PDF
      const formats = (report.formats && report.formats.length > 0) ? report.formats : [ReportFormat.PDF];
        // Tạo báo cáo theo từng định dạng
      const generatedFiles: string[] = [];
      
      for (const format of formats) {
        const fileName = await this.createReportFile(reportData, format, template, report.name);
        generatedFiles.push(fileName);
        
        // Cập nhật URL của báo cáo đã tạo
        await this.mongoReportsService.addGeneratedReportUrl(id, fileName);
      }
      
      // Cập nhật trạng thái báo cáo thành hoàn thành
      await this.mongoReportsService.updateReportStatus(id, 'COMPLETED');
      
      return generatedFiles;
    } catch (error) {
      // Cập nhật trạng thái báo cáo thành lỗi
      await this.mongoReportsService.updateReportStatus(id, 'FAILED', error.message);
      throw error;
    }
  }

  private async getReportData(report: any): Promise<any> {
    const startDate = report.startDate ? new Date(report.startDate) : new Date();
    const endDate = report.endDate ? new Date(report.endDate) : new Date();
    
    switch (report.type) {
      case ReportType.SALES:
        return this.analyticsService.getSalesAnalytics(startDate, endDate);
      case ReportType.INVENTORY:
        return this.analyticsService.getInventoryAnalytics(startDate, endDate);
      case ReportType.CUSTOMERS:
        return this.analyticsService.getCustomerAnalytics(startDate, endDate);
      case ReportType.FINANCIAL:
        return this.analyticsService.getFinancialAnalytics(startDate, endDate);
      case ReportType.CUSTOM:
        // Xử lý báo cáo tùy chỉnh dựa trên cấu hình
        return this.processCustomReport(report.configuration);
      default:
        throw new BadRequestException(`Unsupported report type: ${report.type}`);
    }
  }

  private async processCustomReport(configuration: any): Promise<any> {
    // Xử lý báo cáo tùy chỉnh dựa trên cấu hình
    // TODO: Implement custom report processing
    return { data: 'Custom report data', configuration };
  }

  private async createReportFile(data: any, format: ReportFormat, template: any, reportName: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = reportName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeName}_${timestamp}`;
    
    let outputPath: string;
    
    switch (format) {
      case ReportFormat.PDF:
        outputPath = path.join(this.reportsDir, `${filename}.pdf`);
        await this.generatePdfReport(data, outputPath, template);
        break;
      case ReportFormat.EXCEL:
        outputPath = path.join(this.reportsDir, `${filename}.xlsx`);
        await this.generateExcelReport(data, outputPath, template);
        break;
      case ReportFormat.CSV:
        outputPath = path.join(this.reportsDir, `${filename}.csv`);
        await this.generateCsvReport(data, outputPath);
        break;
      case ReportFormat.JSON:
        outputPath = path.join(this.reportsDir, `${filename}.json`);
        await this.generateJsonReport(data, outputPath);
        break;
      default:
        throw new BadRequestException(`Unsupported format: ${format}`);
    }
    
    return outputPath;
  }
  
  // Các phương thức tạo báo cáo theo định dạng
  private async generatePdfReport(data: any, outputPath: string, template: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);
        
        // Tạo báo cáo PDF dựa trên template và dữ liệu
        doc.fontSize(25).text('Báo Cáo', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Tạo ngày: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown();
        
        // Render dữ liệu báo cáo
        if (template && template.htmlContent) {
          // TODO: Convert HTML to PDF using appropriate library
          doc.fontSize(12).text('HTML Template không được hỗ trợ trực tiếp. Đang hiển thị dữ liệu dạng JSON.');
          doc.moveDown();
        }
        
        // Hiển thị dữ liệu dưới dạng text
        doc.fontSize(12).text(JSON.stringify(data, null, 2));
        
        doc.end();
        
        stream.on('finish', () => {
          resolve();
        });
        
        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private async generateExcelReport(data: any, outputPath: string, template: any): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo');
    
    // TODO: Format Excel worksheet based on template and data
    if (Array.isArray(data)) {
      // Nếu là mảng đối tượng, lấy tên cột từ key của đối tượng đầu tiên
      if (data.length > 0 && typeof data[0] === 'object') {
        const columns = Object.keys(data[0]).map(key => ({ header: key, key }));
        worksheet.columns = columns;
        worksheet.addRows(data);
      } else {
        // Nếu là mảng đơn giản
        worksheet.addRow(['Giá trị']);
        data.forEach(item => worksheet.addRow([item]));
      }
    } else if (typeof data === 'object') {
      // Nếu là đối tượng
      Object.entries(data).forEach(([key, value]) => {
        worksheet.addRow([key, JSON.stringify(value)]);
      });
    }
    
    await workbook.xlsx.writeFile(outputPath);
  }
  
  private async generateCsvReport(data: any, outputPath: string): Promise<void> {
    try {
      let csv: string;
      
      if (Array.isArray(data)) {
        const parser = new Parser();
        csv = parser.parse(data);
      } else {
        const parser = new Parser();
        csv = parser.parse([data]);
      }
      
      fs.writeFileSync(outputPath, csv);
    } catch (error) {
      console.error('Error generating CSV:', error);
      // Fallback to JSON if CSV parsing fails
      const jsonStr = JSON.stringify(data, null, 2);
      fs.writeFileSync(outputPath, jsonStr);
    }
  }
  
  private async generateJsonReport(data: any, outputPath: string): Promise<void> {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(outputPath, jsonStr);
  }

  async downloadReport(id: string, format?: string) {
    const report = await this.findOne(id);
    
    // Kiểm tra xem báo cáo đã được tạo chưa
    if (!report.generatedReportUrls || report.generatedReportUrls.length === 0) {
      throw new BadRequestException('Report has not been generated yet.');
    }
    
    // Nếu có format, tìm file phù hợp
    if (format) {
      const extension = `.${format.toLowerCase()}`;
      const reportFile = report.generatedReportUrls.find(url => url.endsWith(extension));
      
      if (!reportFile) {
        throw new NotFoundException(`Report in ${format} format not found.`);
      }
      
      return reportFile;
    }
    
    // Nếu không có format, trả về file đầu tiên
    return report.generatedReportUrls[0];
  }

  async processUploadedData(file: any) {
    // Xử lý file đã upload
    const filePath = file.path;
    const fileType = path.extname(file.originalname).toLowerCase();
    
    try {
      let data;
      
      switch (fileType) {
        case '.json':
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          break;
        case '.csv':
          // TODO: Parse CSV data
          data = { message: 'CSV parsing not implemented yet' };
          break;
        case '.xlsx':
          // TODO: Parse Excel data
          data = { message: 'Excel parsing not implemented yet' };
          break;
        default:
          throw new BadRequestException('Unsupported file format');
      }
      
      return {
        success: true,
        fileId: path.basename(filePath),
        fileType,
        recordCount: Array.isArray(data) ? data.length : 1,
        preview: Array.isArray(data) ? data.slice(0, 5) : data
      };
    } catch (error) {
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }
}
