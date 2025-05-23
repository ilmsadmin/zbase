import { apiClient } from '@/lib/api-client';
import { Invoice, InvoiceFilters, CreateInvoiceDto } from '@/types/invoice';

export const invoicesApi = {
  getInvoices: async (filters?: InvoiceFilters): Promise<{ data: Invoice[], total: number }> => {
    return apiClient.get('/api/invoices', { params: filters });
  },
  
  getInvoice: async (id: string): Promise<Invoice> => {
    return apiClient.get(`/api/invoices/${id}`);
  },
  
  createInvoice: async (invoice: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient.post('/api/invoices', invoice);
  },
  
  updateInvoice: async (id: string, invoice: Partial<CreateInvoiceDto>): Promise<Invoice> => {
    return apiClient.patch(`/api/invoices/${id}`, invoice);
  },
  
  deleteInvoice: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/invoices/${id}`);
  },
  
  markAsPaid: async (id: string, paymentData: any): Promise<Invoice> => {
    return apiClient.post(`/api/invoices/${id}/mark-as-paid`, paymentData);
  },
  
  cancelInvoice: async (id: string, reason?: string): Promise<Invoice> => {
    return apiClient.post(`/api/invoices/${id}/cancel`, { reason });
  },
    printInvoice: async (id: string, templateId?: string): Promise<string> => {
    const response = await apiClient.get(`/api/invoices/${id}/print`, { 
      params: { templateId },
      responseType: 'blob'
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    return url;
  },
  
  emailInvoice: async (id: string, email: string, templateId?: string): Promise<void> => {
    return apiClient.post(`/api/invoices/${id}/email`, { email, templateId });
  },
  
  getInvoiceTemplates: async (): Promise<any[]> => {
    return apiClient.get('/api/invoices/templates');
  }
};
