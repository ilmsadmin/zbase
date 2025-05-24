// This file provides backward compatibility for components still importing from @/services/api/customers
// It re-exports the services from @/lib/services/customersService

import { customersService } from '@/lib/services/customersService';

export const customersApi = {
  // Get all customers with filters
  getCustomers: async (filters = {}) => {
    const data = await customersService.getCustomers(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single customer by ID
  getCustomer: async (id) => {
    return customersService.getCustomerById(id);
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    return customersService.createCustomer(customerData);
  },

  // Update an existing customer
  updateCustomer: async (id, customerData) => {
    return customersService.updateCustomer(id, customerData);
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    return customersService.deleteCustomer(id);
  },

  // Get customer groups
  getCustomerGroups: async () => {
    const response = await customersService.getCustomerGroups();
    return response.items || [];
  },
  
  // Create a customer group
  createCustomerGroup: async (groupData) => {
    return customersService.createCustomerGroup(groupData);
  },
  
  // Update a customer group
  updateCustomerGroup: async (id, groupData) => {
    return customersService.updateCustomerGroup(id, groupData);
  },
  
  // Delete a customer group
  deleteCustomerGroup: async (id) => {
    return customersService.deleteCustomerGroup(id);
  }
};
