import api from '../api';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  groupId?: string;
  creditLimit?: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  type: 'INVOICE' | 'PAYMENT' | 'REFUND' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
  amount: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerQueryParams {
  search?: string;
  groupId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// Customers API service
export const customersService = {
  /**
   * Get all customers with optional filtering
   */
  getCustomers: async (params?: CustomerQueryParams) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  /**
   * Get a customer by ID
   */
  getCustomerById: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  /**
   * Search customers
   */
  searchCustomers: async (query: string) => {
    const response = await api.get(`/customers/search`, { params: { query } });
    return response.data;
  },

  /**
   * Create a new customer
   */
  createCustomer: async (data: Omit<Customer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  /**
   * Update a customer
   */
  updateCustomer: async (id: string, data: Partial<Omit<Customer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/customers/${id}`, data);
    return response.data;
  },

  /**
   * Delete a customer
   */
  deleteCustomer: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  /**
   * Get customer groups
   */
  getCustomerGroups: async () => {
    const response = await api.get('/customer-groups');
    return response.data;
  },

  /**
   * Get customer group by ID
   */
  getCustomerGroupById: async (id: string) => {
    const response = await api.get(`/customer-groups/${id}`);
    return response.data;
  },

  /**
   * Create customer group
   */
  createCustomerGroup: async (data: Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/customer-groups', data);
    return response.data;
  },

  /**
   * Update customer group
   */
  updateCustomerGroup: async (id: string, data: Partial<Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/customer-groups/${id}`, data);
    return response.data;
  },

  /**
   * Delete customer group
   */
  deleteCustomerGroup: async (id: string) => {
    const response = await api.delete(`/customer-groups/${id}`);
    return response.data;
  },

  /**
   * Get customer transactions
   */
  getCustomerTransactions: async (customerId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get(`/customers/${customerId}/transactions`, { params });
    return response.data;
  },

  /**
   * Add customer transaction
   */
  addCustomerTransaction: async (customerId: string, data: {
    type: 'PAYMENT' | 'REFUND' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
    amount: number;
    referenceId?: string;
    referenceType?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/customers/${customerId}/transactions`, data);
    return response.data;
  },

  /**
   * Get customer invoices
   */
  getCustomerInvoices: async (customerId: string, params?: {
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get(`/customers/${customerId}/invoices`, { params });
    return response.data;
  },
};
