"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';
import { warehousesApi } from '@/services/api/warehouses';
import { productsApi } from '@/services/api/products';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';
import { FormSelect } from '@/components/ui/FormSelect';
import { Badge } from '@/components/ui/Badge';
import { FormDatePicker } from '@/components/ui/FormDatePicker';
import { formatDate } from '@/utils/format';
import { EmptyState } from '@/components/ui/EmptyState';
import { InventoryTransactionType } from '@/types/inventory';

export default function InventoryHistoryPage() {
  const [filters, setFilters] = useState({
    productId: undefined as string | undefined,
    warehouseId: undefined as string | undefined,
    type: undefined as InventoryTransactionType | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  // Fetch warehouses for filter
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehousesApi.getWarehouses({ isActive: true }),
  });

  // Fetch products for filter
  const { data: products } = useQuery({
    queryKey: ['productsForFilter'],
    queryFn: () => productsApi.getProducts({ isActive: true, limit: 100 }),
  });

  // Fetch inventory transactions with filters
  const { data: transactionsData, isLoading, isError } = useQuery({
    queryKey: ['inventoryTransactions', filters],
    queryFn: () => inventoryApi.getInventoryTransactions(filters),
  });
  const transactionTypeOptions = [
    { label: 'Điều chỉnh', value: 'ADJUSTMENT' },
    { label: 'Chuyển kho', value: 'TRANSFER' },
    { label: 'Bán hàng', value: 'SALE' },
    { label: 'Nhập hàng', value: 'PURCHASE' },
    { label: 'Trả hàng', value: 'RETURN' },
  ];

  const columns = [
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
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
      header: 'Loại',
      accessorKey: 'type',
      cell: ({ row }: { row: any }) => (
        <Badge
          variant={
            row.original.type === 'ADJUSTMENT' ? 'warning' :
            row.original.type === 'TRANSFER' ? 'info' :
            row.original.type === 'SALE' ? 'danger' :
            row.original.type === 'PURCHASE' ? 'success' : 'gray'
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      cell: ({ row }: { row: any }) => (
        <span className={row.original.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
          {row.original.quantity > 0 ? '+' : ''}{row.original.quantity} {row.original.product.unit}s
        </span>
      ),
    },
    {
      header: 'Kho hàng',
      accessorKey: 'warehouse',
      cell: ({ row }: { row: any }) => {
        if (row.original.type === 'TRANSFER') {
          return (
            <div>
              <div>{row.original.sourceWarehouse?.name || 'N/A'} → </div>
              <div>{row.original.destinationWarehouse?.name || 'N/A'}</div>
            </div>
          );
        }
        return row.original.sourceWarehouse?.name || row.original.destinationWarehouse?.name || 'N/A';
      },
    },
    {
      header: 'Ghi chú',
      accessorKey: 'notes',
      cell: ({ row }: { row: any }) => row.original.notes || row.original.reason || 'N/A',
    },
    {
      header: 'Người tạo',
      accessorKey: 'createdBy',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lịch sử kho hàng</h1>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect              label="Sản phẩm"
              placeholder="Tất cả sản phẩm"
              options={
                products?.data.map(product => ({
                  label: product.name,
                  value: product.id
                })) || []
              }
              value={filters.productId || ''}
              onChange={(value) => setFilters({ ...filters, productId: value || undefined })}
              isClearable
              isSearchable
            />
            <FormSelect              label="Kho hàng"
              placeholder="Tất cả kho hàng"
              options={
                warehouses?.map(warehouse => ({
                  label: warehouse.name,
                  value: warehouse.id
                })) || []
              }
              value={filters.warehouseId || ''}
              onChange={(value) => setFilters({ ...filters, warehouseId: value || undefined })}
              isClearable
            />
            <FormSelect              label="Loại giao dịch"
              placeholder="Tất cả loại"
              options={transactionTypeOptions}
              value={filters.type || ''}
              onChange={(value) => setFilters({ 
                ...filters, 
                type: value as InventoryTransactionType || undefined 
              })}
              isClearable
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDatePicker
              label="Ngày bắt đầu"
              value={filters.startDate ? new Date(filters.startDate) : undefined}
              onChange={(date) => setFilters({ 
                ...filters, 
                startDate: date ? date.toISOString() : undefined 
              })}
              placeholder="Chọn ngày bắt đầu"
            />
            <FormDatePicker
              label="Ngày kết thúc"
              value={filters.endDate ? new Date(filters.endDate) : undefined}
              onChange={(date) => setFilters({ 
                ...filters, 
                endDate: date ? date.toISOString() : undefined 
              })}
              placeholder="Chọn ngày kết thúc"
              minDate={filters.startDate ? new Date(filters.startDate) : undefined}
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 text-center">Đang tải lịch sử giao dịch...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">Lỗi khi tải lịch sử giao dịch</div>
        ) : transactionsData?.data.length === 0 ? (          <EmptyState
            title="Không tìm thấy giao dịch nào"
            description="Hãy điều chỉnh bộ lọc để xem thêm kết quả"
          />
        ) : (
          <DataTable
            data={transactionsData?.data || []}
            columns={columns}
          />
        )}
      </Card>
    </div>
  );
}
