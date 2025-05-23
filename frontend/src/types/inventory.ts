import { Product } from './product';
import { Warehouse } from './warehouse';

export interface InventoryItem {
  id: string;
  productId: string;
  product: Product;
  warehouseId: string;
  warehouse: Warehouse;
  quantity: number;
  minimumStock: number;
  maximumStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryFilters {
  productId?: string;
  warehouseId?: string;
  lowStock?: boolean;
  search?: string;
}

export type InventoryTransactionType = 'ADJUSTMENT' | 'TRANSFER' | 'SALE' | 'PURCHASE' | 'RETURN';

export interface InventoryTransaction {
  id: string;
  type: InventoryTransactionType;
  productId: string;
  product: Product;
  sourceWarehouseId?: string;
  sourceWarehouse?: Warehouse;
  destinationWarehouseId?: string;
  destinationWarehouse?: Warehouse;
  quantity: number;
  reason?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface StockAdjustment {
  productId: string;
  warehouseId: string;
  quantity: number; // can be positive (increase) or negative (decrease)
  reason: string;
  notes?: string;
}

export interface StockTransfer {
  productId: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  quantity: number;
  notes?: string;
}
