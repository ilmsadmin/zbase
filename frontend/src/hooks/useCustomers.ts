"use client";

import { useQueryWithErrorHandling, useMutationWithErrorHandling } from '@/lib/react-query/hooks';
import { 
  Customer, 
  CustomerGroup, 
  CustomerQueryParams,
  CustomerTransaction,
  customersService 
} from '@/lib/services/customersService';

/**
 * Hook to get customers with optional filtering
 */
export function useCustomers(params?: CustomerQueryParams) {
  return useQueryWithErrorHandling(
    ['customers', params],
    () => customersService.getCustomers(params),
    {
      placeholderData: (previousData) => previousData,
    }
  );
}

/**
 * Hook to get a customer by ID
 */
export function useCustomer(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['customer', id],
    () => customersService.getCustomerById(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to create a new customer
 */
export function useCreateCustomer() {
  return useMutationWithErrorHandling(
    (newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'balance'>) => 
      customersService.createCustomer(newCustomer)
  );
}

/**
 * Hook to update a customer
 */
export function useUpdateCustomer() {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: string; data: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'balance'>> }) =>
      customersService.updateCustomer(id, data)
  );
}

/**
 * Hook to delete a customer
 */
export function useDeleteCustomer() {
  return useMutationWithErrorHandling(
    (id: string) => customersService.deleteCustomer(id)
  );
}

/**
 * Hook to get customer groups
 */
export function useCustomerGroups() {
  return useQueryWithErrorHandling(
    ['customer-groups'],
    () => customersService.getCustomerGroups()
  );
}

/**
 * Hook to get a customer group by ID
 */
export function useCustomerGroup(id: string | undefined) {
  return useQueryWithErrorHandling(
    ['customer-group', id],
    () => customersService.getCustomerGroupById(id!),
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook to create a new customer group
 */
export function useCreateCustomerGroup() {
  return useMutationWithErrorHandling(
    (newGroup: Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>) => 
      customersService.createCustomerGroup(newGroup)
  );
}

/**
 * Hook to update a customer group
 */
export function useUpdateCustomerGroup() {
  return useMutationWithErrorHandling(
    ({ id, data }: { id: string; data: Partial<Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>> }) =>
      customersService.updateCustomerGroup(id, data)
  );
}

/**
 * Hook to delete a customer group
 */
export function useDeleteCustomerGroup() {
  return useMutationWithErrorHandling(
    (id: string) => customersService.deleteCustomerGroup(id)
  );
}

/**
 * Hook to get customer transactions
 */
export function useCustomerTransactions(customerId: string | undefined) {
  return useQueryWithErrorHandling(
    ['customer-transactions', customerId],
    () => customersService.getCustomerTransactions(customerId!),
    {
      enabled: !!customerId,
    }
  );
}
