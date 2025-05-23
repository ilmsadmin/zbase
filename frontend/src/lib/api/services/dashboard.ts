import { apiClient } from '../client';

export interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  lowStock: number;
}

export interface RecentSale {
  id: number;
  customer: string;
  email: string;
  date: string; // ISO date string
  amount: number;
  status: string;
  itemCount?: number; // Number of items in the invoice
}

export interface TopProduct {
  id: number;
  name: string;
  code: string;
  price: number;
  totalQuantity: number;
  totalRevenue: number;
  stockQuantity?: number; // Current stock quantity
}

export interface LowStockItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  code: string;
  category: string;
  warehouse: string;
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
  getStats: async (period: 'day' | 'week' | 'month' | 'year' = 'day'): Promise<DashboardStats> => {
    return await apiClient.get(`/reports/dashboard/stats?period=${period}`);
  },
  
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    return await apiClient.get(`/reports/dashboard/activity?limit=${limit}`);
  },
    getRecentSales: async (period: 'day' | 'week' | 'month' | 'year' = 'day'): Promise<RecentSale[]> => {
    return await apiClient.get(`/reports/dashboard/recent-sales?period=${period}`);
  },
  
  getTopProducts: async (period: 'day' | 'week' | 'month' | 'year' = 'day'): Promise<TopProduct[]> => {
    return await apiClient.get(`/reports/dashboard/top-products?period=${period}`);
  },
  
  getLowStockItems: async (threshold?: number): Promise<LowStockItem[]> => {
    const query = threshold ? `?threshold=${threshold}` : '';
    return await apiClient.get(`/reports/dashboard/low-stock${query}`);
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
