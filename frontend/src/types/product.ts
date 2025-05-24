export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  category?: ProductCategory;
  price: number;
  costPrice?: number;
  unit: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderLevel?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  isActive: boolean;
  attributes?: ProductAttribute[];
  inventory?: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parentId?: number | null;
  parent?: ProductCategory;
  children?: ProductCategory[];
  _count?: {
    products: number;
    children: number;
  }
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  productId: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  warehouse?: {
    id: string;
    name: string;
  };
  locationId?: string;
  location?: {
    id: string;
    name: string;
  };
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  price: number;
  costPrice?: number;
  unit: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderLevel?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  isActive?: boolean;
  attributes?: { name: string; value: string }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  hasStock?: boolean;
}
