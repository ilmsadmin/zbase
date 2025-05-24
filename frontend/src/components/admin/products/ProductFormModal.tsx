import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Product, ProductAttribute, ProductCategory } from '@/types/product';
import { ProductForm } from './ProductForm';

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
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().min(0, 'Cost price must be positive').optional(),
  unit: z.string().min(1, 'Unit is required'),
  minStockLevel: z.number().min(0, 'Minimum stock level must be positive').optional(),
  maxStockLevel: z.number().min(0, 'Maximum stock level must be positive').optional(),
  reorderLevel: z.number().min(0, 'Reorder level must be positive').optional(),
  weight: z.number().min(0, 'Weight must be positive').optional(),
  dimensions: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
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
  const categoriesQuery = useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: async () => {
      return await productsApi.getCategories();
    },
    initialData: [],
  });

  const methods = useForm<ProductFormData>({
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

  // Update form when product changes
  useEffect(() => {
    if (product) {
      const formData = {
        name: product.name,
        description: product.description || '',
        sku: product.sku,
        barcode: product.barcode || '',
        categoryId: String(product.categoryId), // Convert to string for form
        price: product.price,
        costPrice: product.costPrice,
        unit: product.unit,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        reorderLevel: product.reorderLevel,
        weight: product.weight,
        dimensions: product.dimensions || '',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive ?? true,
      };
      methods.reset(formData);

      if (product.attributes) {
        setAttributes(product.attributes.map(attr => ({
          id: String(attr.id),
          name: attr.name,
          value: attr.value
        })));
      }
    }
  }, [product, methods]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add all form fields except attributes
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'attributes' && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Add attributes
      attributes.forEach((attr, index) => {
        if (attr.name && attr.value) {
          formData.append(`attributes[${index}].name`, attr.name);
          formData.append(`attributes[${index}].value`, attr.value);
        }
      });

      return productsApi.createProduct(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (!product) return Promise.reject(new Error('No product to update'));
      
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add all form fields except attributes
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'attributes' && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Add attributes
      attributes.forEach((attr, index) => {
        if (attr.name && attr.value) {
          formData.append(`attributes[${index}].name`, attr.name);
          formData.append(`attributes[${index}].value`, attr.value);
          if (attr.id) {
            formData.append(`attributes[${index}].id`, attr.id);
          }
        }
      });

      return productsApi.updateProduct(product.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (product) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl" aria-describedby="product-form-description">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <p id="product-form-description" className="text-sm text-muted-foreground">
            {product ? 'Update the product details below.' : 'Fill in the product details below.'}
          </p>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <ProductForm
              onAddAttribute={handleAddAttribute}
              onRemoveAttribute={handleRemoveAttribute}
              onAttributeChange={handleAttributeChange}
              onImageChange={handleImageChange}
              attributes={attributes}
              categories={categoriesQuery.data}
              imageUrl={product?.imageUrl}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
