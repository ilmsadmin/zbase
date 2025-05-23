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
import { useCustomerGroups, useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { Customer, CustomerGroup } from '@/lib/services/customersService';
import { useToast } from '@/hooks/useToast';

// Validation schema
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  groupId: z.string().optional(), // Will be converted to number in service layer
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerForm({ isOpen, onClose, customer }: CustomerFormProps) {
  const isEditing = !!customer;
  const { success, error } = useToast();
  
  // Debug customer information
  console.log('Customer data in form:', customer);
  if (customer && customer.group) {
    console.log('Customer group data:', customer.group, 'groupId:', customer.groupId);
  }
  
  // Fetch customer groups
  const { data: groups, isLoading: loadingGroups } = useCustomerGroups();
  console.log('Customer groups data:', groups);
  
  // Setup form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      groupId: '',
    }
  });  // Set form values when editing
  useEffect(() => {
    if (customer) {
      console.log('Setting form values from customer:', customer);
      
      // Handle group data properly - check all possible ways the group data might be provided
      let groupId = '';
      if (customer.groupId) {
        groupId = customer.groupId;
      } else if (customer.group && customer.group.id) {
        groupId = String(customer.group.id);
      }
      
      console.log('Setting groupId in form to:', groupId);
      
      reset({
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        notes: customer.notes || '',
        groupId: groupId,
      });
    }
  }, [customer, reset]);
    // Update form values when groups are loaded (to ensure the group select is populated)
  useEffect(() => {
    if (customer && groups && groups.items) {
      // Reapply the groupId after groups are loaded
      let groupId = '';
      if (customer.groupId) {
        groupId = customer.groupId;
      } else if (customer.group && customer.group.id) {
        groupId = String(customer.group.id);
      }
      
      if (groupId) {
        console.log('Updating groupId after groups loaded:', groupId);
        setValue('groupId', groupId);
      }
    }
  }, [groups, customer, setValue]);
  
  // Update form values when groups are loaded (to ensure the group select is populated)
  useEffect(() => {
    if (customer && groups && groups.length > 0) {
      // Reapply the groupId after groups are loaded
      let groupId = '';
      if (customer.groupId) {
        groupId = customer.groupId;
      } else if (customer.group && customer.group.id) {
        groupId = String(customer.group.id);
      }
      
      if (groupId) {
        console.log('Updating groupId after groups loaded:', groupId);
        setValue('groupId', groupId);
      }
    }
  }, [groups, customer, setValue]);

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();  // Form submission
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      // Process data to match backend expectations
      const processedData = {
        ...data,
        // Note: groupId will be converted to number in the service layer
        // Note: isActive is intentionally omitted as it's not supported in the backend DTO
        code: customer?.code || `C-${Date.now()}`, // Make sure we keep the existing code or generate a temporary one
        isActive: true, // Keep isActive field
      };
      
      if (isEditing && customer) {
        await updateCustomer.mutateAsync({
          id: customer.id,
          data: processedData
        });
        success("Customer updated successfully");      } else {
        await createCustomer.mutateAsync(processedData);
        success("Customer created successfully");
      }
      onClose();} catch (err) {
      // Error is handled by the useMutationWithErrorHandling hook
      console.error('Form submission error:', err);
      error("Failed to save customer information");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update customer information' : 'Add a new customer to your system'}
          </DialogDescription>
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
            </div>            <div className="space-y-2">
              <label htmlFor="groupId" className="text-sm font-medium">Customer Group</label>
              <select
                id="groupId"
                {...register('groupId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Group</option>
                {groups && Array.isArray(groups.items) && groups.items.map((group) => {
                  console.log('Group option:', group.id, group.name, 'Selected:', customer?.groupId === String(group.id));
                  return (
                    <option key={group.id} value={String(group.id)}>
                      {group.name}
                    </option>
                  );
                })}
              </select>
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
