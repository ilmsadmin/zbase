"use client";

import { useQueryWithErrorHandling, useMutationWithErrorHandling } from '@/lib/react-query/hooks';
import { Product, ProductQueryParams, productsService } from '@/lib/services/productsService';

/**
 * Hook to get products with optional filtering
 */
export function useProducts(params?: ProductQueryParams) {  return useQueryWithErrorHandling(
    ['products', params], // Query key includes the params so it re-fetches when they change
    () => productsService.getProducts(params),
    {
      placeholderData: (previousData) => previousData, // This replaces keepPreviousData in React Query v5
    }
  );
}

/**
 * Hook to get a product by ID
 */
export function useProduct(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['product', id],
    () => productsService.getProductById(id!),
    {
      enabled: !!id, // Only fetch when id is provided
    }
  );
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  return useMutationWithErrorHandling(
    (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      productsService.createProduct(newProduct)
  );
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: string; data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      productsService.updateProduct(id, data)
  );
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  return useMutationWithErrorHandling(
    (id: string) => productsService.deleteProduct(id)
  );
}

/**
 * Hook to get all product categories
 */
export function useProductCategories() {
  return useQueryWithErrorHandling(
    ['product-categories'],
    () => productsService.getCategories()
  );
}

/**
 * Hook to search products by barcode
 */
export function useProductByBarcode(barcode: string | undefined) {
  return useQueryWithErrorHandling(
    ['product', 'barcode', barcode],
    () => productsService.getProductByBarcode(barcode!),
    {
      enabled: !!barcode, // Only fetch when barcode is provided
    }
  );
}
