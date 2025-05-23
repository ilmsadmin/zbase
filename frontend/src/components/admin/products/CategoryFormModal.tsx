import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Dialog } from '@/components/ui/Dialog';
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

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
    },
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => productsApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      onClose();
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => 
      productsApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      onClose();
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (category) {
      updateMutation.mutate({ id: category.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter out the current category and its descendants from parent options
  const isDescendant = (parentId: string, childId: string): boolean => {
    if (parentId === childId) return true;
    
    const parent = categories.find(c => c.id === parentId);
    if (!parent || !parent.children) return false;
    
    return parent.children.some(child => 
      child.id === childId || isDescendant(child.id, childId)
    );
  };

  const availableParents = categories.filter(c => 
    !category || !isDescendant(c.id, category.id)
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Category Name"
          placeholder="Enter category name"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormTextarea
          label="Description (optional)"
          placeholder="Enter category description"
          error={errors.description?.message}
          {...register('description')}
        />

        <FormSelect
          label="Parent Category (optional)"
          placeholder="Select parent category"
          options={availableParents.map(category => ({
            label: category.name,
            value: category.id
          }))}
          value={watch('parentId') || ''}
          onChange={(value) => setValue('parentId', value || '')}
          error={errors.parentId?.message}
          isClearable
        />

        <div className="flex justify-end space-x-3 pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
