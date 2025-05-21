// src/pos/pos-service.interface.ts
import { Prisma } from '@prisma/client';
import { CreateQuickSaleDto, InventoryCheckDto } from './dto';

export interface PosServiceInterface {
  checkActiveShift(userId: number): Promise<{
    hasActiveShift: boolean;
    message?: string;
    shiftData?: any;
  }>;

  createQuickSale(createQuickSaleDto: CreateQuickSaleDto, userId: number): Promise<any>;
  
  checkInventory(inventoryCheckDto: InventoryCheckDto, userId: number): Promise<{
    warehouseId: number;
    warehouseName: string;
    items: any[];
    allItemsAvailable: boolean;
  }>;
  
  getDashboardData(userId: number): Promise<{
    shiftId: number;
    warehouseId: number;
    userId: number;
    date: Date;
    totalSales: number;
    totalInvoices: number;
    pendingInvoices: number;
    cashReceived: number;
    cardReceived: number;
    topSellingProducts: any[];
  }>;
  
  getRecentSales(userId: number, page?: number, limit?: number): Promise<{
    items: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
  
  searchProducts(
    query: string, 
    warehouseId: number, 
    page?: number, 
    limit?: number
  ): Promise<{
    items: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
  
  searchCustomers(
    query: string, 
    page?: number, 
    limit?: number
  ): Promise<{
    items: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
