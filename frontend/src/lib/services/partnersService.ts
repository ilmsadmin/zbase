import api from '../api';

export interface Partner {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface ListResponse<T> {
  items: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export const partnersService = {
  // Get all partners with filters
  getPartners: async (filters: PartnerFilters = {}): Promise<ListResponse<Partner>> => {
    const response = await api.get('/partners', { params: filters });
    return response.data;
  },

  // Get a single partner by ID
  getPartnerById: async (id: string): Promise<Partner> => {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  },

  // Create a new partner
  createPartner: async (partnerData: Partial<Partner>): Promise<Partner> => {
    const response = await api.post('/partners', partnerData);
    return response.data;
  },

  // Update an existing partner
  updatePartner: async (id: string, partnerData: Partial<Partner>): Promise<Partner> => {
    const response = await api.patch(`/partners/${id}`, partnerData);
    return response.data;
  },

  // Delete a partner
  deletePartner: async (id: string): Promise<void> => {
    await api.delete(`/partners/${id}`);
  },

  // Bulk delete partners
  bulkDeletePartners: async (ids: string[]): Promise<void> => {
    await api.post('/partners/bulk-delete', { ids });
  }
};
