import { apiClient } from '../client';

// Enum for warranty status
export enum WarrantyStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

// Warranty interface
export interface Warranty {
  id: number;
  code: string;
  customerId?: number;
  customer?: {
    id: number;
    name: string;
    code: string;
  };
  productId?: number;
  product?: {
    id: number;
    name: string;
    code: string;
  };
  invoiceId?: number;
  invoice?: {
    id: number;
    code: string;
  };
  serialNumber?: string;
  issueDescription?: string;
  receivedDate?: Date;
  expectedReturnDate?: Date;
  status: WarrantyStatus;
  diagnosis?: string;
  solution?: string;
  cost?: number;
  charged?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: number;
  creator?: {
    id: number;
    name: string;
  };
  technicianId?: number;
  technician?: {
    id: number;
    name: string;
  };
}

// Interface for creating a warranty
export interface CreateWarrantyDto {
  code?: string;
  customerId?: number;
  productId?: number;
  invoiceId?: number;
  serialNumber?: string;
  issueDescription?: string;
  receivedDate?: Date;
  expectedReturnDate?: Date;
  status?: WarrantyStatus;
  diagnosis?: string;
  solution?: string;
  cost?: number;
  charged?: boolean;
  notes?: string;
  creatorId: number;
  technicianId?: number;
}

// Interface for updating a warranty
export interface UpdateWarrantyDto {
  customerId?: number;
  productId?: number;
  invoiceId?: number;
  serialNumber?: string;
  issueDescription?: string;
  receivedDate?: Date;
  expectedReturnDate?: Date;
  status?: WarrantyStatus;
  diagnosis?: string;
  solution?: string;
  cost?: number;
  charged?: boolean;
  notes?: string;
  technicianId?: number;
}

// Interface for filtering warranties
export interface WarrantyFilter {
  code?: string;
  customerId?: string;
  productId?: string;
  invoiceId?: string;
  serialNumber?: string;
  status?: WarrantyStatus;
  creatorId?: string;
  technicianId?: string;
  startDate?: string;
  endDate?: string;
}

// Response interface with pagination
export interface WarrantyResponse {
  items: Warranty[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Warranty service
export const warrantyService = {
  getAllWarranties: async (filters: WarrantyFilter = {}, page: number = 1, limit: number = 20): Promise<WarrantyResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Add filter parameters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/warranties?${queryParams.toString()}`);
    return response;
  },

  getWarrantyById: async (id: number): Promise<Warranty> => {
    const response = await apiClient.get(`/warranties/${id}`);
    return response;
  },

  getWarrantyByCode: async (code: string): Promise<Warranty> => {
    const response = await apiClient.get(`/warranties/code/${code}`);
    return response;
  },

  createWarranty: async (warranty: CreateWarrantyDto): Promise<Warranty> => {
    const response = await apiClient.post('/warranties', warranty);
    return response;
  },

  updateWarranty: async (id: number, warranty: UpdateWarrantyDto): Promise<Warranty> => {
    const response = await apiClient.patch(`/warranties/${id}`, warranty);
    return response;
  },

  deleteWarranty: async (id: number): Promise<void> => {
    await apiClient.delete(`/warranties/${id}`);
  },
};
