import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/services/api/inventory';
import { productsApi } from '@/services/api/products';
import { warehousesApi } from '@/services/api/warehouses';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

const transferSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  sourceWarehouseId: z.string().min(1, 'Source warehouse is required'),
  destinationWarehouseId: z.string().min(1, 'Destination warehouse is required'),
  quantity: z.number().positive('Quantity must be positive'),
  notes: z.string().optional(),
}).refine(data => data.sourceWarehouseId !== data.destinationWarehouseId, {
  message: "Source and destination warehouses must be different",
  path: ["destinationWarehouseId"],
});

type TransferFormData = z.infer<typeof transferSchema>;

export function StockTransferModal({ isOpen, onClose, productId }: StockTransferModalProps) {
  const queryClient = useQueryClient();
  
  // Fetch products for select
  const { data: products } = useQuery({
    queryKey: ['productsForTransfer'],
    queryFn: () => productsApi.getProducts({ limit: 100 }),
  });

  // Fetch warehouses for select
  const { data: warehouses } = useQuery({
    queryKey: ['warehousesForTransfer'],
    queryFn: () => warehousesApi.getWarehouses({ isActive: true }),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      productId: productId || '',
      sourceWarehouseId: '',
      destinationWarehouseId: '',
      quantity: 1,
      notes: '',
    },
  });

  useEffect(() => {
    if (productId) {
      setValue('productId', productId);
    }
  }, [productId, setValue]);

  // Create stock transfer mutation
  const transferMutation = useMutation({
    mutationFn: (data: TransferFormData) => inventoryApi.createStockTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
      onClose();
      reset();
    },
  });

  const onSubmit = async (data: TransferFormData) => {
    transferMutation.mutate(data);
  };

  const watchedProductId = watch('productId');
  const selectedProduct = products?.data.find(p => p.id === watchedProductId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Inventory"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          label="Product"
          placeholder="Select product"
          options={products?.data.map(product => ({
            label: `${product.name} (${product.sku})`,
            value: product.id
          })) || []}
          value={watch('productId') || ''}
          onChange={(value) => setValue('productId', value || '')}
          error={errors.productId?.message}
          isDisabled={!!productId}
          isSearchable
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Source Warehouse"
            placeholder="Select source"
            options={warehouses?.map(warehouse => ({
              label: warehouse.name,
              value: warehouse.id
            })) || []}
            value={watch('sourceWarehouseId') || ''}
            onChange={(value) => setValue('sourceWarehouseId', value || '')}
            error={errors.sourceWarehouseId?.message}
          />

          <FormSelect
            label="Destination Warehouse"
            placeholder="Select destination"
            options={warehouses?.map(warehouse => ({
              label: warehouse.name,
              value: warehouse.id
            })) || []}
            value={watch('destinationWarehouseId') || ''}
            onChange={(value) => setValue('destinationWarehouseId', value || '')}
            error={errors.destinationWarehouseId?.message}
          />
        </div>

        <FormInput
          label={`Quantity to Transfer${selectedProduct ? ` (${selectedProduct.unit})` : ''}`}
          type="number"
          min="1"
          placeholder="Enter quantity"
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        <FormTextarea
          label="Notes (optional)"
          placeholder="Enter any additional notes"
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex justify-end space-x-3 pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={transferMutation.isPending}
          >
            Transfer Stock
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
