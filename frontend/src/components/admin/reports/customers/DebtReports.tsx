import { useState } from 'react';
import { Card, DataTable } from '@/components/ui';
import { PieChart } from '@/components/ui/Charts';
import { useQuery } from '@tanstack/react-query';
import { getCustomerDebtReport } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';

export default function DebtReports() {
  const { data, isLoading } = useQuery({
    queryKey: ['customerDebtReport'],
    queryFn: getCustomerDebtReport,
    staleTime: 5 * 60 * 1000,
  });

  // Mock data if API doesn't return results yet
  const mockData = [
    { customerId: '1', customerName: 'ABC Company', totalDebt: 5250.75, dueAmount: 2500.00, overdueAmount: 750.75, agingBuckets: [{ range: '0-30 days', amount: 2500.00 }, { range: '31-60 days', amount: 2000.00 }, { range: '61-90 days', amount: 750.75 }, { range: '90+ days', amount: 0 }] },
    { customerId: '2', customerName: 'XYZ Corporation', totalDebt: 3875.50, dueAmount: 1875.50, overdueAmount: 2000.00, agingBuckets: [{ range: '0-30 days', amount: 1875.50 }, { range: '31-60 days', amount: 1000.00 }, { range: '61-90 days', amount: 1000.00 }, { range: '90+ days', amount: 0 }] },
    { customerId: '3', customerName: 'Tech Solutions Ltd', totalDebt: 2950.25, dueAmount: 950.25, overdueAmount: 2000.00, agingBuckets: [{ range: '0-30 days', amount: 950.25 }, { range: '31-60 days', amount: 500.00 }, { range: '61-90 days', amount: 500.00 }, { range: '90+ days', amount: 1000.00 }] },
    { customerId: '4', customerName: 'Global Enterprises', totalDebt: 1800.00, dueAmount: 800.00, overdueAmount: 1000.00, agingBuckets: [{ range: '0-30 days', amount: 800.00 }, { range: '31-60 days', amount: 1000.00 }, { range: '61-90 days', amount: 0 }, { range: '90+ days', amount: 0 }] },
    { customerId: '5', customerName: 'Local Store', totalDebt: 1250.75, dueAmount: 1250.75, overdueAmount: 0, agingBuckets: [{ range: '0-30 days', amount: 1250.75 }, { range: '31-60 days', amount: 0 }, { range: '61-90 days', amount: 0 }, { range: '90+ days', amount: 0 }] },
  ];

  const displayData = data || mockData;

  const columns = [
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Total Debt',
      accessorKey: 'totalDebt',
      cell: ({ row }: any) => `$${row.original.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Due',
      accessorKey: 'dueAmount',
      cell: ({ row }: any) => `$${row.original.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Overdue',
      accessorKey: 'overdueAmount',
      cell: ({ row }: any) => {
        const amount = row.original.overdueAmount;
        return amount > 0 
          ? <span className="text-red-600 font-medium">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          : <span className="text-green-600">$0.00</span>;
      },
    },
    {
      header: 'Debt Aging',
      cell: ({ row }: any) => (
        <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${(row.original.agingBuckets[0].amount / row.original.totalDebt) * 100}%` }}
              title={`0-30 days: $${row.original.agingBuckets[0].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            ></div>
            <div 
              className="bg-yellow-500 h-full" 
              style={{ width: `${(row.original.agingBuckets[1].amount / row.original.totalDebt) * 100}%` }}
              title={`31-60 days: $${row.original.agingBuckets[1].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            ></div>
            <div 
              className="bg-orange-500 h-full" 
              style={{ width: `${(row.original.agingBuckets[2].amount / row.original.totalDebt) * 100}%` }}
              title={`61-90 days: $${row.original.agingBuckets[2].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            ></div>
            <div 
              className="bg-red-500 h-full" 
              style={{ width: `${(row.original.agingBuckets[3].amount / row.original.totalDebt) * 100}%` }}
              title={`90+ days: $${row.original.agingBuckets[3].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            ></div>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <button 
            className="text-primary text-sm hover:underline"
            onClick={() => window.location.href = `/admin/customers/${row.original.customerId}`}
          >
            View
          </button>
          <button className="text-green-600 text-sm hover:underline">
            Collect
          </button>
        </div>
      ),
    },
  ];

  // Prepare chart data for aging summary
  const agingSummary = {
    current: displayData.reduce((sum, c) => sum + c.agingBuckets[0].amount, 0),
    days30to60: displayData.reduce((sum, c) => sum + c.agingBuckets[1].amount, 0),
    days61to90: displayData.reduce((sum, c) => sum + c.agingBuckets[2].amount, 0),
    days90plus: displayData.reduce((sum, c) => sum + c.agingBuckets[3].amount, 0),
  };

  const chartData = {
    labels: ['0-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
    datasets: [
      {
        data: [
          agingSummary.current,
          agingSummary.days30to60,
          agingSummary.days61to90,
          agingSummary.days90plus,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // Green
          'rgba(234, 179, 8, 0.7)',   // Yellow
          'rgba(249, 115, 22, 0.7)',  // Orange
          'rgba(239, 68, 68, 0.7)',   // Red
        ],
      },
    ],
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('customer-debt', {}, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-debt-report.${format}`;
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
  const totalDebt = displayData.reduce((sum, c) => sum + c.totalDebt, 0);
  const totalDue = displayData.reduce((sum, c) => sum + c.dueAmount, 0);
  const totalOverdue = displayData.reduce((sum, c) => sum + c.overdueAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
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
          <h3 className="font-semibold text-blue-700">Total Debt</h3>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-blue-600 mt-1">Across all customers</p>
        </Card>
        
        <Card className="p-4 bg-green-50">
          <h3 className="font-semibold text-green-700">Due (Not Overdue)</h3>
          <p className="text-2xl font-bold text-green-800 mt-2">
            ${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-600 mt-1">{Math.round((totalDue / totalDebt) * 100)}% of total debt</p>
        </Card>
        
        <Card className="p-4 bg-red-50">
          <h3 className="font-semibold text-red-700">Overdue</h3>
          <p className="text-2xl font-bold text-red-800 mt-2">
            ${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-red-600 mt-1">{Math.round((totalOverdue / totalDebt) * 100)}% of total debt</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Customer Debt Details</h3>
              
              <DataTable
                columns={columns}
                data={displayData}
                pagination
              />
            </div>
          </Card>
        </div>
        
        <div>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Debt Aging Summary</h3>
              
              <div className="h-64 mb-6">
                <PieChart data={chartData} />
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">0-30 Days</span>
                  </div>
                  <span className="font-medium">
                    ${agingSummary.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">31-60 Days</span>
                  </div>
                  <span className="font-medium">
                    ${agingSummary.days30to60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">61-90 Days</span>
                  </div>
                  <span className="font-medium">
                    ${agingSummary.days61to90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">90+ Days</span>
                  </div>
                  <span className="font-medium">
                    ${agingSummary.days90plus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
