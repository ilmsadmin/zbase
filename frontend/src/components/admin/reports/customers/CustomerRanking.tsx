import { useState } from 'react';
import { Card, DataTable, DateRangePicker } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { getCustomerRankingReport } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';
import { format, subDays } from 'date-fns';

export default function CustomerRanking() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { data, isLoading } = useQuery({
    queryKey: ['customerRankingReport', dateRange],
    queryFn: () => getCustomerRankingReport(dateRange),
    staleTime: 5 * 60 * 1000,
  });

  // Mock data if API doesn't return results yet
  const mockData = [
    { customerId: '1', customerName: 'ABC Company', totalSpent: 12450.75, orderCount: 24, averageOrderValue: 518.78, lastPurchaseDate: '2025-05-15' },
    { customerId: '2', customerName: 'XYZ Corporation', totalSpent: 9875.50, orderCount: 18, averageOrderValue: 548.64, lastPurchaseDate: '2025-05-20' },
    { customerId: '3', customerName: 'John Smith', totalSpent: 7650.25, orderCount: 15, averageOrderValue: 510.02, lastPurchaseDate: '2025-05-10' },
    { customerId: '4', customerName: 'Tech Solutions Ltd', totalSpent: 6890.00, orderCount: 12, averageOrderValue: 574.17, lastPurchaseDate: '2025-05-18' },
    { customerId: '5', customerName: 'Sarah Williams', totalSpent: 5450.75, orderCount: 10, averageOrderValue: 545.08, lastPurchaseDate: '2025-05-05' },
    { customerId: '6', customerName: 'Global Enterprises', totalSpent: 4950.50, orderCount: 9, averageOrderValue: 550.06, lastPurchaseDate: '2025-05-22' },
    { customerId: '7', customerName: 'Local Store', totalSpent: 3875.25, orderCount: 8, averageOrderValue: 484.41, lastPurchaseDate: '2025-05-12' },
    { customerId: '8', customerName: 'David Johnson', totalSpent: 3250.00, orderCount: 7, averageOrderValue: 464.29, lastPurchaseDate: '2025-05-03' },
    { customerId: '9', customerName: 'City Services', totalSpent: 2950.75, orderCount: 6, averageOrderValue: 491.79, lastPurchaseDate: '2025-05-19' },
    { customerId: '10', customerName: 'Smart Solutions', totalSpent: 2450.50, orderCount: 5, averageOrderValue: 490.10, lastPurchaseDate: '2025-05-08' },
  ];

  const displayData = data || mockData;

  const columns = [
    {
      header: 'Rank',
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Total Spent',
      accessorKey: 'totalSpent',
      cell: ({ row }: any) => `$${row.original.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Orders',
      accessorKey: 'orderCount',
    },
    {
      header: 'Average Order',
      accessorKey: 'averageOrderValue',
      cell: ({ row }: any) => `$${row.original.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Last Purchase',
      accessorKey: 'lastPurchaseDate',
      cell: ({ row }: any) => format(new Date(row.original.lastPurchaseDate), 'MMM dd, yyyy'),
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <button 
            className="text-primary text-sm hover:underline"
            onClick={() => window.location.href = `/admin/reports/customers?tab=purchase-analysis&customerId=${row.original.customerId}`}
          >
            Analysis
          </button>
          <button 
            className="text-green-600 text-sm hover:underline"
            onClick={() => window.location.href = `/admin/customers/${row.original.customerId}`}
          >
            Profile
          </button>
        </div>
      ),
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('customer-ranking', { 
        dateRange
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-ranking-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      // Show error toast
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-md"></div>;
  }

  // Calculate totals
  const totalSpent = displayData.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = displayData.reduce((sum, customer) => sum + customer.orderCount, 0);
  const averageOrderValue = totalSpent / totalOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <DateRangePicker
          value={{
            from: new Date(dateRange.startDate),
            to: new Date(dateRange.endDate)
          }}
          onChange={(range) => {
            if (range?.from && range?.to) {
              setDateRange({
                startDate: format(range.from, 'yyyy-MM-dd'),
                endDate: format(range.to, 'yyyy-MM-dd')
              });
            }
          }}
        />
        
        <div className="relative inline-block">
          <button className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm flex items-center">
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
            <div className="py-1">
              <button 
                onClick={() => handleExport('pdf')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export as PDF
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export as Excel
              </button>
              <button 
                onClick={() => handleExport('csv')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50">
          <h3 className="font-semibold text-blue-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-blue-600 mt-1">From top customers</p>
        </Card>
        
        <Card className="p-4 bg-green-50">
          <h3 className="font-semibold text-green-700">Total Orders</h3>
          <p className="text-2xl font-bold text-green-800 mt-2">{totalOrders}</p>
          <p className="text-sm text-green-600 mt-1">During selected period</p>
        </Card>
        
        <Card className="p-4 bg-purple-50">
          <h3 className="font-semibold text-purple-700">Average Order Value</h3>
          <p className="text-2xl font-bold text-purple-800 mt-2">
            ${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-purple-600 mt-1">Across all orders</p>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Top Customers by Revenue</h3>
          
          <DataTable
            columns={columns}
            data={displayData}
            pagination
          />
        </div>
      </Card>
    </div>
  );
}
