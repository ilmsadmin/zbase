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
      header: 'Mã chuyển kho',
      accessorKey: 'referenceNumber',
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => (
        formatDate(row.original.createdAt)
      ),
    },
    {
      header: 'Từ kho',
      accessorKey: 'sourceWarehouse.name',
    },
    {
      header: 'Đến kho',
      accessorKey: 'destinationWarehouse.name',
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        let variant = 'secondary';
        
        if (status === 'COMPLETED') variant = 'success';
        else if (status === 'PENDING') variant = 'warning';
        else if (status === 'CANCELLED') variant = 'destructive';
          return (
          <Badge variant={variant as any}>
            {status === 'COMPLETED' ? 'Hoàn thành' : 
             status === 'PENDING' ? 'Đang xử lý' : 
             status === 'CANCELLED' ? 'Đã hủy' : status}
          </Badge>
        );
      },
    },
    {
      header: 'Số lượng mặt hàng',
      accessorKey: 'itemCount',
    },
    {
      header: 'Người tạo',
      accessorKey: 'createdBy.name',
    },
    {
      header: 'Thao tác',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTransfer(row.original.id)}
          >
            Xem
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">          <h2 className="text-xl font-semibold">Chuyển kho hàng</h2>
          <Button onClick={handleCreateTransfer}>Tạo chuyển kho</Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm">Từ ngày:</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Đến ngày:</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        {isLoading ? (
          <div>Đang tải dữ liệu chuyển kho...</div>
        ) : isError ? (
          <div>Lỗi khi tải dữ liệu chuyển kho</div>
        ) : transfers && transfers.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={transfers} 
          />
        ) : (          <EmptyState
            title="Không tìm thấy chuyển kho nào"
            description="Chuyển kho giữa các kho hàng để quản lý tồn kho hiệu quả hơn."
            actionLabel="Tạo chuyển kho"
            onAction={handleCreateTransfer}
          />
        )}
      </div>
    </Card>
  );
}
