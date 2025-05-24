import api from '../api';

// Combine interfaces from both files
export interface Customer {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  groupId?: string; // Frontend stores as string, converts to number when sending to backend
  groupName?: string;
  group?: CustomerGroup; // The actual group object from the backend
  balance: number; // Used for display purposes in frontend
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGroup {
  id: string; // Frontend stores as string, converts to number when sending to backend
  name: string;
  description?: string;
  discountPercentage?: number; // Maps to discountRate in backend
  creditLimit?: number; // Maps to creditLimit in backend
  paymentTerms?: number;
  priority?: number;
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

// Combine query parameters from both files
export interface CustomerFilters {
  search?: string;
  groupId?: string;
  isActive?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

// Customers API service
export const customersService = {
  /**
   * Get all customers with optional filtering
   */
  getCustomers: async (params?: CustomerFilters) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },  /**
   * Get a customer by ID
   */
  getCustomerById: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/customers/${numericId}`);
    
    // Format data for frontend use
    const data = response.data;
    
    // Ensure groupId is set correctly from the group object
    if (data.group && data.group.id !== undefined) {
      data.groupId = String(data.group.id);
      data.groupName = data.group.name;
    }
    
    console.log('Customer data from backend:', data);
    return data;
  },

  /**
   * Get a customer by ID - compatibility alias for getCustomerById
   */
  getCustomer: async (id: string) => {
    return customersService.getCustomerById(id);
  },

  /**
   * Search customers
   */
  searchCustomers: async (query: string) => {
    const response = await api.get(`/customers/search`, { params: { query } });
    return response.data;
  },  /**
   * Create a new customer
   */  createCustomer: async (data: Omit<Customer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => {
    // Process data to match backend expectations
    const processedData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      // Convert groupId to number since backend expects integer
      groupId: data.groupId ? parseInt(data.groupId, 10) : undefined,
      // Note: isActive is intentionally omitted as it's not supported in the backend DTO
    };
    
    console.log('CREATE CUSTOMER - Original data:', data);
    console.log('CREATE CUSTOMER - Processed data being sent to backend:', processedData);
    
    try {
      const response = await api.post('/customers', processedData);
      console.log('CREATE CUSTOMER - Success response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('CREATE CUSTOMER - Error:', err);
      console.error('CREATE CUSTOMER - Error response:', err.response?.data);
      throw err;
    }
  },  /**
   * Update a customer
   */
  updateCustomer: async (id: string, data: Partial<Omit<Customer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    
    // Create a clean object with only the backend-supported fields
    const processedData: any = {};
      // Add fields only if they exist in the data
    if (data.name !== undefined) processedData.name = data.name;
    if (data.phone !== undefined) processedData.phone = data.phone;
    if (data.email !== undefined) processedData.email = data.email;
    if (data.address !== undefined) processedData.address = data.address;
    // Note: isActive is intentionally omitted as it's not supported in the backend DTO
    
    // Special handling for fields that need conversion
    if (data.groupId !== undefined) {
      processedData.groupId = data.groupId ? parseInt(data.groupId, 10) : null;
    }
    
    console.log('UPDATE CUSTOMER - Customer ID:', id, '(converted to)', numericId);
    console.log('UPDATE CUSTOMER - Original data:', data);
    console.log('UPDATE CUSTOMER - Processed data being sent to backend:', processedData);
    
    try {
      const response = await api.patch(`/customers/${numericId}`, processedData);
      console.log('UPDATE CUSTOMER - Success response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('UPDATE CUSTOMER - Error:', err);
      console.error('UPDATE CUSTOMER - Error response:', err.response?.data);
      throw err;
    }
  },
  /**
   * Delete a customer
   */
  deleteCustomer: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.delete(`/customers/${numericId}`);
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
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.get(`/customer-groups/${numericId}`);
    return response.data;
  },

  /**
   * Create customer group
   */
  createCustomerGroup: async (data: Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Process data to match backend expectations
    const processedData = {
      ...data,
      // Map frontend fields to backend field names
      discountRate: data.discountPercentage,
    };
    
    const response = await api.post('/customer-groups', processedData);
    return response.data;
  },
  /**
   * Update customer group
   */
  updateCustomerGroup: async (id: string, data: Partial<Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>>) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    
    // Process data to match backend expectations
    const processedData = {
      ...data,
      // Map frontend fields to backend field names
      discountRate: data.discountPercentage,
    };
    
    const response = await api.patch(`/customer-groups/${numericId}`, processedData);
    return response.data;
  },
  /**
   * Delete customer group
   */
  deleteCustomerGroup: async (id: string) => {
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(id, 10);
    const response = await api.delete(`/customer-groups/${numericId}`);
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
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(customerId, 10);
    const response = await api.get(`/customers/${numericId}/transactions`, { params });
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
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(customerId, 10);
    const response = await api.post(`/customers/${numericId}/transactions`, data);
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
    // Convert id to number since the backend expects integer IDs
    const numericId = parseInt(customerId, 10);
    const response = await api.get(`/customers/${numericId}/invoices`, { params });
    return response.data;
  },
};
