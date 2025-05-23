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

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

const adjustmentSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  quantity: z.number().refine(val => val !== 0, {
    message: 'Quantity cannot be zero',
  }),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

// Predefined reasons for stock adjustments
const ADJUSTMENT_REASONS = [
  { label: 'Stock Count Adjustment', value: 'STOCK_COUNT' },
  { label: 'Damaged/Expired', value: 'DAMAGE_EXPIRY' },
  { label: 'Return to Supplier', value: 'RETURN_TO_SUPPLIER' },
  { label: 'Administrative Adjustment', value: 'ADMINISTRATIVE' },
  { label: 'Initial Stock', value: 'INITIAL_STOCK' },
  { label: 'Other', value: 'OTHER' },
];

export function StockAdjustmentModal({ isOpen, onClose, productId }: StockAdjustmentModalProps) {
  const queryClient = useQueryClient();
  const [selectedReason, setSelectedReason] = useState('');
  
  // Fetch products for select
  const { data: products } = useQuery({
    queryKey: ['productsForAdjustment'],
    queryFn: () => productsApi.getProducts({ limit: 100 }),
  });

  // Fetch warehouses for select
  const { data: warehouses } = useQuery({
    queryKey: ['warehousesForAdjustment'],
    queryFn: () => warehousesApi.getWarehouses({ isActive: true }),
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      productId: productId || '',
      warehouseId: '',
      quantity: 0,
      reason: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (productId) {
      setValue('productId', productId);
    }
  }, [productId, setValue]);

  // Create stock adjustment mutation
  const adjustmentMutation = useMutation({
    mutationFn: (data: AdjustmentFormData) => inventoryApi.createStockAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
      onClose();
      reset();
    },
  });

  const onSubmit = async (data: AdjustmentFormData) => {
    adjustmentMutation.mutate(data);
  };

  const watchedProductId = watch('productId');
  const selectedProduct = products?.data.find(p => p.id === watchedProductId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Adjustment"
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

        <FormSelect
          label="Warehouse"
          placeholder="Select warehouse"
          options={warehouses?.map(warehouse => ({
            label: warehouse.name,
            value: warehouse.id
          })) || []}
          value={watch('warehouseId') || ''}
          onChange={(value) => setValue('warehouseId', value || '')}
          error={errors.warehouseId?.message}
        />

        <FormInput
          label={`Quantity${selectedProduct ? ` (${selectedProduct.unit})` : ''}`}
          type="number"
          placeholder="Enter quantity (use negative for decrease)"
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
          helperText="Use positive values to increase stock, negative to decrease"
        />

        <FormSelect
          label="Reason"
          placeholder="Select reason"
          options={ADJUSTMENT_REASONS}
          value={selectedReason}
          onChange={(value) => {
            setSelectedReason(value || '');
            setValue('reason', value || '');
          }}
          error={errors.reason?.message}
        />

        {selectedReason === 'OTHER' && (
          <FormInput
            label="Other Reason"
            placeholder="Specify the reason"
            error={errors.reason?.message}
            {...register('reason')}
          />
        )}

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
            isLoading={adjustmentMutation.isPending}
          >
            Adjust Stock
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
