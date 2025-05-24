"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';

export default function InvoiceDraftsPage() {
  // Mock data for draft invoices
  const draftInvoices = [
    {
      id: 'DR-1001',
      customer: { name: 'Acme Corporation', id: 'C001' },
      total: 1250.50,
      createdAt: '2025-05-22T10:30:00Z',
      items: 5
    },
    {
      id: 'DR-1002',
      customer: { name: 'TechNova Inc.', id: 'C002' },
      total: 780.00,
      createdAt: '2025-05-23T14:15:00Z',
      items: 3
    },
    {
      id: 'DR-1003',
      customer: { name: 'Global Traders', id: 'C003' },
      total: 3450.75,
      createdAt: '2025-05-24T09:45:00Z',
      items: 8
    }
  ];

  const columns = [
    {
      header: 'Draft #',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customer.name',
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.total),
    },
    {
      header: 'Items',
      accessorKey: 'items',
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="outline" size="sm">Convert to Invoice</Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">Delete</Button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Draft Invoices</h1>
        <Button>Create New Draft</Button>
      </div>

      <Card className="p-6">
        {draftInvoices.length === 0 ? (
          <EmptyState
            title="No draft invoices"
            description="Create a draft invoice to save it for later completion and review."
            action={
              <Button>Create Draft Invoice</Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={draftInvoices}
          />
        )}
      </Card>
    </div>
  );
}
