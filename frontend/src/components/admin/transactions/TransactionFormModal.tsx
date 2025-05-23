import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { CustomerSearch } from '@/components/admin/customers/CustomerSearch';
import { PartnerSearch } from '@/components/admin/partners/PartnerSearch';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
}

const transactionSchema = z.object({
  transactionType: z.enum(['receipt', 'payment']),
  transactionMethod: z.string().min(1, 'Transaction method is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  transactionDate: z.string().optional(),
  customerId: z.string().optional(),
  partnerId: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionFormModal({ isOpen, onClose, transaction }: TransactionFormModalProps) {
  const queryClient = useQueryClient();
  const [transactionType, setTransactionType] = useState<'receipt' | 'payment'>(
    transaction?.transactionType || 'receipt'
  );

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionType: transaction?.transactionType || 'receipt',
      transactionMethod: transaction?.transactionMethod || 'cash',
      amount: transaction?.amount || 0,
      transactionDate: transaction?.transactionDate || new Date().toISOString().split('T')[0],
      customerId: transaction?.customerId || '',
      partnerId: transaction?.partnerId || '',
      reference: transaction?.reference || '',
      notes: transaction?.notes || '',
    },
  });

  // Watch for transaction type changes
  const watchedTransactionType = watch('transactionType');

  const createTransactionMutation = useMutation({
    mutationFn: (data: TransactionFormData) => {
      return transactionsApi.createTransaction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction');
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (data: { id: string; transaction: TransactionFormData }) => {
      return transactionsApi.updateTransaction(data.id, data.transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    if (transaction) {
      updateTransactionMutation.mutate({ id: transaction.id, transaction: data });
    } else {
      createTransactionMutation.mutate(data);
    }
  };

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value as 'receipt' | 'payment');
    setValue('transactionType', value as 'receipt' | 'payment');
  };

  const handleCustomerSelect = (customerId: string) => {
    setValue('customerId', customerId);
    // Clear partner if customer is selected
    setValue('partnerId', '');
  };

  const handlePartnerSelect = (partnerId: string) => {
    setValue('partnerId', partnerId);
    // Clear customer if partner is selected
    setValue('customerId', '');
  };

  const transactionTypeOptions = [
    { value: 'receipt', label: 'Receipt (Money In)' },
    { value: 'payment', label: 'Payment (Money Out)' },
  ];

  const transactionMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'check', label: 'Check' },
    { value: 'e_wallet', label: 'E-Wallet' },
  ];

  return (
    <Dialog
      title={transaction ? 'Edit Transaction' : 'Add New Transaction'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <Controller
            name="transactionType"
            control={control}
            render={({ field }) => (
              <FormSelect
                options={transactionTypeOptions}
                value={field.value}
                onChange={(value) => handleTransactionTypeChange(value)}
                error={errors.transactionType?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {watchedTransactionType === 'receipt' ? 'Received From' : 'Paid To'}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <CustomerSearch onSelect={handleCustomerSelect} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner/Supplier
              </label>
              <PartnerSearch onSelect={handlePartnerSelect} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <FormInput
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Method
          </label>
          <Controller
            name="transactionMethod"
            control={control}
            render={({ field }) => (
              <FormSelect
                options={transactionMethodOptions}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={errors.transactionMethod?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Date
          </label>
          <FormInput
            type="date"
            {...register('transactionDate')}
            error={errors.transactionDate?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reference
          </label>
          <FormInput
            placeholder="Invoice number, PO number, etc."
            {...register('reference')}
            error={errors.reference?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <FormTextarea
            placeholder="Enter any additional notes"
            {...register('notes')}
            error={errors.notes?.message}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createTransactionMutation.isPending || updateTransactionMutation.isPending}
          >
            {transaction ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
