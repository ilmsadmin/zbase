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

export interface DebtSummary {
  id: string;
  name: string;
  totalDebt: number;
  overdue: number;
  current: number;
  upcoming: number;
  lastTransactionDate: string;
}

export interface AgingAnalysis {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus: number;
  total: number;
}
