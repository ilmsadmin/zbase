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
   * Get a product by barcode
   */
  getProductByBarcode: async (barcode: string) => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  /**
   * Get a product by SKU
   */
  getProductBySku: async (sku: string) => {
    const response = await api.get(`/products/sku/${sku}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  /**
   * Update a product
   */
  updateProduct: async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/products/${id}`, data);
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
   * Get all product categories
   */
  getCategories: async () => {
    const response = await api.get('/product-categories');
    return response.data;
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string) => {
    const response = await api.get(`/product-categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  createCategory: async (data: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/product-categories', data);
    return response.data;
  },

  /**
   * Update a category
   */
  updateCategory: async (id: string, data: Partial<Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/product-categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/product-categories/${id}`);
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
   * Get an attribute by ID
   */
  getAttributeById: async (id: string) => {
    const response = await api.get(`/product-attributes/${id}`);
    return response.data;
  },

  /**
   * Create a new attribute
   */
  createAttribute: async (data: Omit<ProductAttribute, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/product-attributes', data);
    return response.data;
  },

  /**
   * Update an attribute
   */
  updateAttribute: async (id: string, data: Partial<Omit<ProductAttribute, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.patch(`/product-attributes/${id}`, data);
    return response.data;
  },

  /**
   * Delete an attribute
   */
  deleteAttribute: async (id: string) => {
    const response = await api.delete(`/product-attributes/${id}`);
    return response.data;
  },
};
