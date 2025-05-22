import { apiClient } from '../client';

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  categoryId?: number;
  category?: ProductCategory;
  basePrice: number;
  costPrice?: number;
  taxRate?: number;
  barcode?: string;
  unit?: string;
  manufacturer?: string;
  warrantyMonths?: number;
  attributes?: ProductAttribute[];
  _count?: {
    inventory: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  parentId?: number;
  parent?: {
    id: number;
    name: string;
  };
  _count?: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  id: number;
  productId: number;
  attributeName: string;
  attributeValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeSummary {
  name: string;
  valueCount: number;
  values: string[];
}

export interface CreateProductDto {
  code: string;
  name: string;
  description?: string;
  categoryId?: number;
  basePrice: number;
  costPrice?: number;
  taxRate?: number;
  barcode?: string;
  unit?: string;
  manufacturer?: string;
  warrantyMonths?: number;
  attributes?: {
    attributeName: string;
    attributeValue: string;
  }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateProductCategoryDto {
  name: string;
  parentId?: number;
}

export interface UpdateProductCategoryDto extends Partial<CreateProductCategoryDto> {}

export interface ProductPagination {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductCategoryPagination {
  items: ProductCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const productService = {
  // Product operations
  getAllProducts: async (
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    categoryId?: number
  ): Promise<ProductPagination> => {
    let endpoint = `/products?page=${page}&limit=${limit}`;
    
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    if (categoryId) {
      endpoint += `&categoryId=${categoryId}`;
    }
    
    return await apiClient.get(endpoint);
  },
  
  getProductById: async (id: number): Promise<Product> => {
    return await apiClient.get(`/products/${id}`);
  },
  
  createProduct: async (data: CreateProductDto): Promise<Product> => {
    return await apiClient.post('/products', data);
  },
  
  updateProduct: async (id: number, data: UpdateProductDto): Promise<Product> => {
    return await apiClient.patch(`/products/${id}`, data);
  },
  
  deleteProduct: async (id: number): Promise<void> => {
    return await apiClient.delete(`/products/${id}`);
  },
  
  // Product Category operations
  getAllCategories: async (parentId?: number): Promise<ProductCategory[]> => {
    const endpoint = parentId 
      ? `/product-categories?parentId=${parentId}`
      : '/product-categories';
    return await apiClient.get(endpoint);
  },
  
  getCategoryById: async (id: number): Promise<ProductCategory> => {
    return await apiClient.get(`/product-categories/${id}`);
  },
  
  createCategory: async (data: CreateProductCategoryDto): Promise<ProductCategory> => {
    return await apiClient.post('/product-categories', data);
  },
  
  updateCategory: async (id: number, data: UpdateProductCategoryDto): Promise<ProductCategory> => {
    return await apiClient.patch(`/product-categories/${id}`, data);
  },
  
  deleteCategory: async (id: number): Promise<void> => {
    return await apiClient.delete(`/product-categories/${id}`);
  },
  
  // Product Attributes operations
  getProductAttributes: async (productId: number): Promise<ProductAttribute[]> => {
    return await apiClient.get(`/product-attributes?productId=${productId}`);
  },
  
  getAttributeSummary: async (): Promise<AttributeSummary[]> => {
    return await apiClient.get('/product-attributes/summary');
  },
  
  getCommonAttributes: async (): Promise<{name: string; productCount: number; commonValues: {value: string; count: number}[]}[]> => {
    return await apiClient.get('/product-attributes/common-attributes');
  }
};
