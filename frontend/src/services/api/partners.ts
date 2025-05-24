// This file provides backward compatibility for components still importing from @/services/api/partners
// It re-exports the services from @/lib/services/partnersService

import { partnersService } from '@/lib/services/partnersService';

export const partnersApi = {
  // Get all partners with filters
  getPartners: async (filters = {}) => {
    const data = await partnersService.getPartners(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single partner by ID
  getPartner: async (id) => {
    return partnersService.getPartnerById(id);
  },

  // Create a new partner
  createPartner: async (partnerData) => {
    return partnersService.createPartner(partnerData);
  },

  // Update an existing partner
  updatePartner: async (id, partnerData) => {
    return partnersService.updatePartner(id, partnerData);
  },

  // Delete a partner
  deletePartner: async (id) => {
    return partnersService.deletePartner(id);
  },

  // Bulk delete partners
  bulkDeletePartners: async (ids) => {
    return partnersService.bulkDeletePartners(ids);
  }
};
