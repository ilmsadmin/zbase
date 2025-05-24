// This file provides backward compatibility for components still importing from @/services/api/warehouses
// It re-exports the services from @/lib/services/warehousesService

import { warehousesService } from '@/lib/services/warehousesService';

export const warehousesApi = {
  // Get all warehouses with filters
  getWarehouses: async (filters = {}) => {
    const data = await warehousesService.getWarehouses(filters);
    return data.items || [];
  },

  // Get a single warehouse by ID
  getWarehouse: async (id) => {
    return warehousesService.getWarehouseById(id);
  },

  // Create a new warehouse
  createWarehouse: async (warehouseData) => {
    return warehousesService.createWarehouse(warehouseData);
  },

  // Update an existing warehouse
  updateWarehouse: async (id, warehouseData) => {
    return warehousesService.updateWarehouse(id, warehouseData);
  },

  // Delete a warehouse
  deleteWarehouse: async (id) => {
    return warehousesService.deleteWarehouse(id);
  },

  // Get warehouse locations
  getLocations: async (warehouseId, params = {}) => {
    const data = await warehousesService.getLocations({ warehouseId, ...params });
    return data.items || [];
  },

  // Create a warehouse location
  createLocation: async (locationData) => {
    return warehousesService.createLocation(locationData);
  },

  // Update a warehouse location
  updateLocation: async (id, locationData) => {
    return warehousesService.updateLocation(id, locationData);
  },

  // Delete a warehouse location
  deleteLocation: async (id) => {
    return warehousesService.deleteLocation(id);
  },
  
  // Get warehouse stats
  getWarehouseStats: async (id) => {
    return warehousesService.getWarehouseStats(id);
  }
};
