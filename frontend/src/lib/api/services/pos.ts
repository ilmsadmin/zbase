import { apiClient } from '../client';

export interface POSShiftStatus {
  hasActiveShift: boolean;
  message?: string;
  shiftData?: any;
}

export interface POSDashboardData {
  shiftId: number;
  warehouseId: number;
  userId: number;
  date: Date;
  totalSales: number;
  totalInvoices: number;
  pendingInvoices: number;
  cashReceived: number;
  cardReceived: number;
  topSellingProducts: any[];
}

export interface SalesPagination {
  items: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductSearchResult {
  items: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CustomerSearchResult {
  items: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryCheckItem {
  productId: number;
  quantity: number;
}

export interface InventoryCheckDto {
  warehouseId: number;
  items: InventoryCheckItem[];
}

export interface InventoryCheckResult {
  warehouseId: number;
  warehouseName: string;
  items: any[];
  allItemsAvailable: boolean;
}

export interface QuickSaleItem {
  productId: number;
  quantity: number;
  unitPrice?: number;
}

export interface CreateQuickSaleDto {
  customerId?: number;
  items: QuickSaleItem[];
  taxRate?: number;
  discountAmount?: number;
  paymentMethod: 'cash' | 'card';
  notes?: string;
}

export const posService = {
  // Check if the current user has an active shift
  checkActiveShift: async (): Promise<POSShiftStatus> => {
    return await apiClient.get('/pos/check-shift');
  },
  
  // Create a quick sale (POS transaction)
  createQuickSale: async (data: CreateQuickSaleDto): Promise<any> => {
    return await apiClient.post('/pos/quick-sale', data);
  },
  
  // Check if items are available in inventory
  checkInventory: async (data: InventoryCheckDto): Promise<InventoryCheckResult> => {
    return await apiClient.post('/pos/check-inventory', data);
  },
  
  // Get dashboard data for the active shift
  getDashboardData: async (): Promise<POSDashboardData> => {
    return await apiClient.get('/pos/dashboard');
  },
  
  // Get recent sales for the active shift
  getRecentSales: async (page: number = 1, limit: number = 10): Promise<SalesPagination> => {
    return await apiClient.get(`/pos/recent-sales?page=${page}&limit=${limit}`);
  },
  
  // Search for products
  searchProducts: async (query: string, warehouseId: number, page: number = 1, limit: number = 20): Promise<ProductSearchResult> => {
    return await apiClient.get(`/pos/product-search?query=${encodeURIComponent(query)}&warehouseId=${warehouseId}&page=${page}&limit=${limit}`);
  },
  
  // Search for customers
  searchCustomers: async (query: string, page: number = 1, limit: number = 20): Promise<CustomerSearchResult> => {
    return await apiClient.get(`/pos/customer-search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }
};
