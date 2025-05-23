import { apiClient } from '@/lib/api-client';

export interface Partner {
  id: string;
  code: string;
  name: string;
  type: string; // supplier, distributor, etc.
  contactPerson: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
}

export interface PartnerFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
}

export const partnersApi = {
  getPartners: async (filters?: PartnerFilters): Promise<{ data: Partner[], total: number }> => {
    return apiClient.get('/api/partners', { params: filters });
  },
  
  getPartner: async (id: string): Promise<Partner> => {
    return apiClient.get(`/api/partners/${id}`);
  },
  
  createPartner: async (partner: Omit<Partner, 'id'>): Promise<Partner> => {
    return apiClient.post('/api/partners', partner);
  },
  
  updatePartner: async (id: string, partner: Partial<Partner>): Promise<Partner> => {
    return apiClient.patch(`/api/partners/${id}`, partner);
  },
  
  deletePartner: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/partners/${id}`);
  }
};
