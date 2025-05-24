import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { ProductCategory } from '@/types/product';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProductCategory | null;
  categories: ProductCategory[];
}

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryFormModal({ isOpen, onClose, category, categories }: CategoryFormModalProps) {
  const queryClient = useQueryClient();

  // Filter out the current category and its descendants from parent options
  const isDescendant = (parentId: number | null, childId: number): boolean => {
    if (parentId === childId) return true;
    
    const parent = categories.find((c: ProductCategory) => c.id === parentId);
    if (!parent || !parent.children) return false;
    
    return parent.children.some((child: ProductCategory) => 
      child.id === childId || isDescendant(child.id, childId)
    );
  };

  const availableParents = categories.filter((c: ProductCategory) => 
    !category || !isDescendant(c.id, category.id)
  );  // Build indented category label with hierarchy level
  const buildOptionLabel = (category: ProductCategory, level = 0): string => {
    const indent = '⎯'.repeat(level);
    const prefix = level > 0 ? `${indent} ` : '';
    return `${prefix}${category.name}`;
  };

  // Build flattened category options with proper hierarchy
  const buildFlatOptions = (
    categories: ProductCategory[],
    currentPath: string[] = [],
    exclude: string[] = []
  ): { value: string; label: string; isDisabled: boolean }[] => {
    const options: { value: string; label: string; isDisabled: boolean }[] = [];

    categories.forEach(category => {
      // Skip if category is in exclude list (self or descendant)
      if (!exclude.includes(category.id)) {
        const level = currentPath.length;
        const fullPath = [...currentPath, category.name];
        
        // Add current category
        options.push({
          value: String(category.id),
          label: buildOptionLabel(category, level),
          isDisabled: false
        });

        // Recursively add children with updated path
        if (category.children?.length) {
          options.push(...buildFlatOptions(
            category.children,
            fullPath,
            exclude
          ));
        }
      }
    });

    return options;
  };

  // Tạo mảng ID categories cần loại trừ (category hiện tại và con cháu)
  const excludeIds = category ? [category.id] : [];
  if (category) {
    const getDescendantIds = (cat: ProductCategory): string[] => {
      let ids: string[] = [];
      cat.children?.forEach(child => {
        ids.push(child.id);
        ids = [...ids, ...getDescendantIds(child)];
      });
      return ids;
    };
    excludeIds.push(...getDescendantIds(category));
  }

  const parentOptions = [
    { value: '', label: '(No parent - Root category)' },
    ...buildFlatOptions(categories, 0, excludeIds)
  ];

  const methods = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId ? String(category.parentId) : '', // Empty string represents "None"
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const payload = {
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      };
      return productsApi.createCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryFormData }) => {
      const payload = {
        ...data,
        parentId: data.parentId ? Number(data.parentId) : null,
      };
      return productsApi.updateCategory(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      onClose();
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit' : 'New'} Category</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter category name"
            />
            
            <FormTextarea
              name="description"
              label="Description"
              placeholder="Enter category description (optional)"
            />
              <FormSelect
              name="parentId"
              label="Parent Category"
              placeholder="None"
              options={parentOptions}
              isClearable
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                variant={createMutation.isError || updateMutation.isError ? "destructive" : "default"}
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? 'Saving...' 
                  : createMutation.isError || updateMutation.isError
                    ? 'Failed - Try Again'
                    : 'Save'
                }
              </Button>
            </div>
            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-sm text-red-500 mt-2">
                Failed to save category. Please try again.
              </p>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
