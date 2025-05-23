import { apiClient } from '@/lib/api-client';
import { InventoryItem, InventoryTransaction, StockAdjustment, StockTransfer, InventoryFilters } from '@/types/inventory';
import { PaginatedResponse } from '@/types/common';

export const inventoryApi = {
  // Inventory Items
  getInventoryItems: (params?: InventoryFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<InventoryItem>> =>
    apiClient.get('/inventory', { params }),

  getInventoryItem: (id: string): Promise<InventoryItem> =>
    apiClient.get(`/inventory/${id}`),

  // Stock adjustments
  createStockAdjustment: (data: StockAdjustment): Promise<InventoryTransaction> =>
    apiClient.post('/inventory/adjust', data),

  // Stock transfers
  createStockTransfer: (data: StockTransfer): Promise<InventoryTransaction> =>
    apiClient.post('/inventory/transfer', data),

  // Inventory history
  getInventoryTransactions: (params?: { 
    productId?: string; 
    warehouseId?: string; 
    type?: string; 
    startDate?: string; 
    endDate?: string;
    page?: number; 
    limit?: number 
  }): Promise<PaginatedResponse<InventoryTransaction>> =>
    apiClient.get('/inventory/transactions', { params }),

  getInventoryTransaction: (id: string): Promise<InventoryTransaction> =>
    apiClient.get(`/inventory/transactions/${id}`),
};
