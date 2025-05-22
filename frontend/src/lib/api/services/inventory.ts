import { apiClient } from '../client';

export interface Inventory {
  id: number;
  productId: number;
  warehouseId: number;
  locationId?: number;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  product?: {
    id: number;
    code: string;
    name: string;
    description?: string;
    basePrice: number;
    unit?: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
  location?: {
    id: number;
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    position: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: number;
  productId: number;
  warehouseId: number;
  locationId?: number;
  transactionType: string; // 'in', 'out', 'transfer', 'adjustment'
  quantity: number;
  referenceType?: string; // 'order', 'return', 'internal', etc.
  referenceId?: number;
  userId?: number;
  notes?: string;
  product?: {
    id: number;
    code: string;
    name: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
  location?: {
    id: number;
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    position: string;
  };
  user?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface CreateInventoryDto {
  productId: number;
  warehouseId: number;
  locationId?: number;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
}

export interface UpdateInventoryDto extends Partial<CreateInventoryDto> {}

export interface CreateInventoryTransactionDto {
  productId: number;
  warehouseId: number;
  locationId?: number;
  transactionType: string; // 'in', 'out', 'transfer', 'adjustment'
  quantity: number;
  referenceType?: string;
  referenceId?: number;
  userId?: number;
  notes?: string;
}

export interface InventoryPagination {
  items: Inventory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryTransactionPagination {
  items: InventoryTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const inventoryService = {
  // Inventory operations
  getAllInventory: async (
    page: number = 1,
    limit: number = 10,
    warehouseId?: number,
    productId?: number,
    locationId?: number,
    lowStock: boolean = false
  ): Promise<InventoryPagination> => {
    let endpoint = `/inventory?page=${page}&limit=${limit}`;
    
    if (warehouseId) {
      endpoint += `&warehouseId=${warehouseId}`;
    }
    
    if (productId) {
      endpoint += `&productId=${productId}`;
    }
    
    if (locationId) {
      endpoint += `&locationId=${locationId}`;
    }
    
    if (lowStock) {
      endpoint += `&lowStock=true`;
    }
    
    return await apiClient.get(endpoint);
  },
  
  getInventoryById: async (id: number): Promise<Inventory> => {
    return await apiClient.get(`/inventory/${id}`);
  },
  
  createInventory: async (data: CreateInventoryDto): Promise<Inventory> => {
    return await apiClient.post('/inventory', data);
  },
  
  updateInventory: async (id: number, data: UpdateInventoryDto): Promise<Inventory> => {
    return await apiClient.patch(`/inventory/${id}`, data);
  },
  
  deleteInventory: async (id: number): Promise<void> => {
    return await apiClient.delete(`/inventory/${id}`);
  },
  
  // Inventory Transaction operations
  getAllTransactions: async (
    page: number = 1,
    limit: number = 10,
    productId?: number,
    warehouseId?: number,
    locationId?: number,
    transactionType?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<InventoryTransactionPagination> => {
    let endpoint = `/inventory/transactions?page=${page}&limit=${limit}`;
    
    if (productId) {
      endpoint += `&productId=${productId}`;
    }
    
    if (warehouseId) {
      endpoint += `&warehouseId=${warehouseId}`;
    }
    
    if (locationId) {
      endpoint += `&locationId=${locationId}`;
    }
    
    if (transactionType) {
      endpoint += `&transactionType=${transactionType}`;
    }
    
    if (startDate) {
      endpoint += `&startDate=${startDate.toISOString()}`;
    }
    
    if (endDate) {
      endpoint += `&endDate=${endDate.toISOString()}`;
    }
    
    return await apiClient.get(endpoint);
  },
  
  getTransactionById: async (id: number): Promise<InventoryTransaction> => {
    return await apiClient.get(`/inventory/transactions/${id}`);
  },
  
  createTransaction: async (data: CreateInventoryTransactionDto): Promise<InventoryTransaction> => {
    return await apiClient.post('/inventory/transactions', data);
  }
};
