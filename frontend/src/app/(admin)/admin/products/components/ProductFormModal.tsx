'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { productsApi } from '@/services/api/products';
import { Product, CreateProductDto } from '@/types/product';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Card } from '@/components/ui/Card';

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  sku: z.string().min(1, 'Mã SKU là bắt buộc'),
  barcode: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
  costPrice: z.number().min(0).optional(),
  unit: z.string().min(1, 'Đơn vị tính là bắt buộc'),
  minStockLevel: z.number().min(0).optional(),
  maxStockLevel: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  product?: Product;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({ product, open, onClose, onSuccess }: ProductFormModalProps) {
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(
    product?.attributes?.map(attr => ({ name: attr.name, value: attr.value })) || []
  );
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      categoryId: product.categoryId || undefined,
    } : {
      isActive: true,
      unit: 'Cái',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
      reset();
      setAttributes([]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const formData: CreateProductDto = {
      ...data,
      attributes: attributes.filter(attr => attr.name && attr.value),
    };

    if (product) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            <div>
              <Label htmlFor="sku">Mã SKU *</Label>
              <Input
                id="sku"
                {...register('sku')}
                error={errors.sku?.message}
              />
            </div>
            <div>
              <Label htmlFor="barcode">Mã vạch</Label>
              <Input
                id="barcode"
                {...register('barcode')}
                error={errors.barcode?.message}
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Danh mục</Label>
              <Select
                {...register('categoryId')}
                error={errors.categoryId?.message}
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Giá cả</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Giá bán *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
              />
            </div>
            <div>
              <Label htmlFor="costPrice">Giá vốn</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                {...register('costPrice', { valueAsNumber: true })}
                error={errors.costPrice?.message}
              />
            </div>
            <div>
              <Label htmlFor="unit">Đơn vị tính *</Label>
              <Input
                id="unit"
                {...register('unit')}
                error={errors.unit?.message}
                placeholder="Cái, Kg, Lít..."
              />
            </div>
          </div>
        </Card>

        {/* Inventory Settings */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Cài đặt tồn kho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="minStockLevel">Tồn kho tối thiểu</Label>
              <Input
                id="minStockLevel"
                type="number"
                {...register('minStockLevel', { valueAsNumber: true })}
                error={errors.minStockLevel?.message}
              />
            </div>
            <div>
              <Label htmlFor="maxStockLevel">Tồn kho tối đa</Label>
              <Input
                id="maxStockLevel"
                type="number"
                {...register('maxStockLevel', { valueAsNumber: true })}
                error={errors.maxStockLevel?.message}
              />
            </div>
            <div>
              <Label htmlFor="reorderLevel">Điểm đặt hàng lại</Label>
              <Input
                id="reorderLevel"
                type="number"
                {...register('reorderLevel', { valueAsNumber: true })}
                error={errors.reorderLevel?.message}
              />
            </div>
          </div>
        </Card>

        {/* Physical Properties */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Thuộc tính vật lý</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Trọng lượng (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.001"
                {...register('weight', { valueAsNumber: true })}
                error={errors.weight?.message}
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Kích thước (DxRxC)</Label>
              <Input
                id="dimensions"
                {...register('dimensions')}
                placeholder="30x20x10 cm"
                error={errors.dimensions?.message}
              />
            </div>
          </div>
        </Card>

        {/* Product Attributes */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Thuộc tính sản phẩm</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm thuộc tính
            </Button>
          </div>
          <div className="space-y-3">
            {attributes.map((attribute, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  placeholder="Tên thuộc tính"
                  value={attribute.name}
                  onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Giá trị"
                  value={attribute.value}
                  onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttribute(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Hình ảnh</h3>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {watch('imageUrl') ? (
                <img
                  src={watch('imageUrl')}
                  alt="Product"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="imageUrl">URL hình ảnh</Label>
              <Input
                id="imageUrl"
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <p className="text-sm text-gray-600">Sản phẩm có thể bán hay không</p>
            </div>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {product ? 'Cập nhật' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
