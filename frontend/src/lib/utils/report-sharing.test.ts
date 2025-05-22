import {
  prepareReportForExport,
  createReportShareURL,
  emailReport,
  scheduleReportDelivery,
  createEmbeddedReportCode
} from './report-sharing';

describe('Report Sharing Utilities', () => {
  describe('prepareReportForExport', () => {
    const mockReportData = {
      summary: {
        totalSales: 12500,
        avgOrderValue: 125,
        orderCount: 100
      },
      tableData: [
        { date: '2025-05-01', sales: 1200 },
        { date: '2025-05-02', sales: 1350 }
      ],
      chartData: {
        salesByDay: [
          { date: '2025-05-01', revenue: 1200 },
          { date: '2025-05-02', revenue: 1350 }
        ]
      }
    };

    it('should prepare data for CSV export', () => {
      const result = prepareReportForExport(mockReportData, 'csv');
      
      // CSV export should extract tableData
      expect(result).toEqual(mockReportData.tableData);
    });
    
    it('should prepare data for Excel export', () => {
      const result = prepareReportForExport(mockReportData, 'excel');
      
      // Excel export should keep structured data with summaries and multiple sheets
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('salesByDay');
    });
    
    it('should prepare data for PDF export', () => {
      const result = prepareReportForExport(mockReportData, 'pdf');
      
      // PDF export should add layout information
      expect(result).toHaveProperty('layout');
      expect(result.layout).toHaveProperty('orientation');
      expect(result.layout).toHaveProperty('includeCharts');
    });
    
    it('should prepare data for JSON export', () => {
      const dataWithMetadata = {
        ...mockReportData,
        _metadata: { generated: '2025-05-10' },
        _internal: { processingTime: 230 }
      };
      
      const result = prepareReportForExport(dataWithMetadata, 'json');
      
      // JSON export should remove internal properties
      expect(result).not.toHaveProperty('_metadata');
      expect(result).not.toHaveProperty('_internal');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('tableData');
    });
  });
  
  describe('createReportShareURL', () => {
    const originalWindow = global.window;
    
    beforeEach(() => {
      global.window = {
        ...global.window,
        location: {
          origin: 'https://app.zbase.com'
        }
      };
    });
    
    afterEach(() => {
      global.window = originalWindow;
    });
    
    it('should create a basic share URL', () => {
      const url = createReportShareURL('report-123', {});
      
      expect(url).toMatch(/^https:\/\/app\.zbase\.com\/shared-reports\/report-123\?token=/);
    });
    
    it('should add format parameter if provided', () => {
      const url = createReportShareURL('report-123', { format: 'pdf' });
      
      expect(url).toContain('format=pdf');
    });
    
    it('should add public access parameter if provided', () => {
      const url = createReportShareURL('report-123', { public: true });
      
      expect(url).toContain('access=public');
    });
    
    it('should add expiration if provided', () => {
      const url = createReportShareURL('report-123', { expiration: 24 });
      
      expect(url).toContain('expires=');
      expect(url).toMatch(/expires=\d{4}-\d{2}-\d{2}T/); // ISO date format
    });
    
    it('should add view-only mode if provided', () => {
      const url = createReportShareURL('report-123', { viewOnly: true });
      
      expect(url).toContain('mode=view');
    });
  });
  
  describe('emailReport', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });
    
    it('should call the API with correct parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });
      
      const result = await emailReport(
        'report-123', 
        ['user@example.com'], 
        'Monthly Sales Report', 
        'Please find attached the monthly sales report.',
        'pdf'
      );
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reports/report-123/email',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('user@example.com')
        })
      );
    });
    
    it('should return false if API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });
      
      const result = await emailReport(
        'report-123', 
        ['user@example.com'], 
        'Monthly Sales Report', 
        'Please find attached the monthly sales report.'
      );
      
      expect(result).toBe(false);
    });
  });
  
  describe('scheduleReportDelivery', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });
    
    it('should call the API with correct parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, jobId: 'job-123' })
      });
      
      const schedule = {
        frequency: 'weekly' as const,
        dayOfWeek: 1,
        time: '09:00',
        timezone: 'America/New_York'
      };
      
      const delivery = {
        email: ['team@example.com'],
        format: 'pdf' as const,
        subject: 'Weekly Sales Report'
      };
      
      const result = await scheduleReportDelivery('report-123', schedule, delivery);
      
      expect(result).toEqual({ success: true, jobId: 'job-123' });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reports/report-123/schedule',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('weekly')
        })
      );
    });
    
    it('should return failure if API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });
      
      const result = await scheduleReportDelivery(
        'report-123', 
        { frequency: 'daily' as const, time: '08:00' },
        { email: ['user@example.com'] }
      );
      
      expect(result).toEqual({ success: false });
    });
  });
  
  describe('createEmbeddedReportCode', () => {
    it('should create iframe code with default settings', () => {
      const code = createEmbeddedReportCode('report-123', {});
      
      expect(code).toContain('<iframe');
      expect(code).toContain('src="');
      expect(code).toContain('report-123');
      expect(code).toContain('width="100%"');
      expect(code).toContain('height="600px"');
      expect(code).toContain('allowfullscreen');
    });
    
    it('should respect custom width and height', () => {
      const code = createEmbeddedReportCode('report-123', {
        width: '800px',
        height: '400px'
      });
      
      expect(code).toContain('width="800px"');
      expect(code).toContain('height="400px"');
    });
    
    it('should disable fullscreen if specified', () => {
      const code = createEmbeddedReportCode('report-123', {
        allowFullscreen: false
      });
      
      expect(code).not.toContain('allowfullscreen');
    });
    
    it('should disable controls if specified', () => {
      const code = createEmbeddedReportCode('report-123', {
        showControls: false
      });
      
      expect(code).toContain('controls=false');
    });
  });
});
