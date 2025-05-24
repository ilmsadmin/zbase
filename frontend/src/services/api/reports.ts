// This file provides backward compatibility for components still importing from @/services/api/reports
// It re-exports the services from @/lib/services/reportsService

import { 
  reportsService,
  ReportCategory,
  SavedReport,
  QuickStat,
  RevenueData,
  RevenueReportData,
  MetricOption,
  FilterOption,
  VisualizationOption,
  CustomReport
} from '@/lib/services/reportsService';

// Re-export types
export {
  ReportCategory,
  SavedReport,
  QuickStat,
  RevenueData,
  RevenueReportData,
  MetricOption,
  FilterOption,
  VisualizationOption,
  CustomReport
};

// Re-export functions with same API signature
export const getReportCategories = reportsService.getReportCategories;
export const getQuickStats = reportsService.getQuickStats;
export const getSavedReports = reportsService.getSavedReports;
export const getInventoryValueReport = reportsService.getInventoryValueReport;
export const getInventoryMovementReport = reportsService.getInventoryMovementReport;
export const getLowStockReport = reportsService.getLowStockReport;
export const getExpiryReport = reportsService.getExpiryReport;
export const getMetricOptions = reportsService.getMetricOptions;
export const runCustomReport = reportsService.runCustomReport;
export const saveCustomReport = reportsService.saveCustomReport;
export const scheduleReport = reportsService.scheduleReport;
export const exportReport = reportsService.exportReport;

// Get revenue report - this may have a different signature
export const getRevenueReport = async (
  dateRange: { startDate: string; endDate: string },
  groupBy: string = 'day'
) => {
  // Using the template-based report generator with appropriate parameters
  return reportsService.generateReportFromTemplate('revenue-report', {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    filter: { groupBy }
  });
};

// Get customer purchase analysis
export const getCustomerPurchaseAnalysis = async (
  dateRange: { startDate: string; endDate: string },
  customerId?: string
) => {
  return reportsService.generateCustomerReport({
    reportType: 'purchase-analysis',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    filter: customerId ? { customerId } : {}
  });
};

// Get customer ranking report
export const getCustomerRankingReport = async (
  dateRange: { startDate: string; endDate: string },
  metric: 'revenue' | 'frequency' = 'revenue',
  limit: number = 10
) => {
  return reportsService.generateCustomerReport({
    reportType: 'customer-ranking',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    filter: { metric, limit }
  });
};
