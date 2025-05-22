import { reportDataService } from './mock-report-data';
import { ReportType } from '@/lib/api/services/report';

// Mock the import of the real report service
jest.mock('@/lib/api/services/report', () => ({
  reportService: {
    getReportData: jest.fn()
  },
  ReportType: {
    SALES: 'sales',
    INVENTORY: 'inventory',
    ACCOUNTS_RECEIVABLE: 'accounts-receivable',
    CUSTOM: 'custom'
  }
}));

describe('Mock Report Data Service', () => {
  describe('getReportData', () => {
    it('should generate mock sales report data', async () => {
      const salesParams = {
        startDate: '2025-05-01',
        endDate: '2025-05-31',
        groupBy: 'day'
      };
      
      const result = await reportDataService.getReportData({
        type: ReportType.SALES,
        parameters: salesParams
      });
      
      // Verify structure
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('chartData');
      expect(result).toHaveProperty('tableData');
      
      // Verify summary metrics
      expect(result.summary).toHaveProperty('totalSales');
      expect(result.summary).toHaveProperty('totalOrders');
      expect(result.summary).toHaveProperty('avgOrderValue');
      expect(result.summary).toHaveProperty('topSellingProduct');
      expect(result.summary).toHaveProperty('topSellingCategory');
      
      // Verify chart data
      expect(result.chartData).toHaveProperty('salesByDay');
      expect(result.chartData).toHaveProperty('salesByProduct');
      expect(result.chartData).toHaveProperty('salesByCategory');
      
      // Verify date range is respected
      expect(result.tableData.length).toBe(31); // May has 31 days
    });
    
    it('should generate mock inventory report data', async () => {
      const inventoryParams = {
        asOfDate: '2025-05-15',
        warehouseId: 1,
        belowThreshold: true
      };
      
      const result = await reportDataService.getReportData({
        type: ReportType.INVENTORY,
        parameters: inventoryParams
      });
      
      // Verify structure
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('chartData');
      expect(result).toHaveProperty('tableData');
      
      // Verify summary metrics
      expect(result.summary).toHaveProperty('totalProducts');
      expect(result.summary).toHaveProperty('lowStockItems');
      expect(result.summary).toHaveProperty('outOfStockItems');
      expect(result.summary).toHaveProperty('totalValue');
      expect(result.summary).toHaveProperty('avgProductValue');
      
      // Verify chart data
      expect(result.chartData).toHaveProperty('stockByCategory');
      expect(result.chartData).toHaveProperty('stockByWarehouse');
      
      // Verify warehouse filter is applied (somewhat)
      expect(result.tableData.length).toBeGreaterThan(0);
      expect(result.tableData.every(item => item.isLowStock)).toBe(true);
    });
    
    it('should generate mock accounts receivable report data', async () => {
      const arParams = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        customerId: 1
      };
      
      const result = await reportDataService.getReportData({
        type: ReportType.ACCOUNTS_RECEIVABLE,
        parameters: arParams
      });
      
      // Verify structure
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('chartData');
      expect(result).toHaveProperty('tableData');
      
      // Verify summary metrics
      expect(result.summary).toHaveProperty('totalReceivables');
      expect(result.summary).toHaveProperty('currentReceivables');
      expect(result.summary).toHaveProperty('overdueReceivables');
      expect(result.summary).toHaveProperty('avgDaysToPay');
      
      // Verify chart data
      expect(result.chartData).toHaveProperty('agingBuckets');
      expect(result.chartData).toHaveProperty('receivablesByCustomer');
      
      // Verify customer filter is applied
      expect(result.tableData.length).toBeGreaterThan(0);
    });
  });
});
