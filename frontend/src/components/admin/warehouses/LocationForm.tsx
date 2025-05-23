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
import { Select } from '@/components/ui/Select';
import { useCreateLocation, useUpdateLocation, useWarehouseLocations } from '@/hooks/useWarehouses';
import { WarehouseLocation } from '@/lib/services/warehousesService';
import { useToast } from '@/hooks/useToast';

// Validation schema
const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  type: z.enum(["ZONE", "AISLE", "RACK", "SHELF", "BIN"]),
  parentId: z.string().optional(),
  description: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseId: string;
  location?: WarehouseLocation | null;
  parentId?: string;
}

export function LocationForm({ isOpen, onClose, warehouseId, location, parentId }: LocationFormProps) {
  const isEditing = !!location;
  const { toast } = useToast();
  
  // Fetch potential parent locations
  const { data: locations } = useWarehouseLocations({
    warehouseId,
  });
  
  // Setup form
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      code: '',
      type: 'ZONE',
      parentId: parentId || '',
      description: '',
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (location) {
      reset({
        name: location.name,
        code: location.code,
        type: location.type,
        parentId: location.parentId || '',
        description: location.description || '',
      });
    } else if (parentId) {
      setValue('parentId', parentId);
    }
  }, [location, parentId, reset, setValue]);

  // Mutations
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  
  // Form submission
  const onSubmit = async (data: LocationFormValues) => {
    try {
      // Preprocess data - remove empty string parentId
      const processedData = {
        ...data,
        parentId: data.parentId || undefined,
        warehouseId, // Add warehouse ID 
      };
      
      if (isEditing && location) {
        await updateLocation.mutateAsync({
          id: location.id,
          data: processedData
        });
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        await createLocation.mutateAsync(processedData);
        toast({
          title: "Success",
          description: "Location created successfully",
        });
      }
      onClose();
    } catch (error) {
      // Error is handled by the useMutationWithErrorHandling hook
      console.error('Form submission error:', error);
    }
  };
  
  // Get available parent locations, excluding the current location and its children
  const getAvailableParents = () => {
    if (!locations) return [];
    
    // If editing, exclude self and children
    if (isEditing && location) {
      // Function to get all descendant IDs recursively
      const getDescendantIds = (locationId: string): string[] => {
        const children = locations.items.filter(loc => loc.parentId === locationId);
        if (children.length === 0) return [];
        
        const childrenIds = children.map(child => child.id);
        const descendantIds = children.flatMap(child => getDescendantIds(child.id));
        return [...childrenIds, ...descendantIds];
      };
      
      const excludeIds = [location.id, ...getDescendantIds(location.id)];
      return locations.items.filter(loc => !excludeIds.includes(loc.id));
    }
    
    return locations.items;
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Location' : 'Add New Location'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Location Name</label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Zone A"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Location Code</label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="ZONE-A"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Location Type</label>
                <select
                  id="type"
                  {...register('type')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ZONE">Zone</option>
                  <option value="AISLE">Aisle</option>
                  <option value="RACK">Rack</option>
                  <option value="SHELF">Shelf</option>
                  <option value="BIN">Bin</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="parentId" className="text-sm font-medium">Parent Location</label>
                <select
                  id="parentId"
                  {...register('parentId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No Parent (Root)</option>
                  {availableParents.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Location description..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLocation.isPending || updateLocation.isPending}>
              {createLocation.isPending || updateLocation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
