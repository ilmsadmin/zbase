import { useState } from 'react';
import { Card, DataTable, DateRangePicker } from '@/components/ui';
import { BarChart } from '@/components/ui/Charts';
import { useQuery } from '@tanstack/react-query';
import { getCustomerPurchaseAnalysis } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';
import { format, subDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';

export default function PurchaseAnalysis() {
  const searchParams = useSearchParams();
  
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [customerId, setCustomerId] = useState<string>(
    searchParams?.get('customerId') || ''
  );
  
  const { data, isLoading } = useQuery({
    queryKey: ['customerPurchaseAnalysis', customerId, dateRange],
    queryFn: () => customerId ? getCustomerPurchaseAnalysis(customerId, dateRange) : null,
    staleTime: 5 * 60 * 1000,
    enabled: !!customerId
  });

  // Mock data if API doesn't return results yet
  const mockData = {
    customerId: '1',
    customerName: 'ABC Company',
    purchaseHistory: [
      { date: '2025-03-01', amount: 1250.75, products: [{ productId: '1', productName: 'Wireless Keyboard', quantity: 5, amount: 250.25 }, { productId: '2', productName: 'Wireless Mouse', quantity: 5, amount: 200.50 }, { productId: '3', productName: 'USB-C Hub', quantity: 10, amount: 800.00 }] },
      { date: '2025-03-15', amount: 980.50, products: [{ productId: '4', productName: 'Laptop Stand', quantity: 3, amount: 120.75 }, { productId: '5', productName: 'HDMI Cable 2m', quantity: 10, amount: 159.75 }, { productId: '7', productName: 'Webcam HD', quantity: 7, amount: 700.00 }] },
      { date: '2025-04-02', amount: 1470.25, products: [{ productId: '1', productName: 'Wireless Keyboard', quantity: 3, amount: 150.15 }, { productId: '6', productName: 'Bluetooth Speaker', quantity: 5, amount: 350.25 }, { productId: '9', productName: 'Office Chair', quantity: 5, amount: 969.85 }] },
      { date: '2025-04-18', amount: 2350.00, products: [{ productId: '10', productName: 'Monitor 24"', quantity: 5, amount: 1250.00 }, { productId: '8', productName: 'Desk Lamp', quantity: 10, amount: 350.00 }, { productId: '3', productName: 'USB-C Hub', quantity: 10, amount: 750.00 }] },
      { date: '2025-05-05', amount: 1840.75, products: [{ productId: '1', productName: 'Wireless Keyboard', quantity: 4, amount: 200.20 }, { productId: '2', productName: 'Wireless Mouse', quantity: 4, amount: 160.40 }, { productId: '10', productName: 'Monitor 24"', quantity: 3, amount: 750.00 }, { productId: '7', productName: 'Webcam HD', quantity: 8, amount: 730.15 }] },
      { date: '2025-05-15', amount: 4550.50, products: [{ productId: '9', productName: 'Office Chair', quantity: 15, amount: 2895.50 }, { productId: '8', productName: 'Desk Lamp', quantity: 20, amount: 700.00 }, { productId: '4', productName: 'Laptop Stand', quantity: 12, amount: 475.00 }, { productId: '5', productName: 'HDMI Cable 2m', quantity: 30, amount: 480.00 }] },
    ],
    favoriteProducts: [
      { productId: '9', productName: 'Office Chair', purchaseCount: 20, totalSpent: 3865.35 },
      { productId: '1', productName: 'Wireless Keyboard', purchaseCount: 12, totalSpent: 600.60 },
      { productId: '10', productName: 'Monitor 24"', purchaseCount: 8, totalSpent: 2000.00 },
      { productId: '3', productName: 'USB-C Hub', purchaseCount: 20, totalSpent: 1550.00 },
      { productId: '7', productName: 'Webcam HD', purchaseCount: 15, totalSpent: 1430.15 },
    ]
  };

  // Customer options could come from an API call
  const customerOptions = [
    { id: '1', name: 'ABC Company' },
    { id: '2', name: 'XYZ Corporation' },
    { id: '3', name: 'John Smith' },
    { id: '4', name: 'Tech Solutions Ltd' },
    { id: '5', name: 'Sarah Williams' },
  ];

  const purchaseColumns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: any) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: any) => `$${row.original.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Products',
      cell: ({ row }: any) => {
        const productCount = row.original.products.length;
        const totalQuantity = row.original.products.reduce((sum: number, p: any) => sum + p.quantity, 0);
        return `${productCount} products (${totalQuantity} items)`;
      },
    },
    {
      header: 'Details',
      cell: ({ row }: any) => (
        <button className="text-primary text-sm hover:underline">
          View Invoice
        </button>
      ),
    },
  ];

  const favoriteProductsColumns = [
    {
      header: 'Product',
      accessorKey: 'productName',
    },
    {
      header: 'Purchase Count',
      accessorKey: 'purchaseCount',
    },
    {
      header: 'Total Spent',
      accessorKey: 'totalSpent',
      cell: ({ row }: any) => `$${row.original.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <button 
          className="text-primary text-sm hover:underline"
          onClick={() => window.location.href = `/admin/products/${row.original.productId}`}
        >
          View Product
        </button>
      ),
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('customer-purchase-analysis', { 
        customerId,
        dateRange
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-purchase-analysis-${customerId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      // Show error toast
    }
  };

  const displayData = data || (customerId ? mockData : null);

  // Prepare chart data if we have customer data
  const chartData = displayData ? {
    labels: displayData.purchaseHistory.map(p => format(new Date(p.date), 'MMM dd')),
    datasets: [
      {
        label: 'Purchase Amount',
        data: displayData.purchaseHistory.map(p => p.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Purchase Date',
        },
      },
    },
  };

  // Calculate total purchases
  const totalPurchases = displayData
    ? displayData.purchaseHistory.reduce((sum, p) => sum + p.amount, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Select a customer</option>
            {customerOptions.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          
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
        </div>
        
        {displayData && (
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
        )}
      </div>
      
      {!customerId && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Please select a customer to view purchase analysis</p>
            <p className="text-sm text-gray-400">
              You can also access this report from the Customer Ranking page
            </p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="animate-pulse h-96 bg-gray-100 rounded-md"></div>
      )}
      
      {displayData && (
        <>
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{displayData.customerName}</h2>
              <p className="text-gray-500">Purchase Analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700">Total Purchases</h3>
                <p className="text-2xl font-bold text-blue-800 mt-2">
                  ${totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {displayData.purchaseHistory.length} orders in selected period
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-700">Average Order</h3>
                <p className="text-2xl font-bold text-green-800 mt-2">
                  ${(totalPurchases / displayData.purchaseHistory.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 mt-1">Per order in selected period</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-700">Last Purchase</h3>
                <p className="text-2xl font-bold text-purple-800 mt-2">
                  {format(new Date(displayData.purchaseHistory[displayData.purchaseHistory.length - 1].date), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  ${displayData.purchaseHistory[displayData.purchaseHistory.length - 1].amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
              <div className="h-64 mb-6">
                <BarChart data={chartData!} options={chartOptions} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
                <DataTable
                  columns={purchaseColumns}
                  data={displayData.purchaseHistory}
                  pagination
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Favorite Products</h3>
                <DataTable
                  columns={favoriteProductsColumns}
                  data={displayData.favoriteProducts}
                  pagination={false}
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
