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

// Inventory API service
export const inventoryService = {
  /**
   * Get inventory items with optional filtering
   */
  getInventoryItems: async (params?: InventoryQueryParams) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  /**
   * Get inventory item for a specific product and warehouse
   */
  getInventoryItem: async (productId: string, warehouseId: string) => {
    const response = await api.get(`/inventory/product/${productId}/warehouse/${warehouseId}`);
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
    const response = await api.get('/inventory/transactions', { params });
    return response.data;
  },

  /**
   * Create an inventory transaction
   */
  createInventoryTransaction: async (data: InventoryTransactionCreate) => {
    const response = await api.post('/inventory/transactions', data);
    return response.data;
  },

  /**
   * Adjust stock quantity
   */
  adjustStock: async (data: {
    productId: string;
    warehouseId: string;
    locationId?: string;
    quantity: number;
    reason?: string;
    notes?: string;
  }) => {
    const response = await api.post('/inventory/adjust', data);
    return response.data;
  },

  /**
   * Transfer stock between warehouses or locations
   */
  transferStock: async (data: InventoryTransferData) => {
    const response = await api.post('/inventory/transfer', data);
    return response.data;
  },

  /**
   * Get low stock items
   */
  getLowStockItems: async (params?: { warehouseId?: string; limit?: number }) => {
    const response = await api.get('/inventory/low-stock', { params });
    return response.data;
  },

  /**
   * Perform inventory count
   */
  performInventoryCount: async (data: {
    warehouseId: string;
    locationId?: string;
    items: { productId: string; countedQuantity: number }[];
    notes?: string;
  }) => {
    const response = await api.post('/inventory/count', data);
    return response.data;
  },

  /**
   * Get inventory counts history
   */
  getInventoryCounts: async (params?: {
    warehouseId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/inventory/counts', { params });
    return response.data;
  },

  /**
   * Get stock movement history for a product
   */
  getProductStockMovement: async (productId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get(`/inventory/product/${productId}/movement`, { params });
    return response.data;
  },
};
