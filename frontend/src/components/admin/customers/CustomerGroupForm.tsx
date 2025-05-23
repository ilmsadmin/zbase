"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useCreateCustomerGroup, useUpdateCustomerGroup } from '@/hooks/useCustomers';
import { CustomerGroup } from '@/lib/services/customersService';
import { useToast } from '@/hooks/useToast';

// Validation schema
const customerGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  discountPercentage: z.number().min(0, "Discount must be at least 0%").max(100, "Discount cannot exceed 100%").optional(),
});

type CustomerGroupFormValues = z.infer<typeof customerGroupSchema>;

interface CustomerGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  group?: CustomerGroup | null;
}

export function CustomerGroupForm({ isOpen, onClose, group }: CustomerGroupFormProps) {
  const isEditing = !!group;
  const { toast } = useToast();
  
  // Setup form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerGroupFormValues>({
    resolver: zodResolver(customerGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      discountPercentage: 0,
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description || '',
        discountPercentage: group.discountPercentage || 0,
      });
    }
  }, [group, reset]);

  // Mutations
  const createGroup = useCreateCustomerGroup();
  const updateGroup = useUpdateCustomerGroup();
  
  // Form submission
  const onSubmit = async (data: CustomerGroupFormValues) => {
    try {
      if (isEditing && group) {
        await updateGroup.mutateAsync({
          id: group.id,
          data
        });
        toast({
          title: "Success",
          description: "Customer group updated successfully",
        });
      } else {
        await createGroup.mutateAsync(data);
        toast({
          title: "Success",
          description: "Customer group created successfully",
        });
      }
      onClose();
    } catch (error) {
      // Error is handled by the useMutationWithErrorHandling hook
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer Group' : 'Add New Customer Group'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Group Name</label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Group name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Group description..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="discountPercentage" className="text-sm font-medium">Discount Percentage</label>
              <div className="relative">
                <Input
                  id="discountPercentage"
                  type="number"
                  {...register('discountPercentage', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  className={`pr-8 ${errors.discountPercentage ? 'border-red-500' : ''}`}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
              {errors.discountPercentage && (
                <p className="text-red-500 text-xs mt-1">{errors.discountPercentage.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createGroup.isPending || updateGroup.isPending}>
              {createGroup.isPending || updateGroup.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
