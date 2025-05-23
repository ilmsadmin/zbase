'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { productsApi } from '@/services/api/products';
import { Product, ProductFilters } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Checkbox } from '@/components/ui/Checkbox';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters, page],
    queryFn: () => productsApi.getProducts({ ...filters, page, limit: 20 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const columns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Tên sản phẩm',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-3">
          {row.original.imageUrl && (
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.sku}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category.name',
      header: 'Danh mục',
      cell: ({ row }: any) => row.original.category?.name || '-',
    },
    {
      accessorKey: 'price',
      header: 'Giá bán',
      cell: ({ row }: any) => formatCurrency(row.original.price),
    },
    {
      accessorKey: 'inventory',
      header: 'Tồn kho',
      cell: ({ row }: any) => {
        const totalStock = row.original.inventory?.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0) || 0;
        return (
          <Badge variant={totalStock > 0 ? 'success' : 'error'}>
            {totalStock} {row.original.unit}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProduct(row.original);
              setShowDetailsModal(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Quản lý thông tin sản phẩm và danh mục</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Select
            placeholder="Chọn danh mục"
            value={filters.categoryId || ''}
            onValueChange={(value) => setFilters({ ...filters, categoryId: value || undefined })}
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Trạng thái"
            value={filters.isActive?.toString() || ''}
            onValueChange={(value) => setFilters({ ...filters, isActive: value ? value === 'true' : undefined })}
          >
            <option value="">Tất cả</option>
            <option value="true">Hoạt động</option>
            <option value="false">Tạm dừng</option>
          </Select>
          <Select
            placeholder="Tồn kho"
            value={filters.hasStock?.toString() || ''}
            onValueChange={(value) => setFilters({ ...filters, hasStock: value ? value === 'true' : undefined })}
          >
            <option value="">Tất cả</option>
            <option value="true">Còn hàng</option>
            <option value="false">Hết hàng</option>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Đã chọn {selectedProducts.length} sản phẩm
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Xuất Excel
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa đã chọn
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <DataTable
          columns={columns}
          data={productsData?.data || []}
          loading={isLoading}
          pagination={{
            page,
            totalPages: Math.ceil((productsData?.total || 0) / 20),
            onPageChange: setPage,
          }}
          onRowSelectionChange={setSelectedProducts}
        />
      </Card>

      {/* Modals */}
      <ProductFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // Refresh data
        }}
      />

      <ProductDetailsModal
        product={selectedProduct}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
