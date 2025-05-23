'use client';

import React, { useState } from 'react';
import { X, Edit, Package, DollarSign, History } from 'lucide-react';
import { Product } from '@/types/product';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DataTable } from '@/components/ui/DataTable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ProductFormModal } from './ProductFormModal';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, open, onClose }: ProductDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!product) return null;

  const inventoryColumns = [
    {
      accessorKey: 'warehouse.name',
      header: 'Kho hàng',
    },
    {
      accessorKey: 'location.name',
      header: 'Vị trí',
      cell: ({ row }: any) => row.original.location?.name || '-',
    },
    {
      accessorKey: 'quantity',
      header: 'Tổng tồn',
    },
    {
      accessorKey: 'reservedQuantity',
      header: 'Đã đặt',
    },
    {
      accessorKey: 'availableQuantity',
      header: 'Có thể bán',
      cell: ({ row }: any) => (
        <Badge variant={row.original.availableQuantity > 0 ? 'success' : 'error'}>
          {row.original.availableQuantity}
        </Badge>
      ),
    },
  ];

  const totalStock = product.inventory?.reduce((sum, inv) => sum + inv.availableQuantity, 0) || 0;

  return (
    <>
      <Modal open={open} onClose={onClose} size="xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image & Basic Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.sku}</p>
                {product.barcode && (
                  <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Giá bán</p>
                    <p className="font-semibold">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tồn kho</p>
                    <p className="font-semibold">{totalStock} {product.unit}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
                <TabsTrigger value="pricing">Giá cả</TabsTrigger>
                <TabsTrigger value="history">Lịch sử</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="ml-2">{product.category?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Đơn vị:</span>
                      <span className="ml-2">{product.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trọng lượng:</span>
                      <span className="ml-2">{product.weight ? `${product.weight} kg` : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kích thước:</span>
                      <span className="ml-2">{product.dimensions || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant={product.isActive ? 'success' : 'secondary'} className="ml-2">
                        {product.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span className="ml-2">{formatDate(product.createdAt)}</span>
                    </div>
                  </div>
                  {product.description && (
                    <div className="mt-4">
                      <span className="text-gray-600 block mb-2">Mô tả:</span>
                      <p className="text-sm">{product.description}</p>
                    </div>
                  )}
                </Card>

                {/* Attributes */}
                {product.attributes && product.attributes.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Thuộc tính</h4>
                    <div className="space-y-2">
                      {product.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{attr.name}:</span>
                          <span>{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Stock Levels */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Cài đặt tồn kho</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Tồn kho tối thiểu</span>
                      <span className="font-medium">{product.minStockLevel || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Tồn kho tối đa</span>
                      <span className="font-medium">{product.maxStockLevel || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Điểm đặt hàng lại</span>
                      <span className="font-medium">{product.reorderLevel || '-'}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="inventory">
                <Card>
                  <DataTable
                    columns={inventoryColumns}
                    data={product.inventory || []}
                    emptyMessage="Không có dữ liệu tồn kho"
                  />
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Thông tin giá</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá bán:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    {product.costPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá vốn:</span>
                        <span className="font-semibold">
                          {formatCurrency(product.costPrice)}
                        </span>
                      </div>
                    )}
                    {product.costPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lợi nhuận:</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(product.price - product.costPrice)} 
                          ({(((product.price - product.costPrice) / product.price) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="p-4">
                  <div className="text-center text-gray-500">
                    <History className="w-8 h-8 mx-auto mb-2" />
                    <p>Lịch sử sẽ được cập nhật sau</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Modal>

      <ProductFormModal
        product={product}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false);
          // Optionally refresh product data
        }}
      />
    </>
  );
}
