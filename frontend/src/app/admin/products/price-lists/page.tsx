"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';

export default function PriceListsPage() {
  const queryClient = useQueryClient();
  const [selectedPriceList, setSelectedPriceList] = useState<any | null>(null);

  // Fetch all price lists
  const { data: priceLists, isLoading, isError } = useQuery({
    queryKey: ['priceLists'],
    queryFn: () => productsApi.getPriceLists(),
  });

  const handleCreatePriceList = () => {
    // Navigate to create price list page
    window.location.href = '/admin/products/price-lists/create';
  };

  const handleViewPriceList = (priceListId: string) => {
    // Navigate to price list detail page
    window.location.href = `/admin/products/price-lists/${priceListId}`;
  };

  const handleActivatePriceList = (priceListId: string) => {
    // Implement price list activation logic
    if (confirm('Are you sure you want to activate this price list? It will affect product prices.')) {
      // Call API to activate price list
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (priceListId: string) => productsApi.deletePriceList(priceListId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceLists'] });
    },
  });

  const handleDeletePriceList = (priceListId: string) => {
    if (confirm('Are you sure you want to delete this price list?')) {
      deleteMutation.mutate(priceListId);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.description}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Products',
      accessorKey: 'productCount',
      cell: ({ row }: { row: any }) => (
        row.original.productCount || '0'
      ),
    },
    {
      header: 'Date Created',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => (
        formatDate(row.original.createdAt)
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPriceList(row.original.id)}
          >
            View
          </Button>
          {!row.original.isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-800 hover:bg-green-100"
              onClick={() => handleActivatePriceList(row.original.id)}
            >
              Activate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
            onClick={() => handleDeletePriceList(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading price lists...</div>;
  }

  if (isError) {
    return <div>Error loading price lists</div>;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Price Lists</h2>
          <Button onClick={handleCreatePriceList}>Create Price List</Button>
        </div>

        {priceLists && priceLists.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={priceLists} 
          />
        ) : (
          <EmptyState
            title="No price lists found"
            description="Create your first price list to offer special pricing to different customer groups."
            action={
              <Button onClick={handleCreatePriceList}>
                Create Price List
              </Button>
            }
          />
        )}
      </div>
    </Card>
  );
}
