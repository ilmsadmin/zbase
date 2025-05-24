"use client";

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormCheckbox } from '@/components/ui/FormCheckboxRadio';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Modal } from '@/components/ui/Modal';

interface AttributeFormModalProps {
  attribute: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AttributeFormModal({
  attribute,
  isOpen,
  onClose,
  onSave
}: AttributeFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!attribute;
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    description: '',
    isRequired: false,
    options: '',
    defaultValue: '',
  });

  useEffect(() => {
    if (attribute) {
      setFormData({
        name: attribute.name || '',
        type: attribute.type || 'text',
        description: attribute.description || '',
        isRequired: attribute.isRequired || false,
        options: attribute.options ? attribute.options.join(', ') : '',
        defaultValue: attribute.defaultValue || '',
      });
    }
  }, [attribute]);

  const createMutation = useMutation({
    mutationFn: (data: any) => productsApi.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      onSave();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => productsApi.updateAttribute(attribute.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      onSave();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const attributeData = {
      ...formData,
      options: formData.type === 'select' || formData.type === 'multiselect' 
        ? formData.options.split(',').map(option => option.trim()).filter(option => option !== '')
        : undefined,
    };

    if (isEditing) {
      updateMutation.mutate(attributeData);
    } else {
      createMutation.mutate(attributeData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Attribute: ${attribute.name}` : 'Add New Attribute'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormSelect
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { label: 'Text', value: 'text' },
            { label: 'Number', value: 'number' },
            { label: 'Select', value: 'select' },
            { label: 'Multi-select', value: 'multiselect' },
            { label: 'Boolean', value: 'boolean' },
            { label: 'Date', value: 'date' },
          ]}
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {(formData.type === 'select' || formData.type === 'multiselect') && (
          <FormTextarea
            label="Options"
            name="options"
            value={formData.options}
            onChange={handleChange}
            helperText="Enter options separated by commas"
          />
        )}

        <FormInput
          label="Default Value"
          name="defaultValue"
          value={formData.defaultValue}
          onChange={handleChange}
        />

        <FormCheckbox
          label="Required"
          name="isRequired"
          checked={formData.isRequired}
          onChange={handleCheckboxChange}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Update' : 'Create'} Attribute
          </Button>
        </div>
      </form>
    </Modal>
  );
}
