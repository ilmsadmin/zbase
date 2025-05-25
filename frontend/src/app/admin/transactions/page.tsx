"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';
import { Transaction, TransactionFilters } from '@/types/transaction';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';
import { Dialog } from '@/components/ui/Dialog';
import { TransactionFormModal } from '@/components/admin/transactions/TransactionFormModal';

export default function TransactionsPage() {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    transactionType: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch transactions with filters
  const { data: transactionsData, isLoading, isError } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getTransactions(filters),
  });

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    if (range) {
      setFilters({
        ...filters,
        dateFrom: range.from.toISOString().split('T')[0],
        dateTo: range.to.toISOString().split('T')[0],
      });
    } else {
      setFilters({
        ...filters,
        dateFrom: '',
        dateTo: '',
      });
    }
  };

  const handleTypeChange = (value: string) => {
    setFilters({
      ...filters,
      transactionType: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const handleAddTransaction = () => {
    setIsTransactionFormOpen(true);
  };
  const typeOptions = [
    { value: '', label: 'Tất cả loại' },
    { value: 'receipt', label: 'Biên lai' },
    { value: 'payment', label: 'Thanh toán' },
  ];

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      receipt: { color: 'green', label: 'Biên lai' },
      payment: { color: 'blue', label: 'Thanh toán' },
    };

    const typeInfo = typeMap[type] || { color: 'gray', label: type };
    return <Badge color={typeInfo.color}>{typeInfo.label}</Badge>;
  };
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending: { color: 'yellow', label: 'Đang xử lý' },
      completed: { color: 'green', label: 'Hoàn thành' },
      canceled: { color: 'red', label: 'Đã hủy' },
      failed: { color: 'red', label: 'Thất bại' },
    };

    const statusInfo = statusMap[status] || { color: 'gray', label: status };
    return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
  };
  const columns = [
    {
      header: 'Mã',
      accessorKey: 'code',
    },
    {
      header: 'Loại',
      accessorKey: 'transactionType',
      cell: ({ row }: { row: any }) => getTypeBadge(row.original.transactionType),
    },
    {
      header: 'Ngày',
      accessorKey: 'transactionDate',
      cell: ({ row }: { row: any }) => formatDate(row.original.transactionDate),
    },
    {
      header: 'Số tiền',
      accessorKey: 'amount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.amount),
    },
    {
      header: 'Từ/Đến',
      accessorKey: 'entity',
      cell: ({ row }: { row: any }) => 
        row.original.customerName || row.original.partnerName || 'N/A',
    },
    {
      header: 'Phương thức',
      accessorKey: 'transactionMethod',
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => getStatusBadge(row.original.status),
    },
    {
      header: 'Tham chiếu',
      accessorKey: 'reference',
      cell: ({ row }: { row: any }) => row.original.reference || 'N/A',
    },
  ];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Giao dịch tài chính</h1>
        <Button onClick={handleAddTransaction}>Thêm giao dịch</Button>
      </div>      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <FormInput
              name="search"
              placeholder="Tìm theo mã hoặc tham chiếu"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
            <FormSelect
              name="transactionType"
              options={typeOptions}
              value={filters.transactionType}
              onChange={handleTypeChange}
              placeholder="Chọn loại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
            <DateRangePicker onChange={handleDateRangeChange} />
          </div>
        </div>
      </Card>      {isLoading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : isError ? (
        <EmptyState
          title="Lỗi khi tải giao dịch"
          description="Đã xảy ra sự cố khi tải dữ liệu giao dịch. Vui lòng thử lại."
          actionLabel="Làm mới"
          onAction={() => window.location.reload()}
        />
      ) : transactionsData?.data.length === 0 ? (
        <EmptyState
          title="Không tìm thấy giao dịch nào"
          description="Không có giao dịch nào phù hợp với tiêu chí tìm kiếm của bạn."
          actionLabel="Thêm giao dịch"
          onAction={handleAddTransaction}
        />
      ) : (
        <DataTable
          data={transactionsData?.data || []}
          columns={columns}
          onSelectedRowsChange={setSelectedTransactions}
          pagination={{
            totalCount: transactionsData?.total || 0,
            pageSize: 10,
          }}
        />
      )}

      {/* Transaction Form Modal */}
      <TransactionFormModal 
        isOpen={isTransactionFormOpen} 
        onClose={() => setIsTransactionFormOpen(false)} 
      />
    </div>
  );
}
