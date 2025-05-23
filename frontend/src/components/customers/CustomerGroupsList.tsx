"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { FormInput } from '@/components/ui/FormInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { CustomerGroupFormModal } from '@/components/customers/CustomerGroupFormModal';

// Định nghĩa kiểu dữ liệu cho CustomerGroup
interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  createdAt: string;
}

// Mock API service cho customer groups
const customerGroupsApi = {
  getGroups: async (filters?: { search?: string }) => {
    // Giả lập API call, trong môi trường thực tế sẽ gọi API backend
    return {
      data: [
        {
          id: '1',
          name: 'VIP Customers',
          description: 'Customers who spend more than $1000 per month',
          customerCount: 24,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Regular Customers',
          description: 'Customers who shop at least once a month',
          customerCount: 156,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'New Customers',
          description: 'Customers who registered in the last 30 days',
          customerCount: 42,
          createdAt: new Date().toISOString(),
        },
      ],
      totalCount: 3,
    };
  },
  deleteGroup: async (id: string) => {
    // Giả lập API call xóa
    console.log(`Deleting group ${id}`);
    return { success: true };
  },
};

export function CustomerGroupsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);

  // Fetch customer groups
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customerGroups', searchQuery],
    queryFn: () => customerGroupsApi.getGroups({ search: searchQuery }),
  });

  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: CustomerGroup) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer group?')) {
      await customerGroupsApi.deleteGroup(id);
      refetch();
    }
  };

  const handleFormSubmit = async () => {
    // Sau khi thêm hoặc chỉnh sửa, đóng form và tải lại dữ liệu
    setIsFormOpen(false);
    refetch();
  };

  const columns = [
    {
      header: 'Group Name',
      accessorKey: 'name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.description}</div>
        </div>
      ),
    },
    {
      header: 'Customers',
      accessorKey: 'customerCount',
      cell: ({ row }: { row: any }) => (
        <span className="font-medium">{row.original.customerCount}</span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => (
        <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditGroup(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteGroup(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <FormInput
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddGroup}>Add Customer Group</Button>
      </div>

      <Card>
        {data?.data?.length === 0 ? (
          <EmptyState
            title="No customer groups found"
            description="Create your first customer group to segment your customers."
            action={
              <Button onClick={handleAddGroup}>Create Customer Group</Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
          />
        )}
      </Card>

      {isFormOpen && (
        <CustomerGroupFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          group={editingGroup}
        />
      )}
    </div>
  );
}
