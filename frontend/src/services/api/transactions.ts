// This file provides backward compatibility for components still importing from @/services/api/transactions
// It re-exports the services from @/lib/services/transactionsService

import { transactionsService } from '@/lib/services/transactionsService';

export const transactionsApi = {
  // Get all transactions with filters
  getTransactions: async (filters = {}) => {
    const data = await transactionsService.getTransactions(filters);
    return { data: data.items || [], meta: data.meta };
  },

  // Get a single transaction by ID
  getTransaction: async (id) => {
    return transactionsService.getTransactionById(id);
  },

  // Create a new transaction
  createTransaction: async (transactionData) => {
    return transactionsService.createTransaction(transactionData);
  },

  // Update an existing transaction
  updateTransaction: async (id, transactionData) => {
    return transactionsService.updateTransaction(id, transactionData);
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    return transactionsService.deleteTransaction(id);
  },

  // Get transaction statistics
  getStatistics: async (params = {}) => {
    return transactionsService.getTransactionStatistics(params);
  },

  // Get aging analysis (overdue payments)
  getAgingAnalysis: async () => {
    return transactionsService.getAgingAnalysis();
  },

  // Get debt summary by customer
  getDebtSummary: async () => {
    return transactionsService.getDebtSummary();
  }
};
