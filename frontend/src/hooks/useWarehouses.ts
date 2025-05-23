"use client";

import { useQueryWithErrorHandling, useMutationWithErrorHandling } from '@/lib/react-query/hooks';
import { 
  Warehouse, 
  WarehouseLocation, 
  WarehouseQueryParams, 
  LocationQueryParams,
  warehousesService 
} from '@/lib/services/warehousesService';

/**
 * Hook to get warehouses with optional filtering
 */
export function useWarehouses(params?: WarehouseQueryParams) {
  return useQueryWithErrorHandling(
    ['warehouses', params],
    () => warehousesService.getWarehouses(params),
    {
      placeholderData: (previousData) => previousData,
    }
  );
}

/**
 * Hook to get a warehouse by ID
 */
export function useWarehouse(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['warehouse', id],
    () => warehousesService.getWarehouseById(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to get warehouse stats
 */
export function useWarehouseStats(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['warehouse-stats', id],
    () => warehousesService.getWarehouseStats(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to create a new warehouse
 */
export function useCreateWarehouse() {
  return useMutationWithErrorHandling(
    (newWarehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => 
      warehousesService.createWarehouse(newWarehouse)
  );
}

/**
 * Hook to update a warehouse
 */
export function useUpdateWarehouse() {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: string; data: Partial<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      warehousesService.updateWarehouse(id, data)
  );
}

/**
 * Hook to delete a warehouse
 */
export function useDeleteWarehouse() {
  return useMutationWithErrorHandling(
    (id: string) => warehousesService.deleteWarehouse(id)
  );
}

/**
 * Hook to get inventory summary for a warehouse
 */
export function useWarehouseInventory(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['warehouse-inventory', id],
    () => warehousesService.getInventorySummary(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to get warehouse locations
 */
export function useWarehouseLocations(params: LocationQueryParams | undefined) {
  return useQueryWithErrorHandling(
    ['warehouse-locations', params],
    () => warehousesService.getLocations(params!),
    {
      enabled: !!params?.warehouseId,
      placeholderData: (previousData) => previousData,
    }
  );
}

/**
 * Hook to get a location by ID
 */
export function useWarehouseLocation(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['warehouse-location', id],
    () => warehousesService.getLocationById(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to create a new location
 */
export function useCreateLocation() {
  return useMutationWithErrorHandling(
    (newLocation: Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>) => 
      warehousesService.createLocation(newLocation)
  );
}

/**
 * Hook to update a location
 */
export function useUpdateLocation() {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: string; data: Partial<Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      warehousesService.updateLocation(id, data)
  );
}

/**
 * Hook to delete a location
 */
export function useDeleteLocation() {
  return useMutationWithErrorHandling(
    (id: string) => warehousesService.deleteLocation(id)
  );
}
