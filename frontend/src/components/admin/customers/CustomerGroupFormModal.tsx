"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/services/api/customers';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Modal } from '@/components/ui/Modal';

interface CustomerGroupFormModalProps {
  group: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CustomerGroupFormModal({
  group,
  isOpen,
  onClose,
  onSave
}: CustomerGroupFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!group;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '0',
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        discount: group.discount?.toString() || '0',
      });
    }
  }, [group]);

  const createMutation = useMutation({
    mutationFn: (data: any) => customersApi.createCustomerGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerGroups'] });
      onSave();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => customersApi.updateCustomerGroup(group.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerGroups'] });
      onSave();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const groupData = {
      ...formData,
      discount: parseFloat(formData.discount),
    };

    if (isEditing) {
      updateMutation.mutate(groupData);
    } else {
      createMutation.mutate(groupData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Group: ${group.name}` : 'Add New Customer Group'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Group Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <FormInput
          label="Discount (%)"
          name="discount"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.discount}
          onChange={handleChange}
          helperText="Default discount percentage for this group"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Update' : 'Create'} Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}
