import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/lib/services/productsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Product as ProductType, ProductAttribute, ProductCategory, CreateProductDto, UpdateProductDto } from '@/types/product';
import { ProductForm } from './ProductForm';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductType | null;
}

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  sku: z.string().min(1, 'Mã SKU là bắt buộc'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  price: z.number().min(0, 'Giá phải là số dương'),
  costPrice: z.number().min(0, 'Giá vốn phải là số dương').optional(),
  unit: z.string().min(1, 'Đơn vị tính là bắt buộc'),
  minStockLevel: z.number().min(0, 'Tồn kho tối thiểu phải là số dương').optional(),
  maxStockLevel: z.number().min(0, 'Tồn kho tối đa phải là số dương').optional(),
  reorderLevel: z.number().min(0, 'Mức đặt lại phải là số dương').optional(),
  weight: z.number().min(0, 'Trọng lượng phải là số dương').optional(),
  dimensions: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  attributes: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Tên thuộc tính là bắt buộc'),
      value: z.string().min(1, 'Giá trị thuộc tính là bắt buộc'),
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
      return await productsService.getCategories();
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
        // Handle backend field mapping: use sku if available, otherwise use code
        sku: product.sku || (product as any).code || '',
        barcode: product.barcode || '',
        categoryId: String(product.categoryId), // Convert to string for form
        // Handle backend field mapping: use price if available, otherwise use basePrice
        price: product.price || (product as any).basePrice || 0,
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
      methods.reset(formData);if (product.attributes) {
        // Handle both array format (from types/product.ts) and Record format (from productsService)
        if (Array.isArray(product.attributes)) {
          setAttributes(product.attributes.map(attr => ({
            id: String(attr.id),
            name: attr.name,
            value: attr.value
          })));
        } else {
          // Convert Record format to array format
          setAttributes(Object.entries(product.attributes).map(([name, value]) => ({
            name,
            value: String(value)
          })));
        }
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
  };  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      // Convert attributes array to Record format
      const attributesRecord: Record<string, string> = {};
      attributes
        .filter(attr => attr.name && attr.value)
        .forEach(attr => {
          if (attr.name && attr.value) {
            attributesRecord[attr.name] = attr.value;
          }
        });

      // Prepare product data object
      const productData = {
        ...data,
        attributes: Object.keys(attributesRecord).length > 0 ? attributesRecord : undefined
      };

      return productsService.createProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (!product) return Promise.reject(new Error('No product to update'));
      
      // Convert attributes array to Record format
      const attributesRecord: Record<string, string> = {};
      attributes
        .filter(attr => attr.name && attr.value)
        .forEach(attr => {
          if (attr.name && attr.value) {
            attributesRecord[attr.name] = attr.value;
          }
        });

      // Prepare product data object
      const productData = {
        ...data,
        attributes: Object.keys(attributesRecord).length > 0 ? attributesRecord : undefined
      };

      return productsService.updateProduct(product.id, productData);
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

  return (    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl" aria-describedby="product-form-description">
        <DialogHeader>
          <DialogTitle>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          <p id="product-form-description" className="text-sm text-muted-foreground">
            {product ? 'Cập nhật thông tin sản phẩm bên dưới.' : 'Điền thông tin sản phẩm bên dưới.'}
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
            />            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
