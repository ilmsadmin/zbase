import api from '../api';

export interface Shift {
  id: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: number;
  closingBalance?: number;
  expectedClosingBalance?: number;
  cashVariance?: number;
  status: 'OPEN' | 'CLOSED';
  warehouseId: string;
  openedBy: string;
  closedBy?: string;
  notes?: string;
  salesCount?: number;
  totalSales?: number;
}

export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  imageUrl?: string;
  availableQuantity: number;
  categoryId?: string;
  categoryName?: string;
}

export interface PosSale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  status: 'COMPLETED' | 'CANCELLED' | 'HELD';
  total: number;
  amountPaid: number;
  change?: number;
  paymentMethod: string;
  shiftId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
  }[];
}

export interface PosTransaction {
  id: string;
  type: 'CASH_IN' | 'CASH_OUT' | 'SALE' | 'REFUND';
  amount: number;
  referenceId?: string;
  referenceType?: string;
  shiftId: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

// POS API service
export const posService = {
  /**
   * Open a new shift
   */
  openShift: async (data: { 
    openingBalance: number;
    warehouseId: string;
    notes?: string;
  }) => {
    const response = await api.post('/shifts', data);
    return response.data;
  },

  /**
   * Get current active shift (if any)
   */
  getCurrentShift: async () => {
    const response = await api.get('/shifts/current');
    return response.data;
  },

  /**
   * Close the current shift
   */
  closeShift: async (id: string, data: {
    closingBalance: number;
    notes?: string;
  }) => {
    const response = await api.post(`/shifts/${id}/close`, data);
    return response.data;
  },

  /**
   * Get shift by ID
   */
  getShiftById: async (id: string) => {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  /**
   * Get shift transactions
   */
  getShiftTransactions: async (shiftId: string) => {
    const response = await api.get(`/shifts/${shiftId}/transactions`);
    return response.data;
  },

  /**
   * Add cash transaction to shift
   */
  addCashTransaction: async (shiftId: string, data: {
    type: 'CASH_IN' | 'CASH_OUT';
    amount: number;
    notes?: string;
  }) => {
    const response = await api.post(`/shifts/${shiftId}/transactions`, data);
    return response.data;
  },

  /**
   * Get shifts history
   */
  getShiftsHistory: async (params?: { 
    startDate?: string; 
    endDate?: string; 
    userId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/shifts', { params });
    return response.data;
  },

  /**
   * Search products for POS
   */
  searchPosProducts: async (params: { 
    query?: string; 
    barcode?: string; 
    categoryId?: string;
    warehouseId: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/pos/products', { params });
    return response.data;
  },

  /**
   * Get product categories for POS
   */
  getPosCategories: async () => {
    const response = await api.get('/pos/product-categories');
    return response.data;
  },

  /**
   * Create a POS sale (quick sale)
   */
  createPosSale: async (data: {
    customerId?: string;
    items: { productId: string; quantity: number; price: number; discount?: number; }[];
    payments: { method: string; amount: number; referenceNumber?: string; }[];
    discountTotal?: number;
    notes?: string;
  }) => {
    const response = await api.post('/pos/sales', data);
    return response.data;
  },

  /**
   * Get POS sales
   */
  getPosSales: async (params?: {
    shiftId?: string;
    startDate?: string;
    endDate?: string;
    status?: 'COMPLETED' | 'CANCELLED' | 'HELD';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/pos/sales', { params });
    return response.data;
  },

  /**
   * Get POS sale by ID
   */
  getPosSaleById: async (id: string) => {
    const response = await api.get(`/pos/sales/${id}`);
    return response.data;
  },

  /**
   * Cancel a POS sale
   */
  cancelPosSale: async (id: string, reason?: string) => {
    const response = await api.post(`/pos/sales/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Hold a sale for later
   */
  holdSale: async (data: {
    customerId?: string;
    items: { productId: string; quantity: number; price: number; discount?: number; }[];
    notes?: string;
  }) => {
    const response = await api.post('/pos/hold-sales', data);
    return response.data;
  },

  /**
   * Get held sales
   */
  getHeldSales: async () => {
    const response = await api.get('/pos/hold-sales');
    return response.data;
  },

  /**
   * Get held sale by ID
   */
  getHeldSaleById: async (id: string) => {
    const response = await api.get(`/pos/hold-sales/${id}`);
    return response.data;
  },

  /**
   * Delete held sale
   */
  deleteHeldSale: async (id: string) => {
    const response = await api.delete(`/pos/hold-sales/${id}`);
    return response.data;
  },

  /**
   * Print receipt
   */
  printReceipt: async (saleId: string) => {
    const response = await api.get(`/pos/sales/${saleId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get sales summary
   */
  getSalesSummary: async (params: {
    shiftId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/pos/sales/summary', { params });
    return response.data;
  },
};
