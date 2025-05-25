"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';

export default function StockPage() {
  const [filters, setFilters] = useState({
    warehouseId: '',
    search: '',
    stockStatus: 'all', // 'all', 'low', 'out'
  });

  // Fetch stock levels
  const { data: stockLevels, isLoading, isError } = useQuery({
    queryKey: ['inventoryStock', filters],
    queryFn: () => inventoryApi.getStockLevels(filters),
  });

  // Fetch warehouses for filter
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => inventoryApi.getWarehouses(),
  });

  const handleExportCSV = () => {
    // Implement CSV export logic
  };

  const handlePrintReport = () => {
    // Implement print report logic
  };

  const handleAdjustStock = (productId: string) => {
    // Navigate to stock adjustment page
    window.location.href = `/admin/inventory/adjustments/new?productId=${productId}`;
  };

  const columns = [
    {
      header: 'Sản phẩm',
      accessorKey: 'product.name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.product.name}</div>
          <div className="text-sm text-gray-500">SKU: {row.original.product.sku}</div>
        </div>
      ),
    },
    {
      header: 'Kho hàng',
      accessorKey: 'warehouse.name',
    },
    {
      header: 'Tồn kho hiện tại',
      accessorKey: 'quantity',
      cell: ({ row }: { row: any }) => {
        const isLowStock = row.original.quantity <= row.original.product.minStockLevel;
        const isOutOfStock = row.original.quantity === 0;
        
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.quantity} {row.original.product.unit}s</span>            {isOutOfStock && <Badge variant="destructive">Hết hàng</Badge>}
            {!isOutOfStock && isLowStock && <Badge variant="warning">Sắp hết hàng</Badge>}
          </div>
        );
      },
    },
    {
      header: 'Mức tối thiểu',
      accessorKey: 'product.minStockLevel',
    },
    {
      header: 'Giá trị',
      accessorKey: 'value',
      cell: ({ row }: { row: any }) => (
        formatCurrency(row.original.quantity * row.original.product.costPrice)
      ),
    },
    {
      header: 'Cập nhật lần cuối',
      accessorKey: 'updatedAt',
      cell: ({ row }: { row: any }) => (
        formatDate(row.original.updatedAt)
      ),
    },
    {
      header: 'Thao tác',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAdjustStock(row.original.product.id)}
          >
            Điều chỉnh
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Mức tồn kho</h2>
          <div className="flex gap-2">            <Button variant="outline" onClick={handleExportCSV}>Xuất CSV</Button>
            <Button variant="outline" onClick={handlePrintReport}>In báo cáo</Button>
            <Button onClick={() => window.location.href = '/admin/inventory/adjustments/new'}>
              Điều chỉnh mới
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full max-w-xs">
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.warehouseId}
              onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
            >
              <option value="">Tất cả kho hàng</option>
              {warehouses?.map((warehouse: any) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full max-w-xs">
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.stockStatus}
              onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
            >              <option value="all">Tất cả mức tồn kho</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>
          <div className="w-full max-w-xs">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {isLoading ? (
          <div>Đang tải mức tồn kho...</div>
        ) : isError ? (
          <div>Lỗi khi tải mức tồn kho</div>
        ) : stockLevels && stockLevels.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={stockLevels} 
          />
        ) : (          <EmptyState            title="Không tìm thấy dữ liệu tồn kho"
            description="Thêm sản phẩm vào kho hàng để bắt đầu theo dõi mức tồn kho."
            actionLabel="Quản lý sản phẩm"
            onAction={() => window.location.href = '/admin/products'}
          />
        )}
      </div>
    </Card>
  );
}
