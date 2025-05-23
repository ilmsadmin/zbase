"use client";

import { useQueryWithErrorHandling, useMutationWithErrorHandling } from '@/lib/react-query/hooks';
import { 
  InventoryQueryParams, 
  InventoryTransactionCreate, 
  InventoryTransferData, 
  inventoryService
} from '@/lib/services/inventoryService';
import { QueryClient } from '@tanstack/react-query';

/**
 * Hook to get inventory items with optional filtering
 */
export function useInventoryItems(params?: InventoryQueryParams) {  return useQueryWithErrorHandling(
    ['inventory', params],
    () => inventoryService.getInventoryItems(params),
    {
      placeholderData: (previousData) => previousData, // This replaces keepPreviousData in React Query v5
    }
  );
}

/**
 * Hook to get inventory item for a specific product and warehouse
 */
export function useInventoryItem(productId: string, warehouseId: string) {
  return useQueryWithErrorHandling(
    ['inventory-item', productId, warehouseId],
    () => inventoryService.getInventoryItem(productId, warehouseId),
    {
      enabled: !!productId && !!warehouseId,
    }
  );
}

/**
 * Hook to get inventory transactions
 */
export function useInventoryTransactions(params?: {
  productId?: string;
  warehouseId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {  return useQueryWithErrorHandling(
    ['inventory-transactions', params],
    () => inventoryService.getInventoryTransactions(params),
    {
      placeholderData: (previousData) => previousData, // This replaces keepPreviousData in React Query v5
    }
  );
}

/**
 * Hook to create an inventory transaction with automatic cache invalidation
 */
export function useCreateInventoryTransaction() {
  const queryClient = new QueryClient();
  
  return useMutationWithErrorHandling(
    (data: InventoryTransactionCreate) => inventoryService.createInventoryTransaction(data),
    {
      onSuccess: () => {
        // Invalidate related queries to update the UI
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      },
    }
  );
}

/**
 * Hook to adjust stock quantity
 */
export function useAdjustStock() {
  const queryClient = new QueryClient();
  
  return useMutationWithErrorHandling(
    (data: {
      productId: string;
      warehouseId: string;
      locationId?: string;
      quantity: number;
      reason?: string;
      notes?: string;
    }) => inventoryService.adjustStock(data),
    {
      onSuccess: (_data, variables) => {
        // Invalidate specific inventory item
        queryClient.invalidateQueries({
          queryKey: ['inventory-item', variables.productId, variables.warehouseId]
        });
        
        // Invalidate general inventory queries
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      },
    }
  );
}

/**
 * Hook to transfer stock between warehouses or locations
 */
export function useTransferStock() {
  const queryClient = new QueryClient();
  
  return useMutationWithErrorHandling(
    (data: InventoryTransferData) => inventoryService.transferStock(data),
    {
      onSuccess: (_data, variables) => {
        // Invalidate specific inventory items for source and destination
        queryClient.invalidateQueries({
          queryKey: ['inventory-item', variables.productId, variables.sourceWarehouseId]
        });
        queryClient.invalidateQueries({
          queryKey: ['inventory-item', variables.productId, variables.destinationWarehouseId]
        });
        
        // Invalidate general inventory queries
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      },
    }
  );
}

/**
 * Hook to get low stock items
 */
export function useLowStockItems(warehouseId?: string) {
  return useQueryWithErrorHandling(
    ['inventory', 'low-stock', warehouseId],
    () => inventoryService.getLowStockItems({ warehouseId }),
    {
      // Refresh more frequently for low stock items
      staleTime: 1000 * 60 * 2, // 2 minutes
    }
  );
}
