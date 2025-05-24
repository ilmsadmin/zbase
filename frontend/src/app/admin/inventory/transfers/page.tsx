"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/format';

export default function TransfersPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });

  // Fetch transfers
  const { data: transfers, isLoading, isError } = useQuery({
    queryKey: ['inventoryTransfers', dateRange],
    queryFn: () => inventoryApi.getTransfers(dateRange),
  });

  const handleCreateTransfer = () => {
    // Navigate to transfer creation page
    window.location.href = '/admin/inventory/transfers/new';
  };

  const handleViewTransfer = (transferId: string) => {
    // Navigate to transfer detail page
    window.location.href = `/admin/inventory/transfers/${transferId}`;
  };

  const columns = [
    {
      header: 'Transfer #',
      accessorKey: 'referenceNumber',
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => (
        formatDate(row.original.createdAt)
      ),
    },
    {
      header: 'From',
      accessorKey: 'sourceWarehouse.name',
    },
    {
      header: 'To',
      accessorKey: 'destinationWarehouse.name',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        let variant = 'secondary';
        
        if (status === 'COMPLETED') variant = 'success';
        else if (status === 'PENDING') variant = 'warning';
        else if (status === 'CANCELLED') variant = 'destructive';
        
        return (
          <Badge variant={variant as any}>
            {status}
          </Badge>
        );
      },
    },
    {
      header: 'Items',
      accessorKey: 'itemCount',
    },
    {
      header: 'Created By',
      accessorKey: 'createdBy.name',
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTransfer(row.original.id)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Inventory Transfers</h2>
          <Button onClick={handleCreateTransfer}>Create Transfer</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm">From:</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">To:</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        {isLoading ? (
          <div>Loading transfers...</div>
        ) : isError ? (
          <div>Error loading transfers</div>
        ) : transfers && transfers.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={transfers} 
          />
        ) : (
          <EmptyState
            title="No transfers found"
            description="Transfer inventory between warehouses to manage your stock efficiently."
            action={
              <Button onClick={handleCreateTransfer}>
                Create Transfer
              </Button>
            }
          />
        )}
      </div>
    </Card>
  );
}
