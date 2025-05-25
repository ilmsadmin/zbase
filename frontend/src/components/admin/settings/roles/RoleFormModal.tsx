import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, FormInput, FormTextarea } from '@/components/ui';
import rolesService from '@/lib/services/rolesService';

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
  onSuccess?: () => void;
}

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name cannot exceed 50 characters'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export function RoleFormModal({ open, onClose, title, role, onSuccess }: RoleFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!role;
  const isSystemRole = role?.isSystem || false;
  
  const defaultValues: RoleFormValues = {
    name: role?.name || '',
    description: role?.description || '',
  };  const methods = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });
  
  const { 
    handleSubmit, 
    formState: { errors }, 
    reset
  } = methods;

  // Reset form when role changes
  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
    setError(null);
  }, [role, reset]);
    const onSubmit = async (data: RoleFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && role) {
        // Update existing role
        await rolesService.update(parseInt(role.id), {
          name: data.name,
          description: data.description,
        });
      } else {
        // Create new role
        await rolesService.create({
          name: data.name,
          description: data.description,
        });
      }
      
      reset();
      onClose();
      onSuccess?.(); // Call success callback to refresh data
    } catch (error) {
      console.error('Error submitting role form:', error);
      setError(isEditMode ? 'Không thể cập nhật vai trò. Vui lòng thử lại.' : 'Không thể tạo vai trò. Vui lòng thử lại.');
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
        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <FormInput
              label="Tên vai trò"
              name="name"
              helperText={errors.name?.message}
              disabled={isSystemRole}
            />
          </div>
          
          <div className="mb-4">
            <FormTextarea
              label="Mô tả"
              name="description"
              helperText={errors.description?.message}
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
              Hủy
            </Button>
            
            {!isSystemRole && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : isEditMode ? 'Cập nhật vai trò' : 'Tạo vai trò'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
