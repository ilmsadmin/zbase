"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { ProductCategory } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryFormModal } from '@/components/admin/products/CategoryFormModal';
import { CategoryTreeItem } from '@/components/admin/products/CategoryTreeItem';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<ProductCategory | null>(null);
  
  // Fetch all categories
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => productsApi.getCategories(),
  });

  // Mutation to update category order
  const reorderMutation = useMutation({
    mutationFn: (data: { id: string; parentId?: string; order: number }[]) => 
      productsApi.reorderCategories(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteCategory = async (category: ProductCategory) => {
    if (confirm(`Are you sure you want to delete ${category.name}?${
      category.children && category.children.length > 0 
        ? ' This will also delete all subcategories!' 
        : ''
    }`)) {
      await productsApi.deleteCategory(category.id);
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    }
  };

  // Build a tree of root categories
  const rootCategories = categories?.filter(category => !category.parentId) || [];

  // Organize categories into a nested structure
  const buildCategoryTree = (categories: ProductCategory[], parentId?: string): ProductCategory[] => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id),
      }));
  };

  const categoryTree = categories ? buildCategoryTree(categories) : [];

  const handleDragStart = (category: ProductCategory) => {
    setDraggedCategory(category);
  };

  const handleDrop = (targetCategory: ProductCategory | null) => {
    if (!draggedCategory) return;

    // Don't allow dropping a category into its own descendant
    const isDescendant = (parent: ProductCategory, child: ProductCategory): boolean => {
      if (!parent.children || parent.children.length === 0) return false;
      return parent.children.some(c => 
        c.id === child.id || isDescendant(c, child)
      );
    };

    if (targetCategory && isDescendant(draggedCategory, targetCategory)) {
      setDraggedCategory(null);
      return;
    }

    // Prepare the updated category
    const updatedCategory = {
      id: draggedCategory.id,
      parentId: targetCategory?.id,
      order: targetCategory?.children?.length || 0,
    };

    // Update the category order
    reorderMutation.mutate([updatedCategory]);
    setDraggedCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category Tree</h2>
          
          {isLoading ? (
            <div className="text-center p-4">Loading categories...</div>
          ) : isError ? (
            <div className="text-center p-4 text-red-500">Error loading categories</div>
          ) : rootCategories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Create your first product category to get started"
              action={
                <Button onClick={handleAddCategory}>
                  Add Category
                </Button>
              }
            />
          ) : (
            <div className="border rounded-md">
              <div className="p-4 border-b bg-gray-50">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500">
                  <div className="col-span-6">Category Name</div>
                  <div className="col-span-3">Products</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
              </div>
              
              <div className="divide-y">
                {categoryTree.map(category => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    level={0}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    isDragging={draggedCategory?.id === category.id}
                  />
                ))}
                
                {/* Drop zone for root level */}
                <div 
                  className={`h-16 flex items-center justify-center border-2 border-dashed ${
                    draggedCategory ? 'border-blue-300 bg-blue-50' : 'border-transparent'
                  }`}
                  onDragOver={(e) => {
                    if (draggedCategory) {
                      e.preventDefault();
                    }
                  }}
                  onDrop={() => handleDrop(null)}
                >
                  {draggedCategory && <span className="text-sm text-blue-500">Drop here to make a root category</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {isFormModalOpen && (
        <CategoryFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          category={editingCategory}
          categories={categories || []}
        />
      )}
    </div>
  );
}
