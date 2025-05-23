import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormFileUpload } from '@/components/ui/FormFileUpload';
import { CreateProductDto, Product, ProductAttribute } from '@/types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().min(0, 'Cost price must be positive').optional(),
  unit: z.string().min(1, 'Unit is required'),
  minStockLevel: z.number().min(0, 'Minimum stock level must be positive').optional(),
  maxStockLevel: z.number().min(0, 'Maximum stock level must be positive').optional(),
  reorderLevel: z.number().min(0, 'Reorder level must be positive').optional(),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  dimensions: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  attributes: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Attribute name is required'),
      value: z.string().min(1, 'Attribute value is required'),
    })
  ).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const [attributes, setAttributes] = useState<Array<Partial<ProductAttribute>>>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Fetch categories for select
  const { data: categories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => productsApi.getCategories(),
  });

  const { register, handleSubmit, formState: { errors }, control, setValue, watch, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      barcode: '',
      categoryId: '',
      price: 0,
      costPrice: undefined,
      unit: 'unit',
      minStockLevel: undefined,
      maxStockLevel: undefined,
      reorderLevel: undefined,
      weight: undefined,
      dimensions: '',
      imageUrl: '',
      isActive: true,
      attributes: [],
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        sku: product.sku,
        barcode: product.barcode || '',
        categoryId: product.categoryId || '',
        price: product.price,
        costPrice: product.costPrice,
        unit: product.unit,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        reorderLevel: product.reorderLevel,
        weight: product.weight,
        dimensions: product.dimensions || '',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
      });

      if (product.attributes) {
        setAttributes(product.attributes);
      }
    }
  }, [product, reset]);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDto> }) => 
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', product?.id] });
      onClose();
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    // Handle image upload if changed
    let imageUrl = data.imageUrl;
    if (imageFile) {
      // In a real application, you'd upload the image to your server or cloud storage
      // For demo purposes, we'll just pretend it was uploaded
      imageUrl = URL.createObjectURL(imageFile);
    }

    const productData = {
      ...data,
      imageUrl,
      attributes: attributes.map(attr => ({
        name: attr.name || '',
        value: attr.value || '',
      })),
    };

    if (product) {
      updateMutation.mutate({ id: product.id, data: productData });
    } else {
      createMutation.mutate(productData as CreateProductDto);
    }
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormInput
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormTextarea
              label="Description"
              placeholder="Enter product description"
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="SKU"
                placeholder="Enter SKU"
                error={errors.sku?.message}
                {...register('sku')}
              />

              <FormInput
                label="Barcode"
                placeholder="Enter barcode (optional)"
                error={errors.barcode?.message}
                {...register('barcode')}
              />
            </div>

            <FormSelect
              label="Category"
              placeholder="Select category"
              options={categories?.map(category => ({
                label: category.name,
                value: category.id
              })) || []}
              value={watch('categoryId') || ''}
              onChange={(value) => setValue('categoryId', value || '')}
              error={errors.categoryId?.message}
              isClearable
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <FormInput
                label="Cost Price (optional)"
                type="number"
                step="0.01"
                placeholder="Enter cost price"
                error={errors.costPrice?.message}
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
                error={errors.unit?.message}
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
                label="Min Stock Level"
                type="number"
                placeholder="Enter min stock"
                error={errors.minStockLevel?.message}
                {...register('minStockLevel', { 
                  valueAsNumber: true, 
                  setValueAs: v => v === '' ? undefined : Number(v) 
                })}
              />

              <FormInput
                label="Max Stock Level"
                type="number"
                placeholder="Enter max stock"
                error={errors.maxStockLevel?.message}
                {...register('maxStockLevel', { 
                  valueAsNumber: true, 
                  setValueAs: v => v === '' ? undefined : Number(v) 
                })}
              />
            </div>

            <FormInput
              label="Reorder Level"
              type="number"
              placeholder="Enter reorder level"
              error={errors.reorderLevel?.message}
              {...register('reorderLevel', { 
                valueAsNumber: true, 
                setValueAs: v => v === '' ? undefined : Number(v) 
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Weight (kg, optional)"
                type="number"
                step="0.01"
                placeholder="Enter weight"
                error={errors.weight?.message}
                {...register('weight', { 
                  valueAsNumber: true, 
                  setValueAs: v => v === '' ? undefined : Number(v) 
                })}
              />

              <FormInput
                label="Dimensions (optional)"
                placeholder="e.g., 10x20x30 cm"
                error={errors.dimensions?.message}
                {...register('dimensions')}
              />
            </div>

            <FormFileUpload
              label="Product Image"
              onChange={handleImageChange}
              initialPreview={product?.imageUrl}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Attributes</label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddAttribute}
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
                      onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                      placeholder="Name"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      value={attr.value || ''}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
