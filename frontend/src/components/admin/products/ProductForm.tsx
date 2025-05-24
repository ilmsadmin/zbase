import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormFileUpload } from '@/components/ui/FormFileUpload';
import { Button } from '@/components/ui/Button';
import { ProductCategory, ProductAttribute } from '@/types/product';

interface ProductFormProps {
  onAddAttribute: () => void;
  onRemoveAttribute: (index: number) => void;
  onAttributeChange: (index: number, field: 'name' | 'value', value: string) => void;
  onImageChange: (file: File | null) => void;
  attributes: Array<Partial<ProductAttribute>>;
  categories?: ProductCategory[];
  imageUrl?: string;
}

export function ProductForm({ 
  onAddAttribute, 
  onRemoveAttribute, 
  onAttributeChange, 
  onImageChange,
  attributes,
  categories,
  imageUrl
}: ProductFormProps) {
  const { register, formState: { errors }, control, setValue, watch } = useFormContext();

  // Add logging for debugging
  useEffect(() => {
    console.log('Categories data:', categories);
    const categoryId = watch('categoryId');
    console.log('Selected categoryId:', categoryId);
  }, [categories, watch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormInput
          label="Product Name"
          placeholder="Enter product name"
          {...register('name')}
        />

        <FormTextarea
          label="Description"
          placeholder="Enter product description"
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="SKU"
            placeholder="Enter SKU"
            {...register('sku')}
          />

          <FormInput
            label="Barcode"
            placeholder="Enter barcode (optional)"
            {...register('barcode')}
          />
        </div>        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormSelect
              name={field.name}
              label="Category"
              placeholder="Select category"
              options={categories?.map(category => ({
                label: category.name,
                value: String(category.id) // Convert number to string for select
              })) || []}
              value={field.value || ''}
              onChange={field.onChange}
              isClearable
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="number"
            step="0.01"
            label="Price"
            placeholder="Enter price"
            {...register('price', { valueAsNumber: true })}
          />

          <FormInput
            type="number"
            step="0.01"
            label="Cost Price (optional)"
            placeholder="Enter cost price"
            {...register('costPrice', { 
              valueAsNumber: true, 
              setValueAs: v => v === '' ? undefined : Number(v) 
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Unit"
            placeholder="e.g., piece, kg, liter"
            {...register('unit')}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center h-full pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Product
                </label>
              </div>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="number"
            label="Min Stock Level"
            placeholder="Enter min stock"
            {...register('minStockLevel', { 
              valueAsNumber: true, 
              setValueAs: v => v === '' ? undefined : Number(v) 
            })}
          />

          <FormInput
            type="number"
            label="Max Stock Level"
            placeholder="Enter max stock"
            {...register('maxStockLevel', { 
              valueAsNumber: true, 
              setValueAs: v => v === '' ? undefined : Number(v) 
            })}
          />
        </div>

        <FormInput
          type="number"
          label="Reorder Level"
          placeholder="Enter reorder level"
          {...register('reorderLevel', { 
            valueAsNumber: true, 
            setValueAs: v => v === '' ? undefined : Number(v) 
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="number"
            step="0.01"
            label="Weight (kg, optional)"
            placeholder="Enter weight"
            {...register('weight', { 
              valueAsNumber: true, 
              setValueAs: v => v === '' ? undefined : Number(v) 
            })}
          />

          <FormInput
            label="Dimensions (optional)"
            placeholder="e.g., 10x20x30 cm"
            {...register('dimensions')}
          />
        </div>

        <FormFileUpload
          label="Product Image"
          onChange={onImageChange}
          initialPreview={imageUrl}
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Attributes</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddAttribute}
            >
              Add Attribute
            </Button>
          </div>

          <div className="space-y-3">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={attr.name || ''}
                  onChange={(e) => onAttributeChange(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="text"
                  value={attr.value || ''}
                  onChange={(e) => onAttributeChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveAttribute(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
