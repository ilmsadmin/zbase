// This file provides backward compatibility for components still importing from @/services/api/products
// It re-exports the services from @/lib/services/productsService

import { productsService } from '@/lib/services/productsService';

export const productsApi = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    const data = await productsService.getProducts(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single product by ID
  getProduct: async (id) => {
    return productsService.getProductById(id);
  },

  // Create a new product
  createProduct: async (productData) => {
    return productsService.createProduct(productData);
  },

  // Update an existing product
  updateProduct: async (id, productData) => {
    return productsService.updateProduct(id, productData);
  },

  // Delete a product
  deleteProduct: async (id) => {
    return productsService.deleteProduct(id);
  },

  // Bulk delete products
  bulkDeleteProducts: async (ids) => {
    return productsService.bulkDeleteProducts(ids);
  },
  // Get product categories
  getCategories: async () => {
    const response = await productsService.getCategories();
    // The response is already an array, no need to access .items
    return response || [];
  },

  // Create a product category
  createCategory: async (categoryData) => {
    return productsService.createCategory(categoryData);
  },

  // Update a product category
  updateCategory: async (id, categoryData) => {
    return productsService.updateCategory(id, categoryData);
  },

  // Delete a product category
  deleteCategory: async (id) => {
    return productsService.deleteCategory(id);
  }
};
