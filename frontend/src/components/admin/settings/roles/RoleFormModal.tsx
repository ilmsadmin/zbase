import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, FormInput, FormTextarea } from '@/components/ui';

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  role?: {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
  };
}

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name cannot exceed 50 characters'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export function RoleFormModal({ open, onClose, title, role }: RoleFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!role;
  const isSystemRole = role?.isSystem || false;
  
  const defaultValues: RoleFormValues = {
    name: role?.name || '',
    description: role?.description || '',
  };
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: RoleFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement API call to create/update role
      console.log('Submitting role data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting role form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          &times;
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <FormInput
            label="Role Name"
            {...register('name')}
            error={errors.name?.message}
            disabled={isSystemRole}
          />
        </div>
        
        <div className="mb-4">
          <FormTextarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            disabled={isSystemRole}
            rows={3}
          />
        </div>
        
        {isSystemRole && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            System roles cannot be modified. You can only manage their permissions.
          </div>
        )}
        
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          {!isSystemRole && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Role' : 'Create Role'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
