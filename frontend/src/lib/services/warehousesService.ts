"use client";

import api from '../api';

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
   */  getWarehouses: async (params?: WarehouseQueryParams) => {
    const response = await api.get('/warehouses', { params });
    return response.data;
  },
  /**
   * Get warehouse by ID
   */
  getWarehouseById: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/warehouses/${numericId}`);
    return response.data;
  },
  /**
   * Create new warehouse
   */
  createWarehouse: async (data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },
  /**
   * Update warehouse
   */
  updateWarehouse: async (id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>>) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.patch(`/warehouses/${numericId}`, data);
    return response.data;
  },
  /**
   * Delete warehouse
   */
  deleteWarehouse: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.delete(`/warehouses/${numericId}`);
    return response.data;
  },  /**
   * Get warehouse stats
   */  getWarehouseStats: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/warehouses/${numericId}/stats`);
    return response.data;
  },

  /**
   * Get warehouse locations
   */  getLocations: async (params: LocationQueryParams) => {
    const response = await api.get('/warehouse-locations', { params });
    return response.data;
  },  /**
   * Get location by ID
   */  getLocationById: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/warehouse-locations/${numericId}`);
    return response.data;
  },

  /**
   * Create new location
   */  createLocation: async (data: Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/warehouse-locations', data);
    return response.data;
  },
  /**
   * Update location
   */  updateLocation: async (id: string, data: Partial<Omit<WarehouseLocation, 'id' | 'createdAt' | 'updatedAt'>>) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.patch(`/warehouse-locations/${numericId}`, data);
    return response.data;
  },
  /**
   * Delete location
   */  deleteLocation: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.delete(`/warehouse-locations/${numericId}`);
    return response.data;
  },

  /**
   * Get inventory summary by warehouse
   */  getInventorySummary: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/warehouses/${numericId}/inventory`);
    return response.data;
  }
};
