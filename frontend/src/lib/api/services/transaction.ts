import { apiClient } from "../client";

// Define transaction types based on the API
export enum TransactionType {
  RECEIPT = 'receipt',
  PAYMENT = 'payment',
}

export enum TransactionMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  FAILED = 'failed',
}

export enum TransactionCategory {
  SALE = 'sale',
  PURCHASE = 'purchase',
  EXPENSE = 'expense',
  INCOME = 'income',
  REFUND = 'refund',
  OTHER = 'other',
}

// Interface for a Transaction
export interface Transaction {
  id: number;
  code: string;
  transactionType: TransactionType;
  transactionMethod: TransactionMethod;
  amount: number;
  transactionDate: string;
  dueDate?: string;
  status: TransactionStatus;
  category?: TransactionCategory;
  reference?: string;
  customerId?: number;
  partnerId?: number;
  invoiceId?: number;
  referenceType?: string;
  referenceId?: number;
  userId: number;
  shiftId?: number;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  receiptNumber?: string;
  attachments?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  customer?: {
    id: number;
    name: string;
    code: string;
  };
  partner?: {
    id: number;
    name: string;
    code: string;
  };
  invoice?: {
    id: number;
    code: string;
    totalAmount: number;
    status: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  shift?: {
    id: number;
    startTime: string;
    endTime?: string;
  };
}

// Interface for creating a transaction
export interface CreateTransactionDto {
  code?: string;
  transactionType: TransactionType;
  transactionMethod: TransactionMethod;
  amount: number;
  transactionDate?: Date;
  dueDate?: Date;
  status?: TransactionStatus;
  category?: TransactionCategory;
  reference?: string;
  customerId?: number;
  partnerId?: number;
  invoiceId?: number;
  referenceType?: string;
  referenceId?: number;
  userId: number;
  shiftId?: number;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  receiptNumber?: string;
  attachments?: string;
  notes?: string;
}

// Interface for updating a transaction
export interface UpdateTransactionDto {
  transactionMethod?: TransactionMethod;
  amount?: number;
  transactionDate?: Date;
  dueDate?: Date;
  status?: TransactionStatus;
  category?: TransactionCategory;
  reference?: string;
  customerId?: number;
  partnerId?: number;
  paymentMethod?: string;
  accountNumber?: string;
  bankName?: string;
  receiptNumber?: string;
  attachments?: string;
  notes?: string;
}

// Interface for filtering transactions
export interface TransactionFilter {
  code?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  partnerId?: string;
  invoiceId?: string;
  userId?: string;
  shiftId?: string;
}

// Response interface with pagination
export interface TransactionResponse {
  items: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Transaction service
export const transactionService = {
  getAllTransactions: async (filters: TransactionFilter = {}, page: number = 1, limit: number = 20): Promise<TransactionResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Add filter parameters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/transactions?${queryParams.toString()}`);
    return response;
  },

  getTransactionById: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response;
  },

  getTransactionByCode: async (code: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/code/${code}`);
    return response;
  },

  createTransaction: async (transaction: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', transaction);
    return response;
  },

  updateTransaction: async (id: number, transaction: UpdateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.patch(`/transactions/${id}`, transaction);
    return response;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};
