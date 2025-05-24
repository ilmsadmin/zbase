import api from '../api';

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  reportType: string;
  configuration: Record<string, unknown>;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportQueryParams {
  reportType: string;
  startDate: string;
  endDate: string;
  interval?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  groupBy?: string;
  filter?: Record<string, unknown>;
}

// Additional interfaces from services/reports.ts
export interface ReportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  category: string;
  lastRun: string;
  createdAt: string;
  parameters: Record<string, any>;
}

export interface QuickStat {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  direction: 'up' | 'down' | 'neutral';
}

export interface RevenueData {
  date: string;
  amount: number;
  transactionCount: number;
}

export interface RevenueReportData {
  revenues: RevenueData[];
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
}

export interface MetricOption {
  id: string;
  name: string;
  category: string;
  dataType: 'number' | 'currency' | 'percentage' | 'date' | 'string';
}

export interface FilterOption {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'between';
  value: any;
  secondValue?: any;
}

export interface VisualizationOption {
  type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  colors?: string[];
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  filters: FilterOption[];
  visualization: VisualizationOption;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    recipients: string[];
  };
}

// Reports API service
export const reportsService = {
  /**
   * Generate a sales report
   */
  generateSalesReport: async (params: ReportQueryParams) => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },

  /**
   * Generate an inventory report
   */
  generateInventoryReport: async (params: ReportQueryParams) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },

  /**
   * Generate a customer report
   */
  generateCustomerReport: async (params: ReportQueryParams) => {
    const response = await api.get('/reports/customers', { params });
    return response.data;
  },

  /**
   * Generate a financial report
   */
  generateFinancialReport: async (params: ReportQueryParams) => {
    const response = await api.get('/reports/financial', { params });
    return response.data;
  },

  /**
   * Generate a product performance report
   */
  generateProductReport: async (params: ReportQueryParams) => {
    const response = await api.get('/reports/products', { params });
    return response.data;
  },
  
  /**
   * Get sales analytics data
   */
  getSalesAnalytics: async (params: {
    startDate: string;
    endDate: string;
    interval?: 'day' | 'week' | 'month';
  }) => {
    const response = await api.get('/reports/analytics/sales', { params });
    return response.data;
  },

  /**
   * Get report templates
   */
  getReportTemplates: async (reportType?: string) => {
    const response = await api.get('/report-templates', { params: { reportType } });
    return response.data;
  },

  /**
   * Get report template by ID
   */
  getReportTemplateById: async (id: string) => {
    const response = await api.get(`/report-templates/${id}`);
    return response.data;
  },

  /**
   * Create report template
   */
  createReportTemplate: async (data: Omit<ReportTemplate, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/report-templates', data);
    return response.data;
  },

  /**
   * Update report template
   */
  updateReportTemplate: async (id: string, data: Partial<Omit<ReportTemplate, 'id' | 'isSystem' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/report-templates/${id}`, data);
    return response.data;
  },

  /**
   * Delete report template
   */
  deleteReportTemplate: async (id: string) => {
    const response = await api.delete(`/report-templates/${id}`);
    return response.data;
  },

  /**
   * Generate report from template
   */
  generateReportFromTemplate: async (
    templateId: string, 
    params: { startDate: string; endDate: string; filter?: Record<string, unknown>; }
  ) => {
    const response = await api.get(`/reports/templates/${templateId}`, { params });
    return response.data;
  },

  /**
   * Export report to PDF
   */
  exportReportToPdf: async (reportType: string, params: ReportQueryParams) => {
    const response = await api.get(`/reports/${reportType}/export/pdf`, { 
      params,
      responseType: 'blob' 
    });
    return response.data;
  },

  /**
   * Export report to Excel
   */  exportReportToExcel: async (reportType: string, params: ReportQueryParams) => {
    const response = await api.get(`/reports/${reportType}/export/excel`, { 
      params,
      responseType: 'blob' 
    });
    return response.data;
  },

  // Additional methods migrated from services/reports.ts
  /**
   * Get report categories
   */
  getReportCategories: async () => {
    const response = await api.get('/reports/categories');
    return response.data;
  },

  /**
   * Get quick statistics
   */
  getQuickStats: async () => {
    const response = await api.get('/reports/quick-stats');
    return response.data;
  },

  /**
   * Get saved reports
   */
  getSavedReports: async () => {
    const response = await api.get('/reports/saved');
    return response.data;
  },
  /**
   * Get inventory value report
   */
  getInventoryValueReport: async () => {
    try {
      const response = await api.get('/reports/inventory/value');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory value report:', error);
      // Return empty data structure that matches expected format
      return {
        totalValue: 0,
        warehouseValues: [],
        categoryValues: []
      };
    }
  },

  /**
   * Get inventory movement report
   */
  getInventoryMovementReport: async (
    dateRange: { startDate: string; endDate: string },
    warehouseId?: string
  ) => {
    const response = await api.get('/reports/inventory/movement', {
      params: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        warehouseId
      }
    });
    return response.data;
  },

  /**
   * Get low stock report
   */
  getLowStockReport: async (warehouseId?: string) => {
    const response = await api.get('/reports/inventory/low-stock', {
      params: { warehouseId }
    });
    return response.data;
  },

  /**
   * Get expiry report
   */
  getExpiryReport: async (
    daysThreshold: number = 30,
    warehouseId?: string
  ) => {
    const response = await api.get('/reports/inventory/expiry', {
      params: {
        daysThreshold,
        warehouseId
      }
    });
    return response.data;
  },

  /**
   * Get metric options for custom reports
   */
  getMetricOptions: async () => {
    const response = await api.get('/reports/builder/metrics');
    return response.data;
  },

  /**
   * Run a custom report
   */
  runCustomReport: async (
    metrics: string[],
    filters: FilterOption[],
    visualization: VisualizationOption
  ) => {
    const response = await api.post('/reports/builder/run', {
      metrics,
      filters,
      visualization
    });
    return response.data;
  },

  /**
   * Save a custom report
   */
  saveCustomReport: async (report: Omit<CustomReport, 'id'>) => {
    const response = await api.post('/reports/builder/save', report);
    return response.data;
  },

  /**
   * Schedule a report
   */
  scheduleReport: async (
    reportId: string,
    schedule: CustomReport['schedule']
  ) => {
    const response = await api.post(`/reports/builder/${reportId}/schedule`, { schedule });
    return response.data;
  },

  /**
   * Export a report in different formats
   */
  exportReport: async (
    reportType: string,
    parameters: Record<string, any>,
    format: 'pdf' | 'csv' | 'excel' = 'pdf'
  ) => {
    const response = await api.post(
      `/reports/export/${reportType}`,
      { parameters },
      { responseType: 'blob', params: { format } }
    );
    return response.data;
  }
};
