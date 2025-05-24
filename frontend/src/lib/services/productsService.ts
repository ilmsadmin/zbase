import api from '../api';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId?: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // 'name', '-name', 'price', '-price'
  page?: number;
  limit?: number;
}

// Thêm các interfaces từ types/product
export interface CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId?: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  price?: number;
  cost?: number;
  categoryId?: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Products API service
export const productsService = {
  /**
   * Get all products with optional filtering
   */
  getProducts: async (params?: ProductQueryParams) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Get a product by ID
   */
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/products/${id}`, product);
    return response.data;
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Delete multiple products
   */
  bulkDeleteProducts: async (ids: string[]) => {
    const response = await api.post('/products/bulk-delete', { ids });
    return response.data;
  },

  /**
   * Get all product categories
   */
  getCategories: async () => {
    const response = await api.get('/product-categories');
    return response.data;
  },

  /**
   * Get a product category by ID
   */
  getCategory: async (id: string) => {
    const response = await api.get(`/product-categories/${id}`);
    return response.data;
  },

  /**
   * Create a new product category
   */
  createCategory: async (data: { name: string; description?: string; parentId?: string }) => {
    const response = await api.post('/product-categories', data);
    return response.data;
  },

  /**
   * Update an existing product category
   */
  updateCategory: async (id: string, data: { name?: string; description?: string; parentId?: string }) => {
    const response = await api.patch(`/product-categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product category
   */
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/product-categories/${id}`);
    return response.data;
  },

  /**
   * Reorder product categories
   */
  reorderCategories: async (data: { id: string; parentId?: string; order: number }[]) => {
    const response = await api.post('/product-categories/reorder', { categories: data });
    return response.data;
  },

  /**
   * Get all product attributes
   */
  getAttributes: async () => {
    const response = await api.get('/product-attributes');
    return response.data;
  },

  /**
   * Get a product attribute by ID
   */
  getAttribute: async (id: string) => {
    const response = await api.get(`/product-attributes/${id}`);
    return response.data;
  },

  /**
   * Create a new product attribute
   */
  createAttribute: async (attribute: Omit<ProductAttribute, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/product-attributes', attribute);
    return response.data;
  },

  /**
   * Update an existing product attribute
   */
  updateAttribute: async (id: string, attribute: Partial<Omit<ProductAttribute, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/product-attributes/${id}`, attribute);
    return response.data;
  },

  /**
   * Delete a product attribute
   */
  deleteAttribute: async (id: string) => {
    const response = await api.delete(`/product-attributes/${id}`);
    return response.data;
  }
};
