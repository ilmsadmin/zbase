import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { MongoModule } from '../mongo/mongo.module';
import { ReportsService as MongoReportsService } from '../mongo/reports.service';
import { AnalyticsService } from '../mongo/analytics.service';
import { CreateReportDto, ReportType, ReportFormat, ReportFrequency } from './dto';
import * as fs from 'fs';
import * as path from 'path';

describe('ReportsService', () => {
  let service: ReportsService;
  let mongoReportsService: MongoReportsService;

  const mockMongoReportsService = {
    createReport: jest.fn(),
    findAllReports: jest.fn(),
    findReportById: jest.fn(),
    updateReport: jest.fn(),
    updateReportStatus: jest.fn(),
    removeReport: jest.fn(),
    addGeneratedReportUrl: jest.fn(),
    findReportTemplateById: jest.fn(),
    getDefaultTemplateByType: jest.fn(),
  };

  const mockAnalyticsService = {
    getSalesAnalytics: jest.fn(),
    getInventoryAnalytics: jest.fn(),
    getCustomerAnalytics: jest.fn(),
    getFinancialAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: MongoReportsService,
          useValue: mockMongoReportsService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    mongoReportsService = module.get<MongoReportsService>(MongoReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a report', async () => {
      const createReportDto: CreateReportDto = {
        name: 'Test Report',
        description: 'Test Description',
        type: ReportType.SALES,
        frequency: ReportFrequency.ONCE,
        formats: [ReportFormat.PDF],
      };

      const mockReport = {
        id: 'mockId',
        ...createReportDto,
      };

      mockMongoReportsService.createReport.mockResolvedValue(mockReport);

      const result = await service.create(createReportDto);

      expect(result).toEqual(mockReport);
      expect(mockMongoReportsService.createReport).toHaveBeenCalledWith(createReportDto);
    });
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      const mockReports = [
        { id: '1', name: 'Report 1' },
        { id: '2', name: 'Report 2' },
      ];

      mockMongoReportsService.findAllReports.mockResolvedValue(mockReports);

      const result = await service.findAll({});

      expect(result).toEqual(mockReports);
      expect(mockMongoReportsService.findAllReports).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a single report', async () => {
      const mockReport = { id: '1', name: 'Report 1' };

      mockMongoReportsService.findReportById.mockResolvedValue(mockReport);

      const result = await service.findOne('1');

      expect(result).toEqual(mockReport);
      expect(mockMongoReportsService.findReportById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if report not found', async () => {
      mockMongoReportsService.findReportById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a report', async () => {
      const mockReport = { id: '1', name: 'Report 1' };
      const updateDto = { name: 'Updated Report' };
      const updatedReport = { id: '1', name: 'Updated Report' };

      mockMongoReportsService.findReportById.mockResolvedValue(mockReport);
      mockMongoReportsService.updateReport.mockResolvedValue(updatedReport);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedReport);
      expect(mockMongoReportsService.updateReport).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a report', async () => {
      const mockReport = { id: '1', name: 'Report 1' };

      mockMongoReportsService.findReportById.mockResolvedValue(mockReport);
      mockMongoReportsService.removeReport.mockResolvedValue(mockReport);

      const result = await service.remove('1');

      expect(result).toEqual(mockReport);
      expect(mockMongoReportsService.removeReport).toHaveBeenCalledWith('1');
    });
  });

  // More tests can be added for other methods like generateReport, downloadReport, etc.
});
