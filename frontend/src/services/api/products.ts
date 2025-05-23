import { apiClient } from '@/lib/api-client';
import { Product, ProductCategory, CreateProductDto, UpdateProductDto, ProductFilters } from '@/types/product';
import { PaginatedResponse } from '@/types/common';

export const productsApi = {
  // Products
  getProducts: (params?: ProductFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Product>> =>
    apiClient.get('/products', { params }),

  getProduct: (id: string): Promise<Product> =>
    apiClient.get(`/products/${id}`),

  createProduct: (data: CreateProductDto): Promise<Product> =>
    apiClient.post('/products', data),

  updateProduct: (id: string, data: UpdateProductDto): Promise<Product> =>
    apiClient.put(`/products/${id}`, data),

  deleteProduct: (id: string): Promise<void> =>
    apiClient.delete(`/products/${id}`),

  bulkDeleteProducts: (ids: string[]): Promise<void> =>
    apiClient.post('/products/bulk-delete', { ids }),

  // Categories
  getCategories: (): Promise<ProductCategory[]> =>
    apiClient.get('/product-categories'),

  getCategory: (id: string): Promise<ProductCategory> =>
    apiClient.get(`/product-categories/${id}`),

  createCategory: (data: { name: string; description?: string; parentId?: string }): Promise<ProductCategory> =>
    apiClient.post('/product-categories', data),

  updateCategory: (id: string, data: { name?: string; description?: string; parentId?: string }): Promise<ProductCategory> =>
    apiClient.put(`/product-categories/${id}`, data),

  deleteCategory: (id: string): Promise<void> =>
    apiClient.delete(`/product-categories/${id}`),

  reorderCategories: (data: { id: string; parentId?: string; order: number }[]): Promise<void> =>
    apiClient.post('/product-categories/reorder', { categories: data }),
};
