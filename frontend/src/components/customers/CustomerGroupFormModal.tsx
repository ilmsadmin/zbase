"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  createdAt: string;
}

interface CustomerGroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  group: CustomerGroup | null;
}

export function CustomerGroupFormModal({
  isOpen,
  onClose,
  onSubmit,
  group,
}: CustomerGroupFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
  });

  // Khi component mount hoặc khi group thay đổi, cập nhật formData
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      name: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      // Giả lập API call, trong môi trường thực tế sẽ gọi API backend
      console.log('Submitting group data:', {
        id: group?.id,
        ...formData,
      });
      
      // Báo thành công và đóng modal
      onSubmit();
    } catch (error) {
      console.error('Error saving customer group:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {group ? 'Edit Customer Group' : 'Add Customer Group'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Group Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {group ? 'Update Group' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
