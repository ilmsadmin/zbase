import { Test, TestingModule } from '@nestjs/testing';
import { ReportTemplatesService } from './report-templates.service';
import { ReportsService as MongoReportsService } from '../mongo/reports.service';
import { CreateReportTemplateDto, UpdateReportTemplateDto } from './dto';
import { ReportType, ReportFormat } from '../reports/dto/create-report.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReportTemplatesService', () => {
  let service: ReportTemplatesService;
  let mongoReportsService: MongoReportsService;

  const mockMongoReportsService = {
    createReportTemplate: jest.fn(),
    findAllReportTemplates: jest.fn(),
    findReportTemplateById: jest.fn(),
    updateReportTemplate: jest.fn(),
    removeReportTemplate: jest.fn(),
    setDefaultTemplate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportTemplatesService,
        {
          provide: MongoReportsService,
          useValue: mockMongoReportsService,
        },
      ],
    }).compile();

    service = module.get<ReportTemplatesService>(ReportTemplatesService);
    mongoReportsService = module.get<MongoReportsService>(MongoReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a report template', async () => {
      const createDto: CreateReportTemplateDto = {
        name: 'Test Template',
        reportType: ReportType.SALES,
        templateConfig: { layout: 'default' },
        supportedFormats: [ReportFormat.PDF, ReportFormat.EXCEL],
      };

      const mockTemplate = {
        id: 'mockId',
        ...createDto,
      };

      mockMongoReportsService.createReportTemplate.mockResolvedValue(mockTemplate);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTemplate);
      expect(mockMongoReportsService.createReportTemplate).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all report templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Template 1' },
        { id: '2', name: 'Template 2' },
      ];

      mockMongoReportsService.findAllReportTemplates.mockResolvedValue(mockTemplates);

      const result = await service.findAll();

      expect(result).toEqual(mockTemplates);
      expect(mockMongoReportsService.findAllReportTemplates).toHaveBeenCalledWith({});
    });
  });

  describe('findByType', () => {
    it('should return templates by report type', async () => {
      const mockTemplates = [
        { id: '1', name: 'Sales Template 1', reportType: ReportType.SALES },
        { id: '2', name: 'Sales Template 2', reportType: ReportType.SALES },
      ];

      mockMongoReportsService.findAllReportTemplates.mockResolvedValue(mockTemplates);

      const result = await service.findByType(ReportType.SALES);

      expect(result).toEqual(mockTemplates);
      expect(mockMongoReportsService.findAllReportTemplates).toHaveBeenCalledWith({
        reportType: ReportType.SALES,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single report template', async () => {
      const mockTemplate = { id: '1', name: 'Template 1' };

      mockMongoReportsService.findReportTemplateById.mockResolvedValue(mockTemplate);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTemplate);
      expect(mockMongoReportsService.findReportTemplateById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if template not found', async () => {
      mockMongoReportsService.findReportTemplateById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a report template', async () => {
      const mockTemplate = { id: '1', name: 'Template 1' };
      const updateDto = { name: 'Updated Template' };
      const updatedTemplate = { id: '1', name: 'Updated Template' };

      mockMongoReportsService.findReportTemplateById.mockResolvedValue(mockTemplate);
      mockMongoReportsService.updateReportTemplate.mockResolvedValue(updatedTemplate);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedTemplate);
      expect(mockMongoReportsService.updateReportTemplate).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw NotFoundException if template not found', async () => {
      mockMongoReportsService.findReportTemplateById.mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a report template', async () => {
      const mockTemplate = { id: '1', name: 'Template 1' };

      mockMongoReportsService.findReportTemplateById.mockResolvedValue(mockTemplate);
      mockMongoReportsService.removeReportTemplate.mockResolvedValue(mockTemplate);

      const result = await service.remove('1');

      expect(result).toEqual(mockTemplate);
      expect(mockMongoReportsService.removeReportTemplate).toHaveBeenCalledWith('1');
    });
  });

  describe('setDefault', () => {
    it('should set a template as default', async () => {
      const mockTemplate = { 
        id: '1', 
        name: 'Template 1',
        reportType: ReportType.SALES 
      };

      mockMongoReportsService.findReportTemplateById.mockResolvedValue(mockTemplate);
      mockMongoReportsService.setDefaultTemplate.mockResolvedValue(undefined);

      const result = await service.setDefault('1');

      expect(result).toEqual({ success: true, message: 'Template set as default' });
      expect(mockMongoReportsService.setDefaultTemplate).toHaveBeenCalledWith('1', ReportType.SALES);
    });
  });
});
