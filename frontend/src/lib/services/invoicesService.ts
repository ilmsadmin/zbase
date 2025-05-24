import api from '../api';

// Import types from types/invoice.ts
export interface InvoiceItem {
  id?: string;
  productId: string;
  name?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountRate?: number;
  discountAmount?: number;
  tax?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  total?: number;
  locationId?: string;
  locationName?: string;
  serialNumbers?: string;
  serialNumber?: string;
  warrantyExpiration?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  code?: string;
  customerId: string;
  customerName?: string;
  userId?: string;
  userName?: string;
  shiftId?: string;
  warehouseId?: string;
  warehouseName?: string;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'pending' | 'paid' | 'canceled' | 'overdue';
  issueDate?: string;
  invoiceDate?: string;
  dueDate?: string;
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  tax?: number;
  taxAmount?: number;
  shipping?: number;
  total?: number;
  totalAmount?: number;
  amountPaid?: number;
  paidAmount?: number;
  balance?: number;
  paymentMethod?: string;
  notes?: string;
  termsAndConditions?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceCreate {
  customerId: string;
  issueDate?: string;
  invoiceDate?: string;
  dueDate?: string;
  warehouseId?: string;
  status?: 'DRAFT' | 'PENDING' | 'PAID' | 'pending' | 'paid';
  notes?: string;
  termsAndConditions?: string;
  discount?: number;
  discountAmount?: number;
  tax?: number;
  taxAmount?: number;
  shipping?: number;
  subtotal?: number;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: string;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface InvoiceFilters {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  warehouseId?: string;
  page?: number;
  limit?: number;
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

// Invoices API service
export const invoicesService = {
  /**
   * Get all invoices with optional filtering
   */
  getInvoices: async (params?: InvoiceFilters) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  /**
   * Get an invoice by ID
   */
  getInvoiceById: async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Get invoice - compatibility alias for getInvoiceById
   */
  getInvoice: async (id: string) => {
    return invoicesService.getInvoiceById(id);
  },

  /**
   * Get an invoice by invoice number
   */
  getInvoiceByNumber: async (invoiceNumber: string) => {
    const response = await api.get(`/invoices/number/${invoiceNumber}`);
    return response.data;
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (data: InvoiceCreate) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  /**
   * Update an invoice
   */
  updateInvoice: async (id: string, data: Partial<InvoiceCreate>) => {
    const response = await api.patch(`/invoices/${id}`, data);
    return response.data;
  },

  /**
   * Delete an invoice
   */
  deleteInvoice: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Cancel an invoice
   */
  cancelInvoice: async (id: string, reason?: string) => {
    const response = await api.post(`/invoices/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Mark invoice as paid
   */
  markAsPaid: async (id: string, data: {
    paymentMethod: string;
    amount: number;
    referenceNumber?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/invoices/${id}/mark-as-paid`, data);
    return response.data;
  },

  /**
   * Add payment to invoice
   */
  addPayment: async (id: string, data: {
    paymentMethod: string;
    amount: number;
    referenceNumber?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/invoices/${id}/payments`, data);
    return response.data;
  },

  /**
   * Get invoice payments
   */
  getInvoicePayments: async (id: string) => {
    const response = await api.get(`/invoices/${id}/payments`);
    return response.data;
  },

  /**
   * Generate invoice PDF
   */
  generatePdf: async (id: string) => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },

  /**
   * Print invoice - similar to generatePdf but returns URL
   */
  printInvoice: async (id: string, templateId?: string) => {
    const response = await api.get(`/invoices/${id}/print`, { 
      params: { templateId },
      responseType: 'blob'
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    return url;
  },

  /**
   * Send invoice by email
   */
  sendInvoiceByEmail: async (id: string, data: { to: string; subject?: string; message?: string; }) => {
    const response = await api.post(`/invoices/${id}/send-email`, data);
    return response.data;
  },

  /**
   * Email invoice with template
   */
  emailInvoice: async (id: string, email: string, templateId?: string) => {
    return api.post(`/invoices/${id}/email`, { email, templateId });
  },

  /**
   * Get invoice statistics
   */
  getInvoiceStatistics: async (params?: { startDate?: string; endDate?: string; }) => {
    const response = await api.get('/invoices/statistics', { params });
    return response.data;
  },

  /**
   * Get invoice templates
   */
  getInvoiceTemplates: async () => {
    return api.get('/invoices/templates');
  }
};
