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

export default function AdjustmentsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });

  // Fetch adjustments
  const { data: adjustments, isLoading, isError } = useQuery({
    queryKey: ['inventoryAdjustments', dateRange],
    queryFn: () => inventoryApi.getAdjustments(dateRange),
  });

  const handleCreateAdjustment = () => {
    // Navigate to adjustment creation page
    window.location.href = '/admin/inventory/adjustments/new';
  };

  const handleViewAdjustment = (adjustmentId: string) => {
    // Navigate to adjustment detail page
    window.location.href = `/admin/inventory/adjustments/${adjustmentId}`;
  };

  const columns = [
    {
      header: 'Adjustment #',
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
      header: 'Warehouse',
      accessorKey: 'warehouse.name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        let variant = 'secondary';
        let label = type;
        
        if (type === 'ADDITION') {
          variant = 'success';
          label = 'Addition';
        } else if (type === 'SUBTRACTION') {
          variant = 'destructive';
          label = 'Subtraction';
        } else if (type === 'COUNT') {
          variant = 'info';
          label = 'Stock Count';
        }
        
        return (
          <Badge variant={variant as any}>
            {label}
          </Badge>
        );
      },
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
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
            onClick={() => handleViewAdjustment(row.original.id)}
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
          <h2 className="text-xl font-semibold">Inventory Adjustments</h2>
          <Button onClick={handleCreateAdjustment}>Create Adjustment</Button>
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
          <div>Loading adjustments...</div>
        ) : isError ? (
          <div>Error loading adjustments</div>
        ) : adjustments && adjustments.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={adjustments} 
          />
        ) : (
          <EmptyState
            title="No adjustments found"
            description="Make inventory adjustments to correct stock discrepancies."
            action={
              <Button onClick={handleCreateAdjustment}>
                Create Adjustment
              </Button>
            }
          />
        )}
      </div>
    </Card>
  );
}
