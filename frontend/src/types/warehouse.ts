export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isActive: boolean;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  warehouse: Warehouse;
  name: string;
  code: string;
  type: 'ZONE' | 'AISLE' | 'RACK' | 'SHELF' | 'BIN';
  parentId?: string;
  parent?: WarehouseLocation;
  children?: WarehouseLocation[];
  createdAt: string;
  updatedAt: string;
}
