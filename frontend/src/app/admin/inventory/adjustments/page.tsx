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
      header: 'Mã điều chỉnh',
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
      header: 'Kho hàng',
      accessorKey: 'warehouse.name',
    },
    {
      header: 'Loại',
      accessorKey: 'type',
      cell: ({ row }: { row: any }) => {
        const type = row.original.type;
        let variant = 'secondary';
        let label = type;
        
        if (type === 'ADDITION') {          variant = 'success';
          label = 'Thêm hàng';
        } else if (type === 'SUBTRACTION') {
          variant = 'destructive';
          label = 'Giảm hàng';
        } else if (type === 'COUNT') {
          variant = 'info';
          label = 'Kiểm kê';
        }
        
        return (
          <Badge variant={variant as any}>
            {label}
          </Badge>
        );
      },
    },
    {
      header: 'Lý do',
      accessorKey: 'reason',
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
            onClick={() => handleViewAdjustment(row.original.id)}
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
        <div className="flex justify-between items-center mb-6">          <h2 className="text-xl font-semibold">Điều chỉnh kho hàng</h2>
          <Button onClick={handleCreateAdjustment}>Tạo điều chỉnh</Button>
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
          <div>Đang tải dữ liệu điều chỉnh kho...</div>
        ) : isError ? (
          <div>Lỗi khi tải dữ liệu điều chỉnh kho</div>
        ) : adjustments && adjustments.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={adjustments} 
          />
        ) : (          <EmptyState
            title="Không tìm thấy điều chỉnh kho nào"
            description="Thực hiện điều chỉnh kho để sửa sai lệch tồn kho."
            actionLabel="Tạo điều chỉnh"
            onAction={handleCreateAdjustment}
          />
        )}
      </div>
    </Card>
  );
}
