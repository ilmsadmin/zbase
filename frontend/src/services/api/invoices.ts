// This file provides backward compatibility for components still importing from @/services/api/invoices
// It re-exports the services from @/lib/services/invoicesService

import { invoicesService } from '@/lib/services/invoicesService';
import { Invoice, InvoiceFilters } from '@/types/invoice';

export const invoicesApi = {
  // Get all invoices with filters
  getInvoices: async (filters = {}) => {
    const data = await invoicesService.getInvoices(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single invoice by ID
  getInvoice: async (id) => {
    return invoicesService.getInvoiceById(id);
  },

  // Create a new invoice
  createInvoice: async (invoiceData) => {
    return invoicesService.createInvoice(invoiceData);
  },

  // Update an existing invoice
  updateInvoice: async (id, invoiceData) => {
    return invoicesService.updateInvoice(id, invoiceData);
  },

  // Delete an invoice
  deleteInvoice: async (id) => {
    return invoicesService.deleteInvoice(id);
  },

  // Mark invoice as paid
  markAsPaid: async (id, paymentData) => {
    return invoicesService.markAsPaid(id, paymentData);
  },

  // Generate invoice PDF
  generatePdf: async (id) => {
    return invoicesService.generateInvoicePdf(id);
  },

  // Send invoice by email
  sendInvoice: async (id, emailData) => {
    return invoicesService.sendInvoice(id, emailData);
  },

  // Get invoice statistics
  getStatistics: async (params = {}) => {
    return invoicesService.getInvoiceStatistics(params);
  }
};
