import { apiClient } from '@/lib/api-client';
import { Product, ProductCategory, CreateProductDto, UpdateProductDto, ProductFilters } from '@/types/product';
import { PaginatedResponse } from '@/types/common';

export const productsApi = {  // Products
  getProducts: (params?: ProductFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Product>> =>
    apiClient.get('/api/products', { params }),
  getProduct: (id: string): Promise<Product> =>
    apiClient.get(`/api/products/${id}`),

  createProduct: (data: CreateProductDto): Promise<Product> =>
    apiClient.post('/api/products', data),

  updateProduct: (id: string, data: UpdateProductDto): Promise<Product> =>
    apiClient.put(`/api/products/${id}`, data),

  deleteProduct: (id: string): Promise<void> =>
    apiClient.delete(`/api/products/${id}`),

  bulkDeleteProducts: (ids: string[]): Promise<void> =>
    apiClient.post('/api/products/bulk-delete', { ids }),  // Categories
  getCategories: (): Promise<ProductCategory[]> =>
    apiClient.get('/api/product-categories'),

  getCategory: (id: string): Promise<ProductCategory> =>
    apiClient.get(`/api/product-categories/${id}`),

  createCategory: (data: { name: string; description?: string; parentId?: string }): Promise<ProductCategory> =>
    apiClient.post('/api/product-categories', data),

  updateCategory: (id: string, data: { name?: string; description?: string; parentId?: string }): Promise<ProductCategory> =>
    apiClient.put(`/api/product-categories/${id}`, data),

  deleteCategory: (id: string): Promise<void> =>
    apiClient.delete(`/api/product-categories/${id}`),

  reorderCategories: (data: { id: string; parentId?: string; order: number }[]): Promise<void> =>
    apiClient.post('/api/product-categories/reorder', { categories: data }),
};
