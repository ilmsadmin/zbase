"use client";

import { apiClient } from '../api-client';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  type: 'ZONE' | 'AISLE' | 'RACK' | 'SHELF' | 'BIN';
  parentId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseStats {
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
}

export interface WarehouseQueryParams {
  search?: string;
  isActive?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface LocationQueryParams {
  warehouseId: string;
  type?: 'ZONE' | 'AISLE' | 'RACK' | 'SHELF' | 'BIN';
  parentId?: string;
  search?: string;
}

// Warehouses API service
export const warehousesService = {
  /**
   * Get all warehouses with optional filtering
   */
  getWarehouses: async (params?: WarehouseQueryParams) => {
    return apiClient.get('/api/warehouses', { params });
  },

  /**
   * Get warehouse by ID
   */
  getWarehouseById: async (id: string) => {
    return apiClient.get(`/api/warehouses/${id}`);
  },

  /**
   * Create new warehouse
   */
  createWarehouse: async (data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiClient.post('/api/warehouses', data);
  },

  /**
   * Update warehouse
   */
  updateWarehouse: async (id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return apiClient.patch(`/api/warehouses/${id}`, data);
  },

  /**
   * Delete warehouse
   */
  deleteWarehouse: async (id: string) => {
    return apiClient.delete(`/api/warehouses/${id}`);
  },

  /**
   * Get warehouse stats
   */  getWarehouseStats: async (id: string) => {
    return apiClient.get(`/api/warehouses/${id}/stats`);
  },

  /**
   * Get warehouse locations
   */  getLocations: async (params: LocationQueryParams) => {
    return apiClient.get('/api/warehouse-locations', { params });
  },

  /**
   * Get location by ID
   */  getLocationById: async (id: string) => {
    return apiClient.get(`/api/warehouse-locations/${id}`);
  },

  /**
   * Create new location
   */  createLocation: async (data: Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiClient.post('/api/warehouse-locations', data);
  },

  /**
   * Update location
   */  updateLocation: async (id: string, data: Partial<Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return apiClient.patch(`/api/warehouse-locations/${id}`, data);
  },

  /**
   * Delete location
   */  deleteLocation: async (id: string) => {
    return apiClient.delete(`/api/warehouse-locations/${id}`);
  },

  /**
   * Get inventory summary by warehouse
   */  getInventorySummary: async (id: string) => {
    return apiClient.get(`/api/warehouses/${id}/inventory`);
  }
};
