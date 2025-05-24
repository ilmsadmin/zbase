"use client";

import { useState } from 'react';
import { Card, DataTable, DateRangePicker } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { getInventoryMovementReport } from '@/services/api/reports';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReport } from '@/services/api/reports';
import { format, subDays } from 'date-fns';

export default function MovementReport() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [warehouseId, setWarehouseId] = useState<string | undefined>(undefined);
  
  const { data, isLoading } = useQuery({
    queryKey: ['inventoryMovementReport', dateRange, warehouseId],
    queryFn: () => getInventoryMovementReport(dateRange, warehouseId),
    staleTime: 5 * 60 * 1000,
  });

  // Mock data if API doesn't return results yet
  const mockData = [
    { productId: '1', productName: 'Wireless Keyboard', sku: 'KB-001', startingStock: 45, incomingStock: 20, outgoingStock: 18, adjustments: -2, currentStock: 45 },
    { productId: '2', productName: 'Wireless Mouse', sku: 'MS-002', startingStock: 38, incomingStock: 25, outgoingStock: 22, adjustments: 0, currentStock: 41 },
    { productId: '3', productName: 'USB-C Hub', sku: 'HUB-003', startingStock: 30, incomingStock: 15, outgoingStock: 20, adjustments: 0, currentStock: 25 },
    { productId: '4', productName: 'Laptop Stand', sku: 'STD-004', startingStock: 25, incomingStock: 10, outgoingStock: 8, adjustments: -1, currentStock: 26 },
    { productId: '5', productName: 'HDMI Cable 2m', sku: 'CBL-005', startingStock: 50, incomingStock: 30, outgoingStock: 28, adjustments: 0, currentStock: 52 },
    { productId: '6', productName: 'Bluetooth Speaker', sku: 'SPK-006', startingStock: 20, incomingStock: 15, outgoingStock: 12, adjustments: 0, currentStock: 23 },
    { productId: '7', productName: 'Webcam HD', sku: 'CAM-007', startingStock: 15, incomingStock: 20, outgoingStock: 18, adjustments: -1, currentStock: 16 },
    { productId: '8', productName: 'Desk Lamp', sku: 'LMP-008', startingStock: 18, incomingStock: 12, outgoingStock: 10, adjustments: 0, currentStock: 20 },
    { productId: '9', productName: 'Office Chair', sku: 'CHR-009', startingStock: 10, incomingStock: 15, outgoingStock: 8, adjustments: 0, currentStock: 17 },
    { productId: '10', productName: 'Monitor 24"', sku: 'MON-010', startingStock: 12, incomingStock: 10, outgoingStock: 15, adjustments: 0, currentStock: 7 },
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
      header: 'Starting Stock',
      accessorKey: 'startingStock',
    },
    {
      header: 'Incoming',
      accessorKey: 'incomingStock',
      cell: ({ row }: any) => (
        <span className="text-green-600">+{row.original.incomingStock}</span>
      ),
    },
    {
      header: 'Outgoing',
      accessorKey: 'outgoingStock',
      cell: ({ row }: any) => (
        <span className="text-red-600">-{row.original.outgoingStock}</span>
      ),
    },
    {
      header: 'Adjustments',
      accessorKey: 'adjustments',
      cell: ({ row }: any) => {
        const value = row.original.adjustments;
        return (
          <span className={value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500'}>
            {value > 0 ? `+${value}` : value}
          </span>
        );
      },
    },
    {
      header: 'Current Stock',
      accessorKey: 'currentStock',
      cell: ({ row }: any) => {
        const value = row.original.currentStock;
        return (
          <span className={value <= 5 ? 'text-red-600 font-bold' : ''}>
            {value}
          </span>
        );
      },
    },
    {
      header: 'Net Change',
      cell: ({ row }: any) => {
        const netChange = row.original.currentStock - row.original.startingStock;
        return (
          <span className={netChange > 0 ? 'text-green-600' : netChange < 0 ? 'text-red-600' : 'text-gray-500'}>
            {netChange > 0 ? `+${netChange}` : netChange}
          </span>
        );
      },
    },
  ];

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await exportReport('inventory-movement', { 
        dateRange, 
        warehouseId 
      }, format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-movement-report-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
      
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Movement</h3>
          <p className="text-sm text-gray-500 mb-6">
            Showing inventory changes from {dateRange.startDate} to {dateRange.endDate}
            {warehouseId ? ' for selected warehouse' : ' across all warehouses'}
          </p>
          
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
