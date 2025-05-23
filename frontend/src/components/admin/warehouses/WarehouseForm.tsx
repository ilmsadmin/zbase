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
  DialogFooter,
  DialogDescription
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { useCreateWarehouse, useUpdateWarehouse } from '@/hooks/useWarehouses';
import { Warehouse } from '@/lib/services/warehousesService';
import { useToast } from '@/hooks/useToast';

// Validation schema
const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  managerId: z.string().optional(),
  isActive: z.boolean(),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse | null;
}

export function WarehouseForm({ isOpen, onClose, warehouse }: WarehouseFormProps) {
  const isEditing = !!warehouse;
  const toast = useToast();
  
  // Setup form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      managerId: '',
      isActive: true,
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (warehouse) {
      reset({
        name: warehouse.name,
        code: warehouse.code,
        description: warehouse.description || '',
        address: warehouse.address || '',
        city: warehouse.city || '',
        province: warehouse.province || '',
        postalCode: warehouse.postalCode || '',
        country: warehouse.country || '',
        managerId: warehouse.managerId || '',
        isActive: warehouse.isActive,
      });
    }
  }, [warehouse, reset]);

  // Mutations
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  
  // Form submission
  const onSubmit = async (data: WarehouseFormValues) => {
    try {
      if (isEditing && warehouse) {        await updateWarehouse.mutateAsync({
          id: warehouse.id,
          data
        });
        toast.success("Warehouse updated successfully");
      } else {
        await createWarehouse.mutateAsync(data);
        toast.success("Warehouse created successfully");
      }
      onClose();
    } catch (error) {
      // Error is handled by the useMutationWithErrorHandling hook
      console.error('Form submission error:', error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="warehouse-form-description">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
          <DialogDescription id="warehouse-form-description">
            {isEditing ? 'Edit the warehouse details below and save your changes.' : 'Fill in the warehouse details below to create a new warehouse.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Warehouse Name</label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Main Warehouse"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Warehouse Code</label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="WH-001"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Warehouse description..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input
                id="address"
                {...register('address')}
                placeholder="123 Street Name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="City"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="province" className="text-sm font-medium">Province/State</label>
                <Input
                  id="province"
                  {...register('province')}
                  placeholder="Province/State"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="postalCode" className="text-sm font-medium">Postal Code</label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="Postal Code"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">Country</label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="Country"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="managerId" className="text-sm font-medium">Manager ID</label>
              <Input
                id="managerId"
                {...register('managerId')}
                placeholder="Manager ID"
              />
            </div>
              <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={Boolean(warehouse?.isActive ?? true)}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createWarehouse.isPending || updateWarehouse.isPending}>
              {createWarehouse.isPending || updateWarehouse.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
