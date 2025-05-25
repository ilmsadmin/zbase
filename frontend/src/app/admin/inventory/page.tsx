"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';
import { productsApi } from '@/services/api/products';
import { warehousesApi } from '@/services/api/warehouses';
import { InventoryFilters } from '@/types/inventory';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { Badge } from '@/components/ui/Badge';
import { StockAdjustmentModal } from '@/components/admin/inventory/StockAdjustmentModal';
import { StockTransferModal } from '@/components/admin/inventory/StockTransferModal';
import { EmptyState } from '@/components/ui/EmptyState';

export default function InventoryPage() {
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    warehouseId: undefined,
    lowStock: undefined,
  });

  // Fetch warehouses for filter
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehousesApi.getWarehouses({ isActive: true }),
  });

  // Fetch inventory with filters
  const { data: inventoryData, isLoading, isError } = useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => inventoryApi.getInventoryItems(filters),
  });

  const handleStockAdjustment = (productId?: string) => {
    setSelectedProduct(productId || null);
    setIsAdjustmentModalOpen(true);
  };

  const handleStockTransfer = (productId?: string) => {
    setSelectedProduct(productId || null);
    setIsTransferModalOpen(true);
  };
  const columns = [
    {
      header: 'Sản phẩm',
      accessorKey: 'product.name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.product.name}</div>
          <div className="text-sm text-gray-500">Mã: {row.original.product.sku}</div>
        </div>
      ),
    },
    {
      header: 'Kho hàng',
      accessorKey: 'warehouse.name',
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      cell: ({ row }: { row: any }) => {
        const isLowStock = row.original.quantity <= (row.original.product.minStockLevel || 0);
        
        return (
          <div>
            <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
              {row.original.quantity} {row.original.product.unit}s
            </span>
            {isLowStock && (
              <Badge variant="danger" className="ml-2">Sắp hết hàng</Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Tối thiểu/Tối đa',
      accessorKey: 'minMaxStock',
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">
          <div>Min: {row.original.minimumStock || row.original.product.minStockLevel || 'N/A'}</div>
          <div>Max: {row.original.maximumStock || row.original.product.maxStockLevel || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Thao tác',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStockAdjustment(row.original.productId)}
          >
            Điều chỉnh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStockTransfer(row.original.productId)}
          >
            Chuyển kho
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý kho hàng</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleStockAdjustment()}>Điều chỉnh hàng</Button>
          <Button onClick={() => handleStockTransfer()}>Chuyển kho</Button>
        </div>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Search products"
              placeholder="Search by name, SKU, barcode..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
              label="Stock Level"
              placeholder="All Stock Levels"
              options={[
                { label: 'Low Stock', value: 'true' },
              ]}
              value={filters.lowStock !== undefined ? String(filters.lowStock) : ''}
              onChange={(value) => setFilters({ 
                ...filters, 
                lowStock: value ? value === 'true' : undefined 
              })}
              isClearable
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-6 text-center">Loading inventory data...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">Error loading inventory data</div>
        ) : inventoryData?.data.length === 0 ? (
          <EmptyState
            title="No inventory data found"
            description="Start by adding products to your inventory"
            action={
              <Button onClick={() => handleStockAdjustment()}>
                Add Stock
              </Button>
            }
          />
        ) : (
          <DataTable
            data={inventoryData?.data || []}
            columns={columns}
          />
        )}
      </Card>

      {isAdjustmentModalOpen && (
        <StockAdjustmentModal
          isOpen={isAdjustmentModalOpen}
          onClose={() => setIsAdjustmentModalOpen(false)}
          productId={selectedProduct}
        />
      )}

      {isTransferModalOpen && (
        <StockTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          productId={selectedProduct}
        />
      )}
    </div>
  );
}
