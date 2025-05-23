import { apiClient } from '@/lib/api-client';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  groupId?: string;
  groupName?: string;
  creditLimit?: number;
  balance?: number;
  taxId?: string;
  notes?: string;
  isActive: boolean;
}

export interface CustomerFilters {
  search?: string;
  groupId?: string;
  isActive?: boolean;
}

export const customersApi = {
  getCustomers: async (filters?: CustomerFilters): Promise<{ data: Customer[], total: number }> => {
    return apiClient.get('/api/customers', { params: filters });
  },
  
  getCustomer: async (id: string): Promise<Customer> => {
    return apiClient.get(`/api/customers/${id}`);
  },
  
  createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    return apiClient.post('/api/customers', customer);
  },
  
  updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    return apiClient.patch(`/api/customers/${id}`, customer);
  },
  
  deleteCustomer: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/customers/${id}`);
  },
  
  getCustomerGroups: async (): Promise<any[]> => {
    return apiClient.get('/api/customer-groups');
  }
};
