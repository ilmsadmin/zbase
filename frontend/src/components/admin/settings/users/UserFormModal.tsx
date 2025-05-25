import { useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, FormInput, FormSelect } from '@/components/ui';
import { UserRole } from '@/types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
  };
}

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  isActive: z.boolean().optional().default(true),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // If we're creating a new user (no password) or editing a user and changing password
  if (!data.password && !data.confirmPassword) return true;
  return data.password === data.confirmPassword;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserFormModal({ open, onClose, title, user }: UserFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!user;
  
  const defaultValues: UserFormValues = user ? {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    password: undefined,
    confirmPassword: undefined,
  } : {
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.CASHIER,
    isActive: true,
    password: undefined,
    confirmPassword: undefined,
  };
    const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues,
  });
  
  const { 
    handleSubmit, 
    formState: { errors }, 
    reset
  } = methods;
  
  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement API call to create/update user
      console.log('Submitting user data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting user form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const roleOptions = Object.values(UserRole).map(role => ({
    label: role,
    value: role,
  }));
  
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
          <div className="grid grid-cols-2 gap-4 mb-4">          
            <FormInput
              label="Họ"
              name="firstName"
              helperText={errors.firstName?.message}
            />
            
            <FormInput
              label="Tên"
              name="lastName"
              helperText={errors.lastName?.message}
            />
          </div>
          
          <div className="mb-4">          
            <FormInput
              label="Email"
              type="email"
              name="email"
              helperText={errors.email?.message}
            />
          </div>
          
          <div className="mb-4">            <FormSelect
              label="Vai trò"
              options={roleOptions}
              name="role"
              helperText={errors.role?.message}
            />
          </div>
          
          {/* Password fields only required for new users or when explicitly changing password */}
          {!isEditMode && (
            <>
              <div className="mb-4">
                <FormInput
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  helperText={errors.password?.message}
                  required={!isEditMode}
                />
              </div>
              
              <div className="mb-4">
                <FormInput
                  label="Xác nhận mật khẩu"
                  type="password"
                  name="confirmPassword"
                  helperText={errors.confirmPassword?.message}
                  required={!isEditMode}
                />
              </div>
            </>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : isEditMode ? 'Cập nhật người dùng' : 'Tạo người dùng'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
