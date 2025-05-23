"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { inventoryApi } from '@/services/api/inventory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => productsApi.getProduct(params.id),
  });

  // Fetch inventory transactions for this product
  const { data: transactions } = useQuery({
    queryKey: ['productTransactions', params.id],
    queryFn: () => inventoryApi.getInventoryTransactions({ productId: params.id }),
    enabled: !!params.id,
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await productsApi.deleteProduct(params.id);
      router.push('/admin/products');
    }
  };

  // Columns for inventory by warehouse table
  const inventoryColumns = [
    {
      header: 'Warehouse',
      accessorKey: 'warehouse.name',
    },
    {
      header: 'Location',
      accessorKey: 'location.name',
      cell: ({ row }: { row: any }) => row.original.location?.name || 'Default',
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: ({ row }: { row: any }) => (
        <span>
          {row.original.quantity} {product?.unit || 'units'}
        </span>
      ),
    },
    {
      header: 'Available',
      accessorKey: 'availableQuantity',
      cell: ({ row }: { row: any }) => (
        <span>
          {row.original.availableQuantity} {product?.unit || 'units'}
        </span>
      ),
    },
    {
      header: 'Reserved',
      accessorKey: 'reservedQuantity',
      cell: ({ row }: { row: any }) => (
        <span>
          {row.original.reservedQuantity} {product?.unit || 'units'}
        </span>
      ),
    },
  ];

  // Columns for transaction history
  const transactionColumns = [
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
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
          {row.original.quantity > 0 ? '+' : ''}{row.original.quantity} {product?.unit || 'units'}
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
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Loading product details...</div>;
  }

  if (isError || !product) {
    return <div className="p-6 text-center text-red-500">Error loading product details</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Info Card */}
        <Card className="md:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">SKU</span>
                <span>{product.sku}</span>
              </div>
              {product.barcode && (
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-500">Barcode</span>
                  <span>{product.barcode}</span>
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">Category</span>
                <span>{product.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">Unit</span>
                <span>{product.unit}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">Price</span>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
              </div>
              {product.costPrice !== undefined && (
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-500">Cost Price</span>
                  <span>{formatCurrency(product.costPrice)}</span>
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant={product.isActive ? 'success' : 'gray'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {product.reorderLevel !== undefined && (
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-500">Reorder Level</span>
                  <span>{product.reorderLevel} {product.unit}s</span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {product.attributes && product.attributes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-500 mb-2">Attributes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between border-b border-gray-100 py-1">
                      <span className="text-gray-600">{attr.name}</span>
                      <span>{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Product Image Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Image</h2>
            <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory by Warehouse */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory by Warehouse</h2>
          {product.inventory && product.inventory.length > 0 ? (
            <DataTable
              data={product.inventory}
              columns={inventoryColumns}
              pagination={false}
            />
          ) : (
            <div className="text-center p-4 text-gray-500">No inventory data available</div>
          )}
        </div>
      </Card>

      {/* Price History (placeholder for now) */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Price History</h2>
          <div className="text-center p-4 text-gray-500">Price history feature coming soon</div>
        </div>
      </Card>

      {/* Inventory Transactions */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory History</h2>
          {transactions?.data && transactions.data.length > 0 ? (
            <DataTable
              data={transactions.data}
              columns={transactionColumns}
            />
          ) : (
            <div className="text-center p-4 text-gray-500">No transaction history available</div>
          )}
        </div>
      </Card>

      {isEditModalOpen && (
        <ProductFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}
