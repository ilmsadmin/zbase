// pos.service.mock.ts
import { Prisma } from '@prisma/client';
import { PosServiceInterface } from './pos-service.interface';

// Define the structure of service methods and return types
export const mockPosService: jest.Mocked<PosServiceInterface> = {
  checkActiveShift: jest.fn(),
  createQuickSale: jest.fn(),
  checkInventory: jest.fn(),
  getDashboardData: jest.fn(),
  getRecentSales: jest.fn(),
  searchProducts: jest.fn(),
  searchCustomers: jest.fn(),
};

// Example return types for easier mock implementation
export const mockDashboardData = {
  shiftId: 1,
  warehouseId: 1,
  userId: 1,
  date: new Date(),
  totalSales: 250,
  totalInvoices: 2,
  pendingInvoices: 0,
  cashReceived: 100,
  cardReceived: 150,
  topSellingProducts: [
    {
      product: { id: 1, name: 'Product 1', code: 'P001' },
      quantity: 5,
      totalAmount: new Prisma.Decimal(100),
    },
  ],
};

export const mockPaginatedResponse = {
  items: [],
  meta: { 
    total: 0, 
    page: 1, 
    limit: 10, 
    totalPages: 0 
  },
};
