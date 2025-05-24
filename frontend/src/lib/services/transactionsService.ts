import api from '../api';

// Define interfaces
export interface Transaction {
  id: string;
  code: string;
  transactionType: 'receipt' | 'payment';
  transactionMethod: string;
  amount: number;
  transactionDate: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'canceled' | 'failed';
  category?: string;
  reference?: string;
  customerId?: string;
  customerName?: string;
  partnerId?: string;
  partnerName?: string;
  invoiceId?: string;
  invoiceCode?: string;
  referenceType?: string;
  referenceId?: string;
  userId: string;
  userName: string;
  shiftId?: string;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  search?: string;
  transactionType?: 'receipt' | 'payment' | string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  customerId?: string;
  partnerId?: string;
}

export interface CreateTransactionDto {
  transactionType: 'receipt' | 'payment';
  transactionMethod: string;
  amount: number;
  transactionDate?: string;
  dueDate?: string;
  status?: string;
  category?: string;
  reference?: string;
  customerId?: string;
  partnerId?: string;
  invoiceId?: string;
  referenceType?: string;
  referenceId?: string;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
  attachments?: string[];
}

const transactionsApi = {
  getTransactions: async (filters?: TransactionFilters): Promise<{ items: Transaction[], meta: any }> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },
  
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  
  createTransaction: async (transaction: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  
  updateTransaction: async (id: string, transaction: Partial<CreateTransactionDto>): Promise<Transaction> => {
    const response = await api.patch(`/transactions/${id}`, transaction);
    return response.data;
  },
  
  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  // Debt management
  getCustomerDebts: async (customerId?: string): Promise<{ data: any[], total: number }> => {
    const response = await api.get('/transactions/debts/customers', { params: { customerId } });
    return response.data;
  },
  
  getPartnerDebts: async (partnerId?: string): Promise<{ data: any[], total: number }> => {
    const response = await api.get('/transactions/debts/partners', { params: { partnerId } });
    return response.data;
  },
  
  getAgingAnalysis: async (): Promise<any> => {
    const response = await api.get(`/transactions/aging/customers`);
    return response.data;
  },
  
  getTransactionStatistics: async (params: any): Promise<any> => {
    const response = await api.get('/transactions/statistics', { params });
    return response.data;
  },
  
  getDebtSummary: async (): Promise<any> => {
    const response = await api.get('/transactions/debts/summary');
    return response.data;
  }
};

// Export both as named export and default export to support different import styles
export const transactionsService = transactionsApi;
export default transactionsApi;
