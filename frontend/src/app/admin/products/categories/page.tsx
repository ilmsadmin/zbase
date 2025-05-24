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
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<ProductCategory | null>(null);
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading, isError } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const result = await productsApi.getCategories();
      console.log('Categories API raw response:', JSON.stringify(result, null, 2));
      return result;
    },
    enabled: !isLoading && isAuthenticated, // Only run query when auth state is resolved and user is authenticated
    retry: 1, // Only retry once to avoid excessive retries
  });

  // Mutation to update category order
  const reorderMutation = useMutation({
    mutationFn: async (data: { id: string; parentId?: string | null }[]) => {
      return productsApi.updateCategory(data[0].id, data[0].parentId ? { parentId: data[0].parentId } : { parentId: null });
    },
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
  const rootCategories = categories?.filter((category: ProductCategory) => !category.parentId) || [];
  console.log('Raw categories:', categories?.map((c: ProductCategory) => ({ id: c.id, name: c.name, parentId: c.parentId })));
  console.log('Root categories:', rootCategories.map((c: ProductCategory) => ({ id: c.id, name: c.name, parentId: c.parentId })));

  // Organize categories into a nested structure
  const buildCategoryTree = (categories: ProductCategory[] | undefined, parentId?: string | null): ProductCategory[] => {
    if (!categories) return [];
    const filtered = categories.filter(category => parentId === null ? !category.parentId : category.parentId === parentId);
    console.log('Building tree for parentId:', parentId, 'found children:', filtered.map((c: ProductCategory) => ({ id: c.id, name: c.name, parentId: c.parentId })));
    return filtered.map(category => ({
      ...category,
      children: buildCategoryTree(categories, category.id),
    }));
  };

  const categoryTree = buildCategoryTree(categories, null);
  console.log('Built category tree:', { 
    totalCategories: categories?.length,
    rootCategories: categoryTree.length,
    tree: categoryTree 
  });

  const handleDragStart = (category: ProductCategory) => {
    setDraggedCategory(category);
  };

  // Modify the drop handler to accept a category
  const handleDrop = async (targetCategory: ProductCategory | null) => {
    if (!draggedCategory) return;

    // If target is null, make it a root category, otherwise use target's ID
    const targetId = targetCategory?.id || null;

    // Don't allow dropping on self
    if (draggedCategory.id === targetId) return;

    // Don't allow dropping on own child
    const isChild = (parent: ProductCategory, childId: string): boolean => {
      if (parent.id === childId) return true;
      return (parent.children || []).some(child => isChild(child, childId));
    };
    
    if (targetCategory && isChild(draggedCategory, targetCategory.id)) return;

    const data = [{
      id: draggedCategory.id,
      parentId: targetId
    }];

    await reorderMutation.mutateAsync(data);
    setDraggedCategory(null);
  };

  // Don't render anything while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated 
  if (!isAuthenticated) {
    return null;
  }
  // Add debug logging for state changes
  console.log('Rendering categories page:', { 
    isAuthenticated, 
    isLoading, 
    categories, 
    categoriesLoading,
    categoryTreeLength: categoryTree.length
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category Tree</h2>
          
          {categoriesLoading ? (
            <div className="text-center p-4">Loading categories...</div>
          ) : isError ? (
            <div className="text-center p-4 text-red-500">Error loading categories</div>
          ) : rootCategories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Create your first product category to get started"
              onAction={handleAddCategory}
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
