"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from '@/services/api/invoices';
import { Invoice, InvoiceFilters } from '@/types/invoice';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { CustomerSearch } from '@/components/admin/customers/CustomerSearch';

export default function InvoicesPage() {
  const router = useRouter();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    customerId: '',
  });

  // Fetch invoices with filters
  const { data: invoicesData, isLoading, isError } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoicesApi.getInvoices(filters),
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

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value,
    });
  };

  const handleCustomerChange = (customerId: string) => {
    setFilters({
      ...filters,
      customerId,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const handleCreateInvoice = () => {
    router.push('/admin/invoices/create');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    router.push(`/admin/invoices/${invoice.id}`);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'overdue', label: 'Overdue' },
  ];  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"; label: string }> = {
      pending: { variant: 'warning', label: 'Pending' },
      paid: { variant: 'success', label: 'Paid' },
      canceled: { variant: 'destructive', label: 'Canceled' },
      overdue: { variant: 'secondary', label: 'Overdue' },
    };

    const statusInfo = statusMap[status] || { variant: 'default', label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const columns = [
    {
      header: 'Invoice #',
      accessorKey: 'code',
      cell: ({ row }: { row: any }) => (
        <Button variant="link" onClick={() => handleViewInvoice(row.original)}>
          {row.original.code}
        </Button>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Date',
      accessorKey: 'invoiceDate',
      cell: ({ row }: { row: any }) => formatDate(row.original.invoiceDate),
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalAmount),
    },
    {
      header: 'Paid',
      accessorKey: 'paidAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.paidAmount),
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalAmount - row.original.paidAmount),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => getStatusBadge(row.original.status),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewInvoice(row.original)}
          >
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => router.push(`/admin/invoices/print/${row.original.id}`)}
          >
            Print
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>            <FormInput
              name="search"
              placeholder="Search by invoice # or notes"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>            <FormSelect
              name="status"
              options={statusOptions}
              value={filters.status}
              onChange={handleStatusChange}
              placeholder="Select status"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <CustomerSearch onSelect={handleCustomerChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangePicker onChange={handleDateRangeChange} />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : isError ? (        <EmptyState
          title="Error loading invoices"
          description="There was a problem loading the invoices. Please try again."
          actionLabel="Refresh"
          onAction={() => window.location.reload()}
        />
      ) : invoicesData?.data.length === 0 ? (        <EmptyState
          title="No invoices found"
          description="No invoices match your search criteria."
          actionLabel="Create Invoice"
          onAction={handleCreateInvoice}
        />
      ) : (        <DataTable
          data={invoicesData?.data || []}
          columns={columns}
          pagination={true}
        />
      )}
    </div>
  );
}
