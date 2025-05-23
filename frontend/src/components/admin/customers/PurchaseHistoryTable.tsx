"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/lib/utils';

interface PurchaseHistoryTableProps {
  customerId: string;
}

// Sample data structure for purchase history
interface PurchaseItem {
  id: string;
  invoiceNumber: string;
  date: string;
  total: number;
  status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID' | 'CANCELLED';
  items: number;
}

export function PurchaseHistoryTable({ customerId }: PurchaseHistoryTableProps) {
  // This would be replaced with actual data from an API call
  const samplePurchases: PurchaseItem[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      date: '2025-05-15T00:00:00Z',
      total: 1250000,
      status: 'PAID',
      items: 3
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      date: '2025-05-10T00:00:00Z',
      total: 750000,
      status: 'PARTIALLY_PAID',
      items: 2
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      date: '2025-05-05T00:00:00Z',
      total: 2500000,
      status: 'UNPAID',
      items: 5
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'PARTIALLY_PAID':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Partially Paid</span>;
      case 'UNPAID':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Unpaid</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Purchase History</h3>
        <Button variant="outline" size="sm">View All Invoices</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Invoice #</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {samplePurchases.length > 0 ? (
              samplePurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{purchase.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(purchase.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{purchase.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium">{formatCurrency(purchase.total)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(purchase.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Print
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No purchase history found for this customer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
