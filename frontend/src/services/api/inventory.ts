// This file provides backward compatibility for components still importing from @/services/api/inventory
// It re-exports the services from @/lib/services/inventoryService

import { inventoryService } from '@/lib/services/inventoryService';
import { InventoryFilters } from '@/types/inventory';
import { PaginatedResponse } from '@/types/common';

export const inventoryApi = {
  // Get all inventory items with filters
  getInventoryItems: async (filters = {}) => {
    const data = await inventoryService.getInventoryItems(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single inventory item
  getInventoryItem: async (id) => {
    return inventoryService.getInventoryItem(id);
  },

  // Stock adjustments
  createStockAdjustment: async (adjustmentData) => {
    return inventoryService.adjustStock(adjustmentData);
  },

  // Stock transfers
  createStockTransfer: async (transferData) => {
    return inventoryService.transferStock(transferData);
  },

  // Inventory history
  getInventoryTransactions: async (params = {}) => {
    const data = await inventoryService.getInventoryTransactions(params);
    return { data: data.items || [], meta: data.meta };
  },

  // Low stock items
  getLowStockItems: async (params = {}) => {
    const data = await inventoryService.getLowStockItems(params);
    return { data: data.items || [], meta: data.meta };
  }
};
