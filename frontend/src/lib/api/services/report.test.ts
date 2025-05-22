import { reportService, ReportType, ReportFormat, ReportFrequency, ReportStatus } from './report';
import { apiClient } from "../client";

// Mock the API client
jest.mock('../client', () => ({
  apiClient: {
    request: jest.fn()
  }
}));

describe('reportService', () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReports', () => {
    it('should fetch reports with filters', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '1',
              name: 'Test Report',
              type: ReportType.SALES,
              format: ReportFormat.PDF,
              parameters: {},
              frequency: ReportFrequency.ONCE,
              status: ReportStatus.COMPLETED,
              createdBy: 1,
              createdAt: '2025-05-20T12:00:00Z',
              updatedAt: '2025-05-20T12:00:00Z',
            }
          ],
          total: 1,
          page: 1,
          limit: 10
        }
      };
      
      mockedApiClient.request.mockResolvedValueOnce(mockResponse);
      
      const filter = {
        type: ReportType.SALES,
        status: ReportStatus.COMPLETED,
        page: 1,
        limit: 10
      };
      
      const result = await reportService.getReports(filter);
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        endpoint: '/reports',
        params: filter
      });
      
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('getReportById', () => {
    it('should fetch a specific report by ID', async () => {
      const mockReport = {
        id: '1',
        name: 'Test Report',
        type: ReportType.SALES,
        format: ReportFormat.PDF,
        parameters: {},
        frequency: ReportFrequency.ONCE,
        status: ReportStatus.COMPLETED,
        createdBy: 1,
        createdAt: '2025-05-20T12:00:00Z',
        updatedAt: '2025-05-20T12:00:00Z',
      };
      
      mockedApiClient.request.mockResolvedValueOnce({ data: mockReport });
      
      const result = await reportService.getReportById('1');
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        endpoint: '/reports/1',
      });
      
      expect(result).toEqual(mockReport);
    });
  });
  
  describe('createReport', () => {
    it('should create a new report', async () => {
      const newReport = {
        name: 'New Report',
        type: ReportType.INVENTORY,
        format: ReportFormat.EXCEL,
        parameters: { startDate: '2025-05-01', endDate: '2025-05-20' },
        frequency: ReportFrequency.WEEKLY,
      };
      
      const mockCreatedReport = {
        id: '2',
        ...newReport,
        status: ReportStatus.PENDING,
        createdBy: 1,
        createdAt: '2025-05-20T12:00:00Z',
        updatedAt: '2025-05-20T12:00:00Z',
      };
      
      mockedApiClient.request.mockResolvedValueOnce({ data: mockCreatedReport });
      
      const result = await reportService.createReport(newReport);
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'POST',
        endpoint: '/reports',
        data: newReport
      });
      
      expect(result).toEqual(mockCreatedReport);
    });
  });
  
  describe('generateReport', () => {
    it('should generate a report and return file URL', async () => {
      const mockResponse = {
        data: {
          fileUrl: '/uploads/reports/report-123.pdf'
        }
      };
      
      mockedApiClient.request.mockResolvedValueOnce(mockResponse);
      
      const result = await reportService.generateReport('1');
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'POST',
        endpoint: '/reports/1/generate',
      });
      
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('downloadReport', () => {
    it('should download report as blob', async () => {
      const mockBlob = new Blob(['test report content'], { type: 'application/pdf' });
      
      mockedApiClient.request.mockResolvedValueOnce({ data: mockBlob });
      
      const result = await reportService.downloadReport('1');
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        endpoint: '/reports/1/download',
        responseType: 'blob',
      });
      
      expect(result).toEqual(mockBlob);
    });
  });
  
  describe('getReportsSummary', () => {
    it('should fetch reports summary', async () => {
      const mockSummary = {
        recentReports: [
          {
            id: '1',
            name: 'Test Report',
            type: ReportType.SALES,
            format: ReportFormat.PDF,
            parameters: {},
            frequency: ReportFrequency.ONCE,
            status: ReportStatus.COMPLETED,
            createdBy: 1,
            createdAt: '2025-05-20T12:00:00Z',
            updatedAt: '2025-05-20T12:00:00Z',
          }
        ],
        reportCounts: {
          [ReportType.SALES]: 5,
          [ReportType.INVENTORY]: 3,
          [ReportType.ACCOUNTS_RECEIVABLE]: 2,
          [ReportType.CUSTOM]: 1,
        }
      };
      
      mockedApiClient.request.mockResolvedValueOnce({ data: mockSummary });
      
      const result = await reportService.getReportsSummary();
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'GET',
        endpoint: '/reports/summary',
      });
      
      expect(result).toEqual(mockSummary);
    });
  });
  
  describe('getReportData', () => {
    it('should fetch direct report visualization data', async () => {
      const params = {
        type: ReportType.SALES,
        parameters: {
          startDate: '2025-05-01',
          endDate: '2025-05-20',
          groupBy: 'day'
        }
      };
      
      const mockData = {
        summary: {
          totalSales: 12500,
          avgOrderValue: 125,
          orderCount: 100
        },
        chartData: [
          { date: '2025-05-01', sales: 1200 },
          { date: '2025-05-02', sales: 1350 },
          // ...more data
        ]
      };
      
      mockedApiClient.request.mockResolvedValueOnce({ data: mockData });
      
      const result = await reportService.getReportData(params);
      
      expect(mockedApiClient.request).toHaveBeenCalledWith({
        method: 'POST',
        endpoint: '/reports/data',
        data: params
      });
      
      expect(result).toEqual(mockData);
    });
  });
});
