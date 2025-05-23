import { apiClient } from '@/lib/api-client';
import { Transaction, TransactionFilters, CreateTransactionDto } from '@/types/transaction';

export const transactionsApi = {
  getTransactions: async (filters?: TransactionFilters): Promise<{ data: Transaction[], total: number }> => {
    return apiClient.get('/api/transactions', { params: filters });
  },
  
  getTransaction: async (id: string): Promise<Transaction> => {
    return apiClient.get(`/api/transactions/${id}`);
  },
  
  createTransaction: async (transaction: CreateTransactionDto): Promise<Transaction> => {
    return apiClient.post('/api/transactions', transaction);
  },
  
  updateTransaction: async (id: string, transaction: Partial<CreateTransactionDto>): Promise<Transaction> => {
    return apiClient.patch(`/api/transactions/${id}`, transaction);
  },
  
  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/transactions/${id}`);
  },
  // Debt management
  getCustomerDebts: async (customerId?: string): Promise<{ data: any[], total: number }> => {
    return apiClient.get('/api/transactions/debts/customers', { params: { customerId } });
  },
  
  getPartnerDebts: async (partnerId?: string): Promise<{ data: any[], total: number }> => {
    return apiClient.get('/api/transactions/debts/partners', { params: { partnerId } });
  },
  
  getAgingAnalysis: async (type: 'customers' | 'partners'): Promise<any> => {
    return apiClient.get(`/api/transactions/aging/${type}`);
  }
};
