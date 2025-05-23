import { apiClient } from '@/lib/api-client';
import { Warehouse, WarehouseLocation } from '@/types/warehouse';
import { PaginatedResponse } from '@/types/common';

export const warehousesApi = {
  // Warehouses
  getWarehouses: (params?: { isActive?: boolean; search?: string }): Promise<Warehouse[]> =>
    apiClient.get('/warehouses', { params }),

  getWarehouse: (id: string): Promise<Warehouse> =>
    apiClient.get(`/warehouses/${id}`),

  createWarehouse: (data: { 
    name: string; 
    code: string; 
    address: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    managerId?: string;
    isActive?: boolean;
  }): Promise<Warehouse> =>
    apiClient.post('/warehouses', data),

  updateWarehouse: (id: string, data: Partial<Warehouse>): Promise<Warehouse> =>
    apiClient.put(`/warehouses/${id}`, data),

  deleteWarehouse: (id: string): Promise<void> =>
    apiClient.delete(`/warehouses/${id}`),

  // Warehouse Locations
  getWarehouseLocations: (warehouseId: string): Promise<WarehouseLocation[]> =>
    apiClient.get(`/warehouse-locations?warehouseId=${warehouseId}`),

  getWarehouseLocation: (id: string): Promise<WarehouseLocation> =>
    apiClient.get(`/warehouse-locations/${id}`),

  createWarehouseLocation: (data: {
    warehouseId: string;
    name: string;
    code: string;
    type: 'ZONE' | 'AISLE' | 'RACK' | 'SHELF' | 'BIN';
    parentId?: string;
  }): Promise<WarehouseLocation> =>
    apiClient.post('/warehouse-locations', data),

  updateWarehouseLocation: (id: string, data: Partial<Omit<WarehouseLocation, 'id' | 'warehouseId'>>): Promise<WarehouseLocation> =>
    apiClient.put(`/warehouse-locations/${id}`, data),

  deleteWarehouseLocation: (id: string): Promise<void> =>
    apiClient.delete(`/warehouse-locations/${id}`),
};
