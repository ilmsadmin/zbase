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
import { useCustomerGroups, useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { Customer } from '@/lib/services/customersService';
import { useToast } from '@/hooks/useToast';

// Validation schema
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  groupId: z.string().optional(),
  creditLimit: z.number().nonnegative("Credit limit must be positive").optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerForm({ isOpen, onClose, customer }: CustomerFormProps) {
  const isEditing = !!customer;
  const { toast } = useToast();
  
  // Fetch customer groups
  const { data: groups, isLoading: loadingGroups } = useCustomerGroups();
  
  // Setup form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      notes: '',
      groupId: '',
      creditLimit: undefined,
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        city: customer.city || '',
        province: customer.province || '',
        postalCode: customer.postalCode || '',
        country: customer.country || '',
        notes: customer.notes || '',
        groupId: customer.groupId || '',
        creditLimit: customer.creditLimit,
      });
    }
  }, [customer, reset]);

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  
  // Form submission
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      // Handle credit limit - convert empty string to undefined
      const processedData = {
        ...data,
        creditLimit: data.creditLimit === undefined ? undefined : Number(data.creditLimit),
      };
      
      if (isEditing && customer) {
        await updateCustomer.mutateAsync({
          id: customer.id,
          data: processedData
        });
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        await createCustomer.mutateAsync(processedData);
        toast({
          title: "Success",
          description: "Customer created successfully",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Customer Name</label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Full Name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Phone number"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Street address"
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="groupId" className="text-sm font-medium">Customer Group</label>
                <select
                  id="groupId"
                  {...register('groupId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No Group</option>
                  {groups?.items?.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="creditLimit" className="text-sm font-medium">Credit Limit</label>
                <Input
                  id="creditLimit"
                  type="number"
                  {...register('creditLimit', { valueAsNumber: true })}
                  placeholder="Credit limit"
                  className={errors.creditLimit ? 'border-red-500' : ''}
                />
                {errors.creditLimit && (
                  <p className="text-red-500 text-xs mt-1">{errors.creditLimit.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCustomer.isPending || updateCustomer.isPending}>
              {createCustomer.isPending || updateCustomer.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
