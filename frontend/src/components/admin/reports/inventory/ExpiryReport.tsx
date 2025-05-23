import { useState } from 'react';
import { Card, DataTable } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { getExpiryReport } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';
import { format } from 'date-fns';

export default function ExpiryReport() {
  const [warehouseId, setWarehouseId] = useState<string | undefined>(undefined);
  const [daysThreshold, setDaysThreshold] = useState<number>(30);
  
  const { data, isLoading } = useQuery({
    queryKey: ['expiryReport', warehouseId, daysThreshold],
    queryFn: () => getExpiryReport(daysThreshold, warehouseId),
    staleTime: 5 * 60 * 1000,
  });

  // Mock data if API doesn't return results yet
  const mockData = [
    { productId: '1', productName: 'Organic Flour', sku: 'FL-001', currentStock: 8, expiryDate: '2025-06-15', daysToExpiry: 21, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '2', productName: 'Almond Milk', sku: 'ML-002', currentStock: 12, expiryDate: '2025-06-03', daysToExpiry: 9, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '3', productName: 'Protein Bars', sku: 'PB-003', currentStock: 24, expiryDate: '2025-06-25', daysToExpiry: 31, warehouseId: '2', warehouseName: 'South Branch' },
    { productId: '4', productName: 'Greek Yogurt', sku: 'YG-004', currentStock: 15, expiryDate: '2025-05-28', daysToExpiry: 3, warehouseId: '2', warehouseName: 'South Branch' },
    { productId: '5', productName: 'Fresh Juice', sku: 'JC-005', currentStock: 7, expiryDate: '2025-05-27', daysToExpiry: 2, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '6', productName: 'Organic Eggs', sku: 'EG-006', currentStock: 18, expiryDate: '2025-06-07', daysToExpiry: 13, warehouseId: '3', warehouseName: 'East Store' },
    { productId: '7', productName: 'Whole Wheat Bread', sku: 'BR-007', currentStock: 5, expiryDate: '2025-05-26', daysToExpiry: 1, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '8', productName: 'Salad Mix', sku: 'SL-008', currentStock: 9, expiryDate: '2025-05-26', daysToExpiry: 1, warehouseId: '2', warehouseName: 'South Branch' },
  ];

  const displayData = data || mockData;

  // Warehouse options could come from an API call
  const warehouseOptions = [
    { id: undefined, name: 'All Warehouses' },
    { id: '1', name: 'Main Warehouse' },
    { id: '2', name: 'South Branch' },
    { id: '3', name: 'East Store' },
  ];

  const thresholdOptions = [
    { days: 7, label: '7 days' },
    { days: 14, label: '14 days' },
    { days: 30, label: '30 days' },
    { days: 60, label: '60 days' },
    { days: 90, label: '90 days' },
  ];

  const columns = [
    {
      header: 'Product',
      accessorKey: 'productName',
      cell: ({ row }: any) => (
        <div>
          <div>{row.original.productName}</div>
          <div className="text-xs text-gray-500">SKU: {row.original.sku}</div>
        </div>
      ),
    },
    {
      header: 'Warehouse',
      accessorKey: 'warehouseName',
    },
    {
      header: 'Current Stock',
      accessorKey: 'currentStock',
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate',
      cell: ({ row }: any) => format(new Date(row.original.expiryDate), 'MMM dd, yyyy'),
    },
    {
      header: 'Days to Expiry',
      accessorKey: 'daysToExpiry',
      cell: ({ row }: any) => {
        const days = row.original.daysToExpiry;
        let colorClass = 'text-yellow-600';
        
        if (days <= 3) {
          colorClass = 'text-red-600 font-bold';
        } else if (days <= 7) {
          colorClass = 'text-orange-600';
        }
        
        return <span className={colorClass}>{days} days</span>;
      },
    },
    {
      header: 'Status',
      cell: ({ row }: any) => {
        const days = row.original.daysToExpiry;
        let status = 'Expiring Soon';
        let colorClass = 'bg-yellow-100 text-yellow-800';
        
        if (days <= 3) {
          status = 'Critical';
          colorClass = 'bg-red-100 text-red-800';
        } else if (days <= 7) {
          status = 'Urgent';
          colorClass = 'bg-orange-100 text-orange-800';
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <button className="text-primary text-sm hover:underline">
            Discount
          </button>
          <button className="text-red-600 text-sm hover:underline">
            Write Off
          </button>
        </div>
      ),
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('expiry', { 
        warehouseId,
        daysThreshold
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expiry-report-${daysThreshold}-days.${format}`;
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

  const criticalCount = displayData.filter(item => item.daysToExpiry <= 3).length;
  const urgentCount = displayData.filter(item => item.daysToExpiry > 3 && item.daysToExpiry <= 7).length;
  const warningCount = displayData.filter(item => item.daysToExpiry > 7 && item.daysToExpiry <= 30).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value || undefined)}
          >
            {warehouseOptions.map(warehouse => (
              <option key={warehouse.id || 'all'} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
          
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={daysThreshold}
            onChange={(e) => setDaysThreshold(Number(e.target.value))}
          >
            {thresholdOptions.map(option => (
              <option key={option.days} value={option.days}>
                Next {option.label}
              </option>
            ))}
          </select>
        </div>
        
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
        <Card className="p-4 bg-red-50 border-l-4 border-red-500">
          <h3 className="font-semibold text-red-700">Critical (0-3 days)</h3>
          <p className="text-2xl font-bold text-red-800 mt-2">{criticalCount} products</p>
          <p className="text-sm text-red-600 mt-1">Need immediate action</p>
        </Card>
        
        <Card className="p-4 bg-orange-50 border-l-4 border-orange-500">
          <h3 className="font-semibold text-orange-700">Urgent (4-7 days)</h3>
          <p className="text-2xl font-bold text-orange-800 mt-2">{urgentCount} products</p>
          <p className="text-sm text-orange-600 mt-1">Require attention soon</p>
        </Card>
        
        <Card className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-700">Warning (8-30 days)</h3>
          <p className="text-2xl font-bold text-yellow-800 mt-2">{warningCount} products</p>
          <p className="text-sm text-yellow-600 mt-1">Monitor closely</p>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Products Expiring Within {daysThreshold} Days</h3>
          
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
