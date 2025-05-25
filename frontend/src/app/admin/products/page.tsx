"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Product, ProductFilters } from '@/types/product';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { Badge } from '@/components/ui/Badge';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/format';

export default function ProductsPage() {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categoryId: undefined,
    isActive: undefined,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch product categories for filter
  const { data: categories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => productsApi.getCategories(),
  });

  // Fetch products with filters
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm không?`)) {
      await productsApi.bulkDeleteProducts(selectedProducts);
      setSelectedProducts([]);
    }
  };
  const columns = [
    {
      header: 'Tên sản phẩm',
      accessorKey: 'name',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">Mã: {row.original.sku}</div>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      accessorKey: 'category.name',
      cell: ({ row }: { row: any }) => row.original.category?.name || 'Chưa phân loại',
    },
    {
      header: 'Giá',
      accessorKey: 'price',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.price),
    },
    {
      header: 'Tồn kho',
      accessorKey: 'inventory',
      cell: ({ row }: { row: any }) => {
        const totalStock = row.original.inventory?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        const lowStock = totalStock <= (row.original.minStockLevel || 0);
        
        return (
          <div>
            <div className="font-medium">{totalStock} {row.original.unit}s</div>
            {lowStock && <Badge variant="destructive">Sắp hết hàng</Badge>}
          </div>
        );
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'isActive',
      cell: ({ row }: { row: any }) => (        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Đang bán' : 'Ngừng bán'}
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditProduct(row.original)}
          >
            Sửa
          </Button>
          <Button 
            variant="link" 
            size="sm"
            onClick={() => window.location.href = `/admin/products/${row.original.id}`}
          >
            Xem
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">            <FormInput              name="search"
              label="Tìm kiếm sản phẩm"
              placeholder="Tìm theo tên, mã, mã vạch..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />            <FormSelect              name="categoryId"
              label="Danh mục"
              placeholder="Tất cả danh mục"options={
                categories?.map((category: any) => ({
                  label: category.name,
                  value: category.id
                })) || []
              }
              value={filters.categoryId || ''}
              onChange={(value) => setFilters({ ...filters, categoryId: value || undefined })}
              isClearable
            />            <FormSelect              name="status"
              label="Trạng thái"
              placeholder="Tất cả trạng thái"
              options={[
                { label: 'Đang bán', value: 'true' },
                { label: 'Ngừng bán', value: 'false' }
              ]}
              value={filters.isActive !== undefined ? String(filters.isActive) : ''}
              onChange={(value) => setFilters({ 
                ...filters, 
                isActive: value ? value === 'true' : undefined 
              })}
              isClearable
            />
          </div>
        </div>
      </Card>

      <Card>
        {selectedProducts.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">              <span className="text-sm">{selectedProducts.length} sản phẩm đã chọn</span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Bỏ chọn
                </Button>                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Xóa đã chọn
                </Button>
              </div>
            </div>
          </div>
        )}        {isLoading ? (
          <div className="p-6 text-center">Đang tải sản phẩm...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">Lỗi khi tải dữ liệu sản phẩm</div>
        ) : productsData?.data.length === 0 ? (          <EmptyState
            title="Không tìm thấy sản phẩm nào"
            description="Tạo sản phẩm đầu tiên của bạn để bắt đầu"
            actionLabel="Thêm sản phẩm"
            onAction={handleAddProduct}
          />
        ) : (
          <DataTable
            data={productsData?.data || []}
            columns={columns}
            onRowSelectionChange={setSelectedProducts}
            selectedRows={selectedProducts}
          />
        )}
      </Card>

      {isProductFormOpen && (
        <ProductFormModal
          isOpen={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          product={editingProduct}
        />
      )}
    </div>
  );
}
