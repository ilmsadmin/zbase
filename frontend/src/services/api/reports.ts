import axios from 'axios';

// Define interfaces for API responses
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

export interface InventoryValue {
  warehouseId: string;
  warehouseName: string;
  totalValue: number;
  itemCount: number;
}

export interface InventoryValueReport {
  totalValue: number;
  warehouseValues: InventoryValue[];
  categoryValues: {
    categoryId: string;
    categoryName: string;
    value: number;
    itemCount: number;
  }[];
}

export interface InventoryMovement {
  productId: string;
  productName: string;
  sku: string;
  startingStock: number;
  incomingStock: number;
  outgoingStock: number;
  adjustments: number;
  currentStock: number;
}

export interface LowStockItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  warehouseId: string;
  warehouseName: string;
}

export interface ExpiryItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  expiryDate: string;
  daysToExpiry: number;
  warehouseId: string;
  warehouseName: string;
}

export interface CustomerRanking {
  customerId: string;
  customerName: string;
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  lastPurchaseDate: string;
}

export interface CustomerPurchaseAnalysis {
  customerId: string;
  customerName: string;
  purchaseHistory: {
    date: string;
    amount: number;
    products: {
      productId: string;
      productName: string;
      quantity: number;
      amount: number;
    }[];
  }[];
  favoriteProducts: {
    productId: string;
    productName: string;
    purchaseCount: number;
    totalSpent: number;
  }[];
}

export interface CustomerDebt {
  customerId: string;
  customerName: string;
  totalDebt: number;
  dueAmount: number;
  overdueAmount: number;
  agingBuckets: {
    range: string;
    amount: number;
  }[];
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

// API Functions
const baseUrl = '/api/reports';

// Report Dashboard
export const getReportCategories = async (): Promise<ReportCategory[]> => {
  const { data } = await axios.get(`${baseUrl}/categories`);
  return data;
};

export const getQuickStats = async (): Promise<QuickStat[]> => {
  const { data } = await axios.get(`${baseUrl}/quick-stats`);
  return data;
};

export const getSavedReports = async (): Promise<SavedReport[]> => {
  const { data } = await axios.get(`${baseUrl}/saved`);
  return data;
};

// Revenue Reports
export const getRevenueReport = async (
  dateRange: { startDate: string; endDate: string },
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<RevenueReportData> => {
  const { data } = await axios.get(`${baseUrl}/revenue`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      groupBy
    }
  });
  return data;
};

// Inventory Reports
export const getInventoryValueReport = async (): Promise<InventoryValueReport> => {
  const { data } = await axios.get(`${baseUrl}/inventory/value`);
  return data;
};

export const getInventoryMovementReport = async (
  dateRange: { startDate: string; endDate: string },
  warehouseId?: string
): Promise<InventoryMovement[]> => {
  const { data } = await axios.get(`${baseUrl}/inventory/movement`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      warehouseId
    }
  });
  return data;
};

export const getLowStockReport = async (warehouseId?: string): Promise<LowStockItem[]> => {
  const { data } = await axios.get(`${baseUrl}/inventory/low-stock`, {
    params: { warehouseId }
  });
  return data;
};

export const getExpiryReport = async (
  daysThreshold: number = 30,
  warehouseId?: string
): Promise<ExpiryItem[]> => {
  const { data } = await axios.get(`${baseUrl}/inventory/expiry`, {
    params: {
      daysThreshold,
      warehouseId
    }
  });
  return data;
};

// Customer Reports
export const getCustomerRankingReport = async (
  dateRange: { startDate: string; endDate: string }
): Promise<CustomerRanking[]> => {
  const { data } = await axios.get(`${baseUrl}/customers/ranking`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  return data;
};

export const getCustomerPurchaseAnalysis = async (
  customerId: string,
  dateRange: { startDate: string; endDate: string }
): Promise<CustomerPurchaseAnalysis> => {
  const { data } = await axios.get(`${baseUrl}/customers/purchase-analysis/${customerId}`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  return data;
};

export const getCustomerDebtReport = async (): Promise<CustomerDebt[]> => {
  const { data } = await axios.get(`${baseUrl}/customers/debt`);
  return data;
};

// Custom Report Builder
export const getMetricOptions = async (): Promise<MetricOption[]> => {
  const { data } = await axios.get(`${baseUrl}/builder/metrics`);
  return data;
};

export const runCustomReport = async (
  metrics: string[],
  filters: FilterOption[],
  visualization: VisualizationOption
): Promise<any> => {
  const { data } = await axios.post(`${baseUrl}/builder/run`, {
    metrics,
    filters,
    visualization
  });
  return data;
};

export const saveCustomReport = async (report: Omit<CustomReport, 'id'>): Promise<CustomReport> => {
  const { data } = await axios.post(`${baseUrl}/builder/save`, report);
  return data;
};

export const scheduleReport = async (
  reportId: string,
  schedule: CustomReport['schedule']
): Promise<void> => {
  await axios.post(`${baseUrl}/builder/${reportId}/schedule`, { schedule });
};

// Export Reports
export const exportReport = async (
  reportType: string,
  parameters: Record<string, any>,
  format: 'pdf' | 'csv' | 'excel' = 'pdf'
): Promise<Blob> => {
  const { data } = await axios.post(
    `${baseUrl}/export/${reportType}`,
    { parameters },
    { responseType: 'blob', params: { format } }
  );
  return data;
};
