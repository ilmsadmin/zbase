// File to re-export the productsService for backward compatibility
// This is part of the migration from old API structure to new lib/services structure

import { 
  productsService, 
  Product, 
  ProductCategory, 
  ProductAttribute, 
  ProductQueryParams, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductFilters, 
  PaginatedResponse 
} from '@/lib/services/productsService';

// Re-export the types
export type {
  Product,
  ProductCategory,
  ProductAttribute,
  ProductQueryParams,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginatedResponse
};

// Re-export the API functions
export const productsApi = {
  getProducts: async (filters = {}) => {
    console.log("API Request - getProducts:", filters);
    const data = await productsService.getProducts(filters);
    console.log("API Response:", data);
    
    // Transform the response to match the expected format
    return {
      data: data.items || [],
      meta: data.meta || { total: 0, page: 1, limit: 20, totalPages: 0 }
    };
  },
  getProduct: productsService.getProductById,
  createProduct: productsService.createProduct,
  updateProduct: productsService.updateProduct,
  deleteProduct: productsService.deleteProduct,
  bulkDeleteProducts: productsService.bulkDeleteProducts,
  getCategories: async () => {
    const data = await productsService.getCategories();
    // Transform the response to match the expected format if needed
    if (data.items) {
      return { data: data.items, meta: data.meta };
    }
    return data;
  },
  getCategory: productsService.getCategory,
  createCategory: productsService.createCategory,
  updateCategory: productsService.updateCategory,
  deleteCategory: productsService.deleteCategory,
  reorderCategories: productsService.reorderCategories,
  getProductAttributes: async () => {
    const data = await productsService.getAttributes();
    // Transform the response to match the expected format if needed
    if (data.items) {
      return { data: data.items, meta: data.meta };
    }
    return data;
  },
  getProductAttribute: productsService.getAttribute,
  createProductAttribute: productsService.createAttribute,
  updateProductAttribute: productsService.updateAttribute,
  deleteProductAttribute: productsService.deleteAttribute
};

// Default export for backward compatibility
export default productsApi;