"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AttributeFormModal } from '@/components/admin/products/AttributeFormModal';

export default function AttributesPage() {
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<any | null>(null);

  // Fetch all attributes
  const { data: attributes, isLoading, isError } = useQuery({
    queryKey: ['productAttributes'],
    queryFn: () => productsApi.getAttributes(),
  });

  const handleAddAttribute = () => {
    setEditingAttribute(null);
    setIsFormModalOpen(true);
  };

  const handleEditAttribute = (attribute: any) => {
    setEditingAttribute(attribute);
    setIsFormModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (attributeId: string) => productsApi.deleteAttribute(attributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
    },
  });

  const handleDeleteAttribute = (attributeId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này không?')) {
      deleteMutation.mutate(attributeId);
    }
  };

  const columns = [
    {
      header: 'Tên thuộc tính',
      accessorKey: 'name',
    },
    {
      header: 'Loại',
      accessorKey: 'type',
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline">
          {row.original.type}
        </Badge>
      ),
    },
    {
      header: 'Bắt buộc',
      accessorKey: 'isRequired',
      cell: ({ row }: { row: any }) => (
        row.original.isRequired ? 'Có' : 'Không'
      ),
    },
    {
      header: 'Dùng trong sản phẩm',
      accessorKey: 'usedInProducts',
      cell: ({ row }: { row: any }) => (
        row.original.productCount || '0'
      ),
    },
    {
      header: 'Thao tác',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditAttribute(row.original)}
          >            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
            onClick={() => handleDeleteAttribute(row.original.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Đang tải thuộc tính...</div>;
  }

  if (isError) {
    return <div>Lỗi khi tải thuộc tính</div>;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">          <h2 className="text-xl font-semibold">Thuộc tính sản phẩm</h2>
          <Button onClick={handleAddAttribute}>Thêm thuộc tính</Button>
        </div>

        {attributes && attributes.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={attributes} 
          />
        ) : (          <EmptyState
            title="Không tìm thấy thuộc tính nào"
            description="Tạo thuộc tính sản phẩm đầu tiên để tổ chức và lọc sản phẩm của bạn."
            actionLabel="Thêm thuộc tính"
            onAction={handleAddAttribute}
          />
        )}
      </div>
      
      {isFormModalOpen && (
        <AttributeFormModal
          attribute={editingAttribute}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={() => {
            setIsFormModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
          }}
        />
      )}
    </Card>
  );
}
