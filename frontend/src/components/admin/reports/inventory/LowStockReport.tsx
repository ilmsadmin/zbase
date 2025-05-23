import { useState } from 'react';
import { Card, DataTable } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { getLowStockReport } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';

export default function LowStockReport() {
  const [warehouseId, setWarehouseId] = useState<string | undefined>(undefined);
  
  const { data, isLoading } = useQuery({
    queryKey: ['lowStockReport', warehouseId],
    queryFn: () => getLowStockReport(warehouseId),
    staleTime: 5 * 60 * 1000,
  });

  // Mock data if API doesn't return results yet
  const mockData = [
    { productId: '1', productName: 'Wireless Keyboard', sku: 'KB-001', currentStock: 3, minStockLevel: 5, reorderPoint: 10, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '2', productName: 'USB-C Hub', sku: 'HUB-003', currentStock: 2, minStockLevel: 5, reorderPoint: 10, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '3', productName: 'Wireless Mouse', sku: 'MS-002', currentStock: 4, minStockLevel: 5, reorderPoint: 10, warehouseId: '2', warehouseName: 'South Branch' },
    { productId: '4', productName: 'HDMI Cable 2m', sku: 'CBL-005', currentStock: 2, minStockLevel: 5, reorderPoint: 10, warehouseId: '2', warehouseName: 'South Branch' },
    { productId: '5', productName: 'Webcam HD', sku: 'CAM-007', currentStock: 1, minStockLevel: 3, reorderPoint: 5, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '6', productName: 'Bluetooth Speaker', sku: 'SPK-006', currentStock: 2, minStockLevel: 5, reorderPoint: 8, warehouseId: '3', warehouseName: 'East Store' },
    { productId: '7', productName: 'Monitor 24"', sku: 'MON-010', currentStock: 0, minStockLevel: 3, reorderPoint: 5, warehouseId: '1', warehouseName: 'Main Warehouse' },
    { productId: '8', productName: 'Office Chair', sku: 'CHR-009', currentStock: 1, minStockLevel: 2, reorderPoint: 5, warehouseId: '2', warehouseName: 'South Branch' },
  ];

  const displayData = data || mockData;

  // Warehouse options could come from an API call
  const warehouseOptions = [
    { id: undefined, name: 'All Warehouses' },
    { id: '1', name: 'Main Warehouse' },
    { id: '2', name: 'South Branch' },
    { id: '3', name: 'East Store' },
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
      cell: ({ row }: any) => {
        const stock = row.original.currentStock;
        let colorClass = 'text-yellow-600';
        
        if (stock === 0) {
          colorClass = 'text-red-600 font-bold';
        } else if (stock <= row.original.minStockLevel / 2) {
          colorClass = 'text-red-600';
        }
        
        return <span className={colorClass}>{stock}</span>;
      },
    },
    {
      header: 'Min Stock Level',
      accessorKey: 'minStockLevel',
    },
    {
      header: 'Reorder Point',
      accessorKey: 'reorderPoint',
    },
    {
      header: 'Status',
      cell: ({ row }: any) => {
        const stock = row.original.currentStock;
        let status = 'Low Stock';
        let colorClass = 'bg-yellow-100 text-yellow-800';
        
        if (stock === 0) {
          status = 'Out of Stock';
          colorClass = 'bg-red-100 text-red-800';
        } else if (stock <= row.original.minStockLevel / 2) {
          status = 'Critical Stock';
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
        <button className="text-primary text-sm hover:underline">
          Create Order
        </button>
      ),
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('low-stock', { 
        warehouseId 
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `low-stock-report.${format}`;
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

  const criticalCount = displayData.filter(item => item.currentStock === 0).length;
  const lowCount = displayData.filter(item => item.currentStock > 0 && item.currentStock <= item.minStockLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-red-50 border-l-4 border-red-500">
          <h3 className="font-semibold text-red-700">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-800 mt-2">{criticalCount} products</p>
          <p className="text-sm text-red-600 mt-1">Need immediate attention</p>
        </Card>
        
        <Card className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-700">Low Stock</h3>
          <p className="text-2xl font-bold text-yellow-800 mt-2">{lowCount} products</p>
          <p className="text-sm text-yellow-600 mt-1">Below minimum stock level</p>
        </Card>
      </div>
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Products At or Below Minimum Stock Level</h3>
          
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
