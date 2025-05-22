import { apiClient } from '../client';

export interface DashboardStats {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    previousPeriod: {
      value: number;
      percentage: number;
    };
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    previousPeriod: {
      value: number;
      percentage: number;
    };
  };
  customers: {
    total: number;
    new: number;
    previousPeriod: {
      value: number;
      percentage: number;
    };
  };
  inventory: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'inventory' | 'customer' | 'transaction' | 'warranty';
  title: string;
  description: string;
  time: string; // ISO date string
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  link: string;
}

export interface SalesData {
  labels: string[];
  data: number[];
}

export interface ProductCategoryData {
  labels: string[];
  data: number[];
}

export interface InventoryStatusData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return await apiClient.get('/reports/dashboard/stats');
  },
  
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    return await apiClient.get(`/reports/dashboard/activity?limit=${limit}`);
  },
  
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<SalesData> => {
    return await apiClient.get(`/reports/dashboard/sales?period=${period}`);
  },
  
  getProductCategoryDistribution: async (): Promise<ProductCategoryData> => {
    return await apiClient.get('/reports/dashboard/categories');
  },
  
  getInventoryStatus: async (): Promise<InventoryStatusData> => {
    return await apiClient.get('/reports/dashboard/inventory-status');
  }
};
