// This file provides a compatibility layer for components still importing from @/services/api/*
// It re-exports the services from @/lib/services to avoid breaking changes
// Eventually, components should migrate to importing directly from @/lib/services

import {
  reportsService,
  ReportCategory,
  SavedReport,
  QuickStat,
  RevenueData,
  RevenueReportData,
  MetricOption,
  FilterOption,
  VisualizationOption,
  CustomReport
} from '@/lib/services/reportsService';

import {
  productsService,
  Product,
  ProductCategory,
  ProductAttribute,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters
} from '@/lib/services/productsService';

import {
  inventoryService,
  InventoryItem,
  InventoryTransaction,
  StockAdjustment,
  StockTransfer,
  InventoryFilters
} from '@/lib/services/inventoryService';

import {
  customersService,
  Customer,
  CustomerGroup,
  CustomerTransaction,
  CustomerFilters
} from '@/lib/services/customersService';

import {
  invoicesService,
  Invoice,
  InvoiceItem,
  InvoiceCreate,
  InvoiceFilters,
  InvoicePayment
} from '@/lib/services/invoicesService';

// Re-export reports API functions
export const getReportCategories = reportsService.getReportCategories;
export const getQuickStats = reportsService.getQuickStats;
export const getSavedReports = reportsService.getSavedReports;
export const getRevenueReport = reportsService.generateReportFromTemplate;
export const getInventoryValueReport = reportsService.getInventoryValueReport;
export const getInventoryMovementReport = reportsService.getInventoryMovementReport;
export const getLowStockReport = reportsService.getLowStockReport;
export const getExpiryReport = reportsService.getExpiryReport;
export const getMetricOptions = reportsService.getMetricOptions;
export const runCustomReport = reportsService.runCustomReport;
export const saveCustomReport = reportsService.saveCustomReport;
export const scheduleReport = reportsService.scheduleReport;
export const exportReport = reportsService.exportReport;

// Re-export products API functions
export const productsApi = {
  getProducts: productsService.getProducts,
  getProduct: productsService.getProductById,
  createProduct: productsService.createProduct,
  updateProduct: productsService.updateProduct,
  deleteProduct: productsService.deleteProduct,
  bulkDeleteProducts: productsService.bulkDeleteProducts,
  getCategories: productsService.getCategories,
  getCategory: productsService.getCategory,
  createCategory: productsService.createCategory,
  updateCategory: productsService.updateCategory,
  deleteCategory: productsService.deleteCategory,
  reorderCategories: productsService.reorderCategories
};

// Re-export inventory API functions
export const inventoryApi = {
  getInventoryItems: inventoryService.getInventoryItems,
  getInventoryItem: inventoryService.getInventoryItem,
  createStockAdjustment: inventoryService.createStockAdjustment,
  createStockTransfer: inventoryService.createStockTransfer,
  getInventoryTransactions: inventoryService.getInventoryTransactions,
  getInventoryTransaction: inventoryService.getInventoryTransaction
};

// Re-export customers API functions
export const customersApi = {
  getCustomers: customersService.getCustomers,
  getCustomer: customersService.getCustomer,
  createCustomer: customersService.createCustomer,
  updateCustomer: customersService.updateCustomer,
  deleteCustomer: customersService.deleteCustomer,
  getCustomerGroups: customersService.getCustomerGroups
};

// Re-export invoices API functions
export const invoicesApi = {
  getInvoices: invoicesService.getInvoices,
  getInvoice: invoicesService.getInvoice,
  createInvoice: invoicesService.createInvoice,
  updateInvoice: invoicesService.updateInvoice,
  deleteInvoice: invoicesService.deleteInvoice,
  markAsPaid: invoicesService.markAsPaid,
  cancelInvoice: invoicesService.cancelInvoice,
  printInvoice: invoicesService.printInvoice,
  emailInvoice: invoicesService.emailInvoice,
  getInvoiceTemplates: invoicesService.getInvoiceTemplates
};

// Re-export types
export type {
  ReportCategory,
  SavedReport,
  QuickStat,
  RevenueData,
  RevenueReportData,
  MetricOption,
  FilterOption,
  VisualizationOption,
  CustomReport,
  Product,
  ProductCategory,
  ProductAttribute,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  InventoryItem,
  InventoryTransaction,
  StockAdjustment,
  StockTransfer,
  InventoryFilters,
  Customer,
  CustomerGroup,
  CustomerTransaction,
  CustomerFilters,
  Invoice,
  InvoiceItem,
  InvoiceCreate,
  InvoiceFilters,
  InvoicePayment
};

// Also include re-exports for other services as they are migrated
// Example:
// export { productsService } from '@/lib/services/productsService';
// export type { Product, ProductCategory } from '@/lib/services/productsService';
