import api from '../api';

export interface InvoiceItem {
  id?: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
  termsAndConditions?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceCreate {
  customerId: string;
  issueDate: string;
  dueDate: string;
  status?: 'DRAFT' | 'PENDING' | 'PAID';
  notes?: string;
  termsAndConditions?: string;
  discount?: number;
  tax?: number;
  shipping?: number;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface InvoiceQueryParams {
  customerId?: string;
  status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
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
  getInvoices: async (params?: InvoiceQueryParams) => {
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
   * Send invoice by email
   */
  sendInvoiceByEmail: async (id: string, data: { to: string; subject?: string; message?: string; }) => {
    const response = await api.post(`/invoices/${id}/send-email`, data);
    return response.data;
  },

  /**
   * Get invoice statistics
   */
  getInvoiceStatistics: async (params?: { startDate?: string; endDate?: string; }) => {
    const response = await api.get('/invoices/statistics', { params });
    return response.data;
  },
};
