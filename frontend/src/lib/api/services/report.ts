import { apiClient } from "../client";

// Define report types based on the API
export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  ACCOUNTS_RECEIVABLE = 'accounts_receivable',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Interface for a Report
export interface Report {
  id: string; // MongoDB _id
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  parameters: Record<string, any>;
  frequency: ReportFrequency;
  status: ReportStatus;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  lastGeneratedAt?: string;
  fileUrl?: string;
}

// Interface for Report Template
export interface ReportTemplate {
  id: string; // MongoDB _id
  name: string;
  description?: string;
  type: ReportType;
  defaultFormat: ReportFormat;
  parameters: Record<string, any>;
  isSystem: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// Filter interface for reports
export interface ReportFilter {
  type?: ReportType;
  status?: ReportStatus;
  frequency?: ReportFrequency;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Parameters for different report types
export interface SalesReportParams {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
  productId?: number;
  categoryId?: number;
  customerId?: number;
  customerGroupId?: number;
  includeRefunds?: boolean;
}

export interface InventoryReportParams {
  warehouseId?: number;
  productId?: number;
  categoryId?: number;
  belowThreshold?: boolean;
  asOfDate?: string;
  includeMovement?: boolean;
  movementStartDate?: string;
  movementEndDate?: string;
}

export interface AccountsReceivableParams {
  startDate?: string;
  endDate?: string;
  customerId?: number;
  customerGroupId?: number;
  agingPeriods?: number[];
  includeZeroBalance?: boolean;
}

// Service for reports
const reportService = {
  // Reports CRUD operations
  async getReports(filter?: ReportFilter): Promise<{ data: Report[]; total: number; page: number; limit: number }> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: '/reports',
      params: filter,
    });
    return response.data;
  },

  async getReportById(id: string): Promise<Report> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: `/reports/${id}`,
    });
    return response.data;
  },

  async createReport(reportData: Partial<Report>): Promise<Report> {
    const response = await apiClient.request({
      method: 'POST',
      endpoint: '/reports',
      data: reportData,
    });
    return response.data;
  },

  async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    const response = await apiClient.request({
      method: 'PATCH',
      endpoint: `/reports/${id}`,
      data: reportData,
    });
    return response.data;
  },

  async deleteReport(id: string): Promise<void> {
    await apiClient.request({
      method: 'DELETE',
      endpoint: `/reports/${id}`,
    });
  },

  async generateReport(id: string): Promise<{ fileUrl: string }> {
    const response = await apiClient.request({
      method: 'POST',
      endpoint: `/reports/${id}/generate`,
    });
    return response.data;
  },

  async downloadReport(id: string): Promise<Blob> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: `/reports/${id}/download`,
      responseType: 'blob',
    });
    return response.data;
  },

  // Report Templates
  async getReportTemplates(
    filter?: Partial<{ type: ReportType; search: string; page: number; limit: number }>
  ): Promise<{ data: ReportTemplate[]; total: number; page: number; limit: number }> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: '/report-templates',
      params: filter,
    });
    return response.data;
  },

  async getReportTemplateById(id: string): Promise<ReportTemplate> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: `/report-templates/${id}`,
    });
    return response.data;
  },

  // Get reports dashboard summary
  async getReportsSummary(): Promise<{
    recentReports: Report[];
    reportCounts: { [key in ReportType]: number };
  }> {
    const response = await apiClient.request({
      method: 'GET',
      endpoint: '/reports/summary',
    });
    return response.data;
  },

  // Get specific report data for direct visualization (no file generation)
  async getReportData(params: {
    type: ReportType;
    parameters: SalesReportParams | InventoryReportParams | AccountsReceivableParams;
  }): Promise<any> {
    const response = await apiClient.request({
      method: 'POST',
      endpoint: '/reports/data',
      data: params,
    });
    return response.data;
  },
};

export { reportService };
