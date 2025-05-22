import { apiClient } from '../client';

export interface Warehouse {
  id: number;
  name: string;
  address?: string;
  managerId?: number;
  manager?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    locations: number;
    inventory: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseLocation {
  id: number;
  warehouseId: number;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  position: string;
  description?: string;
  status: string;
  maxCapacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseDto {
  name: string;
  address?: string;
  managerId?: number;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}

export interface CreateWarehouseLocationDto {
  warehouseId: number;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  position: string;
  description?: string;
  status?: string;
  maxCapacity?: number;
}

export interface UpdateWarehouseLocationDto extends Partial<CreateWarehouseLocationDto> {}

export const warehouseService = {
  // Warehouse operations
  getAllWarehouses: async (): Promise<Warehouse[]> => {
    return await apiClient.get('/warehouses');
  },
  
  getWarehouseById: async (id: number): Promise<Warehouse> => {
    return await apiClient.get(`/warehouses/${id}`);
  },
  
  createWarehouse: async (data: CreateWarehouseDto): Promise<Warehouse> => {
    return await apiClient.post('/warehouses', data);
  },
  
  updateWarehouse: async (id: number, data: UpdateWarehouseDto): Promise<Warehouse> => {
    return await apiClient.patch(`/warehouses/${id}`, data);
  },
  
  deleteWarehouse: async (id: number): Promise<void> => {
    return await apiClient.delete(`/warehouses/${id}`);
  },
  
  // Warehouse Location operations
  getAllLocations: async (warehouseId?: number): Promise<WarehouseLocation[]> => {
    const endpoint = warehouseId 
      ? `/warehouse-locations?warehouseId=${warehouseId}`
      : '/warehouse-locations';
    return await apiClient.get(endpoint);
  },
  
  getLocationById: async (id: number): Promise<WarehouseLocation> => {
    return await apiClient.get(`/warehouse-locations/${id}`);
  },
  
  createLocation: async (data: CreateWarehouseLocationDto): Promise<WarehouseLocation> => {
    return await apiClient.post('/warehouse-locations', data);
  },
  
  updateLocation: async (id: number, data: UpdateWarehouseLocationDto): Promise<WarehouseLocation> => {
    return await apiClient.patch(`/warehouse-locations/${id}`, data);
  },
  
  deleteLocation: async (id: number): Promise<void> => {
    return await apiClient.delete(`/warehouse-locations/${id}`);
  }
};
