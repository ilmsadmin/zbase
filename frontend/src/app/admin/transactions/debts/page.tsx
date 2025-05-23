"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';
import { DebtSummary, AgingAnalysis } from '@/types/transaction';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, Tab } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';
import { Dialog } from '@/components/ui/Dialog';
import { TransactionFormModal } from '@/components/admin/transactions/TransactionFormModal';
import { PieChart, BarChart } from '@/components/ui/Charts';

export default function DebtManagementPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'partners'>('customers');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [selectedEntityName, setSelectedEntityName] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'receipt' | 'payment'>('receipt');
  
  // Fetch debt data based on active tab
  const { data: debtData, isLoading, isError } = useQuery({
    queryKey: ['debts', activeTab],
    queryFn: () => 
      activeTab === 'customers' 
        ? transactionsApi.getCustomerDebts()
        : transactionsApi.getPartnerDebts(),
  });

  // Fetch aging analysis data
  const { data: agingData } = useQuery({
    queryKey: ['aging', activeTab],
    queryFn: () => transactionsApi.getAgingAnalysis(activeTab),
  });

  const handleAddTransaction = (id: string, name: string, type: 'receipt' | 'payment') => {
    setSelectedEntityId(id);
    setSelectedEntityName(name);
    setTransactionType(type);
    setIsTransactionFormOpen(true);
  };

  const customerDebtColumns = [
    {
      header: 'Customer',
      accessorKey: 'name',
    },
    {
      header: 'Total Debt',
      accessorKey: 'totalDebt',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalDebt),
    },
    {
      header: 'Overdue',
      accessorKey: 'overdue',
      cell: ({ row }: { row: any }) => (
        <span className={row.original.overdue > 0 ? 'text-red-600 font-semibold' : ''}>
          {formatCurrency(row.original.overdue)}
        </span>
      ),
    },
    {
      header: 'Current',
      accessorKey: 'current',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.current),
    },
    {
      header: 'Upcoming',
      accessorKey: 'upcoming',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.upcoming),
    },
    {
      header: 'Last Transaction',
      accessorKey: 'lastTransactionDate',
      cell: ({ row }: { row: any }) => formatDate(row.original.lastTransactionDate),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => handleAddTransaction(row.original.id, row.original.name, 'receipt')}
          >
            Collect
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={() => window.open(`/admin/customers/${row.original.id}`, '_blank')}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const partnerDebtColumns = [
    {
      header: 'Partner/Supplier',
      accessorKey: 'name',
    },
    {
      header: 'Total Debt',
      accessorKey: 'totalDebt',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalDebt),
    },
    {
      header: 'Overdue',
      accessorKey: 'overdue',
      cell: ({ row }: { row: any }) => (
        <span className={row.original.overdue > 0 ? 'text-red-600 font-semibold' : ''}>
          {formatCurrency(row.original.overdue)}
        </span>
      ),
    },
    {
      header: 'Current',
      accessorKey: 'current',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.current),
    },
    {
      header: 'Upcoming',
      accessorKey: 'upcoming',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.upcoming),
    },
    {
      header: 'Last Transaction',
      accessorKey: 'lastTransactionDate',
      cell: ({ row }: { row: any }) => formatDate(row.original.lastTransactionDate),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => handleAddTransaction(row.original.id, row.original.name, 'payment')}
          >
            Pay
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={() => window.open(`/admin/partners/${row.original.id}`, '_blank')}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  // Format aging data for charts
  const pieChartData = agingData ? [
    { name: 'Current', value: agingData.current },
    { name: '1-30 Days', value: agingData.days30 },
    { name: '31-60 Days', value: agingData.days60 },
    { name: '61-90 Days', value: agingData.days90 },
    { name: '90+ Days', value: agingData.days90Plus },
  ] : [];

  const barChartData = agingData ? [
    { name: 'Current', value: agingData.current },
    { name: '1-30 Days', value: agingData.days30 },
    { name: '31-60 Days', value: agingData.days60 },
    { name: '61-90 Days', value: agingData.days90 },
    { name: '90+ Days', value: agingData.days90Plus },
  ] : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Debt Management</h1>
      </div>

      <Tabs 
        activeTab={activeTab} 
        onChange={(tab) => setActiveTab(tab as 'customers' | 'partners')}
        className="mb-6"
      >
        <Tab id="customers" label="Customer Debts">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : isError ? (
              <EmptyState
                title="Error loading customer debts"
                description="There was a problem loading the customer debt data."
                action={<Button onClick={() => window.location.reload()}>Refresh</Button>}
              />
            ) : debtData?.data.length === 0 ? (
              <EmptyState
                title="No customer debts"
                description="There are no outstanding customer debts at this time."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Aging Analysis</h3>
                    <div className="h-64">
                      <PieChart data={pieChartData} />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Debt by Age</h3>
                    <div className="h-64">
                      <BarChart data={barChartData} />
                    </div>
                  </Card>
                </div>

                <DataTable
                  data={debtData?.data || []}
                  columns={customerDebtColumns}
                  pagination={{
                    totalCount: debtData?.total || 0,
                    pageSize: 10,
                  }}
                />
              </>
            )}
          </div>
        </Tab>
        <Tab id="partners" label="Partner/Supplier Debts">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : isError ? (
              <EmptyState
                title="Error loading partner debts"
                description="There was a problem loading the partner debt data."
                action={<Button onClick={() => window.location.reload()}>Refresh</Button>}
              />
            ) : debtData?.data.length === 0 ? (
              <EmptyState
                title="No partner debts"
                description="There are no outstanding partner debts at this time."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Aging Analysis</h3>
                    <div className="h-64">
                      <PieChart data={pieChartData} />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Debt by Age</h3>
                    <div className="h-64">
                      <BarChart data={barChartData} />
                    </div>
                  </Card>
                </div>

                <DataTable
                  data={debtData?.data || []}
                  columns={partnerDebtColumns}
                  pagination={{
                    totalCount: debtData?.total || 0,
                    pageSize: 10,
                  }}
                />
              </>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Transaction Form Modal */}
      {isTransactionFormOpen && (
        <TransactionFormModal 
          isOpen={isTransactionFormOpen} 
          onClose={() => setIsTransactionFormOpen(false)}
          transaction={{
            transactionType,
            [activeTab === 'customers' ? 'customerId' : 'partnerId']: selectedEntityId,
          }}
        />
      )}
    </div>
  );
}
