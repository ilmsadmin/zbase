"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { invoicesApi } from '@/services/api/invoices';
import { productsApi } from '@/services/api/products';
import { warehousesApi } from '@/services/api/warehouses';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { CustomerSearch } from '@/components/admin/customers/CustomerSearch';
import { DataTable } from '@/components/ui/DataTable';
import { ProductSearch } from '@/components/admin/products/ProductSearch';
import { formatCurrency } from '@/utils/format';
import { CreateInvoiceDto, CreateInvoiceItemDto } from '@/types/invoice';

interface CartItem extends CreateInvoiceItemDto {
  productName: string;
  totalAmount: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Fetch warehouses for selector
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehousesApi.getWarehouses(),
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalAmount = subtotal - discountAmount + taxAmount;

  // Set default warehouse if available
  useEffect(() => {
    if (warehouses?.data?.length && !warehouseId) {
      setWarehouseId(warehouses.data[0].id);
    }
  }, [warehouses, warehouseId]);

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: (invoiceData: CreateInvoiceDto) => invoicesApi.createInvoice(invoiceData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      router.push(`/admin/invoices/${data.id}`);
    },
  });

  const handleAddProduct = async (productId: string) => {
    try {
      const product = await productsApi.getProduct(productId);
      
      // Check if product is already in cart
      const existingItemIndex = cart.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        updatedCart[existingItemIndex].totalAmount = 
          updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].unitPrice;
        setCart(updatedCart);
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          totalAmount: product.price,
        };
        setCart([...cart, newItem]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updatedCart[index].totalAmount = quantity * updatedCart[index].unitPrice;
    setCart(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const handleSaveInvoice = async (status: 'pending' | 'paid' = 'pending') => {
    if (cart.length === 0) {
      alert('Please add at least one product to the invoice');
      return;
    }

    if (!warehouseId) {
      alert('Please select a warehouse');
      return;
    }

    const invoiceData: CreateInvoiceDto = {
      customerId: customerId || undefined,
      warehouseId,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      paidAmount: status === 'paid' ? totalAmount : paidAmount,
      paymentMethod,
      status,
      notes,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: item.totalAmount,
      })),
    };

    try {
      createInvoiceMutation.mutate(invoiceData);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    }
  };

  const cartColumns = [
    {
      header: 'Product',
      accessorKey: 'productName',
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: ({ row, rowIndex }: { row: any; rowIndex: number }) => (
        <FormInput
          type="number"
          min="1"
          value={row.original.quantity}
          onChange={(e) => handleUpdateQuantity(rowIndex, parseInt(e.target.value))}
          className="w-20"
        />
      ),
    },
    {
      header: 'Unit Price',
      accessorKey: 'unitPrice',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.unitPrice),
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalAmount),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ rowIndex }: { rowIndex: number }) => (
        <Button size="sm" variant="outline" color="red" onClick={() => handleRemoveItem(rowIndex)}>
          Remove
        </Button>
      ),
    },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/admin/invoices')}>
            Cancel
          </Button>
          <Button onClick={() => handleSaveInvoice('pending')}>Save as Draft</Button>
          <Button onClick={() => handleSaveInvoice('paid')}>Complete Sale</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <CustomerSearch 
                onSelect={(id: string, name: string) => {
                  setCustomerId(id);
                  setCustomerName(name);
                }}
              />
              {customerName && (
                <div className="mt-2">
                  <span className="text-sm">Selected: {customerName}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Invoice Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse
              </label>
              <FormSelect
                options={
                  warehouses?.data?.map((warehouse: any) => ({
                    value: warehouse.id,
                    label: warehouse.name,
                  })) || []
                }
                value={warehouseId}
                onChange={(value) => setWarehouseId(value)}
                placeholder="Select a warehouse"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <FormTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <FormSelect
                options={paymentMethods}
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount
              </label>
              <FormInput
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Amount
              </label>
              <FormInput
                type="number"
                min="0"
                value={taxAmount}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Amount
              </label>
              <FormInput
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Product Search</h3>
        </div>
        <ProductSearch onSelect={handleAddProduct} />
      </Card>

      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">Cart Items</h3>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items added yet. Use the product search above to add items.
          </div>
        ) : (
          <DataTable
            data={cart}
            columns={cartColumns}
            pagination={false}
          />
        )}
      </Card>

      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">Invoice Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span>{formatCurrency(discountAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span>{formatCurrency(paidAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Balance:</span>
            <span>{formatCurrency(totalAmount - paidAmount)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
