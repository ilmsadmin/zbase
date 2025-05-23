"use client";

import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/lib/react-query/hooks';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CustomerTransaction } from '@/lib/services/customersService';

interface CustomerTransactionsTableProps {
  transactions: CustomerTransaction[];
  isLoading: boolean;
}

export function CustomerTransactionsTable({ transactions, isLoading }: CustomerTransactionsTableProps) {
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Invoice</span>;
      case 'PAYMENT':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Payment</span>;
      case 'REFUND':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Refund</span>;
      case 'CREDIT_NOTE':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Credit Note</span>;
      case 'DEBIT_NOTE':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Debit Note</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Credit/Debt Transactions</h3>
      </div>
      
      <LoadingState isLoading={isLoading} isError={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTransactionTypeBadge(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.referenceId || '-'}
                      </div>
                      {transaction.referenceType && (
                        <div className="text-xs text-gray-500">{transaction.referenceType}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {transaction.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </LoadingState>
    </Card>
  );
}
