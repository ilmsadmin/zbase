import api from '../api';

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  locationId?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastCountDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN';
  productId: string;
  warehouseId: string;
  locationId?: string;
  quantity: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  performedBy: string;
  createdAt: string;
}

export interface InventoryTransactionCreate {
  type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN';
  productId: string;
  warehouseId: string;
  locationId?: string;
  quantity: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

export interface InventoryTransferData {
  productId: string;
  quantity: number;
  sourceWarehouseId: string;
  sourceLocationId?: string;
  destinationWarehouseId: string;
  destinationLocationId?: string;
  notes?: string;
}

export interface InventoryQueryParams {
  warehouseId?: string;
  locationId?: string;
  productId?: string;
  lowStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Thêm interfaces từ src/services/inventory.ts
export interface StockAdjustment {
  productId: string;
  warehouseId: string;
  locationId?: string;
  quantity: number;
  adjustmentType: 'INCREMENT' | 'DECREMENT' | 'SET';
  reason: string;
  notes?: string;
}

export interface StockTransfer {
  productId: string;
  sourceWarehouseId: string;
  sourceLocationId?: string;
  destinationWarehouseId: string;
  destinationLocationId?: string;
  quantity: number;
  notes?: string;
}

export interface InventoryFilters {
  warehouseId?: string;
  productId?: string;
  locationId?: string;
  lowStock?: boolean;
}

// Inventory API service
export const inventoryService = {
  /**
   * Get inventory items
   */  getInventoryItems: async (params?: InventoryQueryParams) => {
    const response = await api.get('inventory', { params });
    return response.data;
  },

  /**
   * Get a single inventory item
   */
  getInventoryItem: async (id: string) => {
    const response = await api.get(`inventory/${id}`);
    return response.data;
  },

  /**
   * Get inventory for a product across warehouses
   */
  getProductInventory: async (productId: string) => {
    const response = await api.get(`inventory/product/${productId}`);
    return response.data;
  },

  /**
   * Get warehouse inventory
   */
  getWarehouseInventory: async (warehouseId: string, params?: InventoryQueryParams) => {
    const requestParams = { ...params, warehouseId };
    const response = await api.get('inventory', { params: requestParams });
    return response.data;
  },
  /**
   * Create a stock adjustment
   */
  createStockAdjustment: async (adjustment: StockAdjustment) => {
    const response = await api.post('inventory/adjust', adjustment);
    return response.data;
  },

  /**
   * Create a stock transfer
   */
  createStockTransfer: async (transfer: StockTransfer) => {
    const response = await api.post('inventory/transfer', transfer);
    return response.data;
  },

  /**
   * Get inventory transactions
   */
  getInventoryTransactions: async (params?: {
    productId?: string;
    warehouseId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('inventory/transactions', { params });
    return response.data;
  },

  /**
   * Get a single inventory transaction
   */
  getInventoryTransaction: async (id: string) => {
    const response = await api.get(`inventory/transactions/${id}`);
    return response.data;
  },

  /**
   * Get low stock items
   */
  getLowStockItems: async (params?: { warehouseId?: string; limit?: number }) => {
    const response = await api.get('inventory/low-stock', { params });
    return response.data;
  },

  /**
   * Export inventory report
   */
  exportInventoryReport: async (params?: InventoryQueryParams) => {
    const response = await api.get('inventory/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
