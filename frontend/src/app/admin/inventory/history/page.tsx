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
    { label: 'Adjustment', value: 'ADJUSTMENT' },
    { label: 'Transfer', value: 'TRANSFER' },
    { label: 'Sale', value: 'SALE' },
    { label: 'Purchase', value: 'PURCHASE' },
    { label: 'Return', value: 'RETURN' },
  ];

  const columns = [
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    {
      header: 'Product',
      accessorKey: 'product.name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.product.name}</div>
          <div className="text-sm text-gray-500">SKU: {row.original.product.sku}</div>
        </div>
      ),
    },
    {
      header: 'Type',
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
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: ({ row }: { row: any }) => (
        <span className={row.original.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
          {row.original.quantity > 0 ? '+' : ''}{row.original.quantity} {row.original.product.unit}s
        </span>
      ),
    },
    {
      header: 'Warehouse',
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
      header: 'Notes',
      accessorKey: 'notes',
      cell: ({ row }: { row: any }) => row.original.notes || row.original.reason || 'N/A',
    },
    {
      header: 'Created By',
      accessorKey: 'createdBy',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory History</h1>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="Product"
              placeholder="All Products"
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
            <FormSelect
              label="Warehouse"
              placeholder="All Warehouses"
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
            <FormSelect
              label="Transaction Type"
              placeholder="All Types"
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
              label="Start Date"
              value={filters.startDate ? new Date(filters.startDate) : undefined}
              onChange={(date) => setFilters({ 
                ...filters, 
                startDate: date ? date.toISOString() : undefined 
              })}
              placeholder="Select start date"
            />
            <FormDatePicker
              label="End Date"
              value={filters.endDate ? new Date(filters.endDate) : undefined}
              onChange={(date) => setFilters({ 
                ...filters, 
                endDate: date ? date.toISOString() : undefined 
              })}
              placeholder="Select end date"
              minDate={filters.startDate ? new Date(filters.startDate) : undefined}
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 text-center">Loading transaction history...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">Error loading transaction history</div>
        ) : transactionsData?.data.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters to see more results"
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
