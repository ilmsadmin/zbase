import api from '../api';

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
  getTransactions: async (filters?: TransactionFilters): Promise<{ data: Transaction[], total: number }> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },
  
  getTransaction: async (id: string): Promise<Transaction> => {
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
  
  getAgingAnalysis: async (type: 'customers' | 'partners'): Promise<any> => {
    const response = await api.get(`/transactions/aging/${type}`);
    return response.data;
  }
};

export default transactionsApi;
