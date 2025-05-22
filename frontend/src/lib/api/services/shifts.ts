import { apiClient } from '../client';

export interface Shift {
  id: number;
  userId: number;
  warehouseId: number;
  startTime: string;
  endTime: string | null;
  startAmount: number;
  endAmount: number | null;
  status: 'open' | 'closed';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
}

export interface CreateShiftDto {
  warehouseId: number;
  startAmount: number;
  notes?: string;
}

export interface UpdateShiftDto {
  notes?: string;
  startAmount?: number;
}

export interface CloseShiftDto {
  endAmount: number;
  notes?: string;
}

export interface ShiftPagination {
  items: Shift[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ShiftSummary {
  shift: Shift;
  invoices: any[];
  transactions: any[];
  summary: {
    totalSales: number;
    totalReceived: number;
    totalPaid: number;
    calculatedBalance: number;
    declaredEndAmount: number;
    difference: number;
  };
}

export const shiftsService = {
  // Get all shifts with pagination and filters
  getAllShifts: async (
    page: number = 1, 
    limit: number = 10, 
    status?: string,
    warehouseId?: number,
    userId?: number
  ): Promise<ShiftPagination> => {
    let endpoint = `/shifts?page=${page}&limit=${limit}`;
    
    if (status) {
      endpoint += `&status=${status}`;
    }
    
    if (warehouseId) {
      endpoint += `&warehouseId=${warehouseId}`;
    }
    
    if (userId) {
      endpoint += `&userId=${userId}`;
    }
    
    return await apiClient.get(endpoint);
  },
  
  // Get a shift by id
  getShiftById: async (id: number): Promise<Shift> => {
    return await apiClient.get(`/shifts/${id}`);
  },
  
  // Get the current open shift for the logged in user
  getCurrentShift: async (): Promise<Shift | null> => {
    return await apiClient.get('/shifts/current');
  },
  
  // Create a new shift (open a shift)
  createShift: async (data: CreateShiftDto): Promise<Shift> => {
    return await apiClient.post('/shifts', data);
  },
  
  // Update a shift
  updateShift: async (id: number, data: UpdateShiftDto): Promise<Shift> => {
    return await apiClient.patch(`/shifts/${id}`, data);
  },
  
  // Close a shift
  closeShift: async (id: number, data: CloseShiftDto): Promise<Shift> => {
    return await apiClient.patch(`/shifts/${id}/close`, data);
  },
  
  // Get shift summary (for closing report)
  getShiftSummary: async (id: number): Promise<ShiftSummary> => {
    return await apiClient.get(`/shifts/${id}/summary`);
  }
};
