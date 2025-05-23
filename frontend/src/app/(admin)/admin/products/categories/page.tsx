'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { productsApi } from '@/services/api/products';
import { ProductCategory } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useForm } from 'react-hook-form';

interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
}

interface CategoryNodeProps {
  category: ProductCategory;
  level: number;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
}

function CategoryNode({ category, level, onEdit, onDelete }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center justify-between p-3 hover:bg-gray-50 border-l-2 ${
          level === 0 ? 'border-blue-500' : 'border-gray-200'
        }`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center space-x-3">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          {hasChildren ? (
            isExpanded ? <FolderOpen className="w-5 h-5 text-blue-500" /> : <Folder className="w-5 h-5 text-blue-500" />
          ) : (
            <div className="w-2 h-2 bg-gray-400 rounded-full ml-2" />
          )}
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{category.name}</span>
              <Badge variant={category.isActive ? 'success' : 'secondary'}>
                {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
              </Badge>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600">{category.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>();

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => productsApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowCreateModal(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => 
      productsApi.updateCategory(editingCategory!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const buildCategoryTree = (categories: ProductCategory[]): ProductCategory[] => {
    const categoryMap = new Map<string, ProductCategory>();
    const rootCategories: ProductCategory[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!;
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children!.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  };

  const categoryTree = categories ? buildCategoryTree(categories) : [];

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setValue('parentId', category.parentId || '');
  };

  const handleDelete = (category: ProductCategory) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý cây danh mục sản phẩm</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Category Tree */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : categoryTree.length > 0 ? (
          <div className="divide-y">
            {categoryTree.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                level={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Chưa có danh mục nào</p>
            <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
              Tạo danh mục đầu tiên
            </Button>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={showCreateModal || !!editingCategory}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCategory(null);
          reset();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </h2>

          <div>
            <Label htmlFor="name">Tên danh mục *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Tên danh mục là bắt buộc' })}
              error={errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="parentId">Danh mục cha</Label>
            <Select {...register('parentId')}>
              <option value="">Danh mục gốc</option>
              {categories?.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  disabled={editingCategory?.id === category.id}
                >
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setEditingCategory(null);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
