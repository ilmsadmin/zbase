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
   */
  exportReportToExcel: async (reportType: string, params: ReportQueryParams) => {
    const response = await api.get(`/reports/${reportType}/export/excel`, { 
      params,
      responseType: 'blob' 
    });
    return response.data;
  },
};
