import api from '../api';

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  ordersCount: number;
  ordersChange: number;
  customersCount: number;
  customersChange: number;
  lowStockCount: number;
  lowStockChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  quantitySold: number;
  revenue: number;
}

export interface RecentSale {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  amount: number;
  status: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  imageUrl: string | null;
  warehouseName: string;
}

// Dashboard API service
export const dashboardService = {  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (period: string = 'month') => {
    const response = await api.get('reports/dashboard/stats', { params: { period } });
    // Map the backend response to our interface format
    return {
      totalRevenue: response.data.revenue || 0,
      revenueChange: 0, // Not provided by the API, default to 0
      ordersCount: response.data.orders || 0,
      ordersChange: 0, // Not provided by the API, default to 0
      customersCount: response.data.customers || 0,
      customersChange: 0, // Not provided by the API, default to 0
      lowStockCount: response.data.lowStock || 0,
      lowStockChange: 0 // Not provided by the API, default to 0
    } as DashboardStats;
  },
  /**
   * Get revenue chart data
   */
  getRevenueData: async (params: {
    period: 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/reports/dashboard/sales-by-period', { params });
    return response.data.map((item: {label: string, value: number}) => ({
      date: item.label,
      revenue: item.value
    })) as RevenueData[];
  },
  /**
   * Get top selling products
   */
  getTopProducts: async (params: {
    limit?: number;
    period?: 'week' | 'month' | 'quarter' | 'year';
  } = {}) => {
    const response = await api.get('/reports/dashboard/top-products', { params });
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      sku: item.code || '',
      imageUrl: null,
      quantitySold: item.totalQuantity || 0,
      revenue: item.totalRevenue || 0
    })) as TopProduct[];
  },
  /**
   * Get recent sales
   */
  getRecentSales: async (params: {
    limit?: number;
  } = {}) => {
    const response = await api.get('/reports/dashboard/recent-sales', { params });
    return response.data.map((item: any) => ({
      id: item.id,
      invoiceNumber: item.id.substring(0, 8).toUpperCase(),
      date: item.date,
      customerName: item.customer,
      amount: item.amount,
      status: item.status
    })) as RecentSale[];
  },
  /**
   * Get low stock items
   */
  getLowStockItems: async (params: {
    limit?: number;
  } = {}) => {
    const response = await api.get('/reports/dashboard/low-stock', { params });
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      sku: item.code || '',
      currentStock: item.quantity || 0,
      minStockLevel: 10, // Default value since it's not returned from API
      imageUrl: null,
      warehouseName: item.warehouse || 'Main Warehouse'
    })) as LowStockItem[];
  },
};
