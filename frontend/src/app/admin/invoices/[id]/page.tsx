"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from '@/services/api/invoices';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { formatCurrency, formatDate } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/Dialog';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Fetch invoice details
  const { data: invoice, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoice', params.id],
    queryFn: () => invoicesApi.getInvoice(params.id),
  });

  // Fetch invoice templates
  const { data: templates } = useQuery({
    queryKey: ['invoiceTemplates'],
    queryFn: () => invoicesApi.getInvoiceTemplates(),
  });

  const handlePrintInvoice = async (templateId?: string) => {
    try {
      const pdfUrl = await invoicesApi.printInvoice(params.id, templateId);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to print invoice');
    }
  };

  const handleEmailInvoice = async () => {
    try {
      await invoicesApi.emailInvoice(params.id, emailAddress, selectedTemplate);
      setIsEmailModalOpen(false);
      alert('Invoice sent successfully');
    } catch (error) {
      console.error('Error emailing invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const handleCancelInvoice = async () => {
    if (!invoice) return;
    
    if (window.confirm('Are you sure you want to cancel this invoice? This action cannot be undone.')) {
      try {
        await invoicesApi.cancelInvoice(params.id);
        refetch();
        alert('Invoice canceled successfully');
      } catch (error) {
        console.error('Error canceling invoice:', error);
        alert('Failed to cancel invoice');
      }
    }
  };

  const handleProcessPayment = async () => {
    try {
      await invoicesApi.markAsPaid(params.id, {
        amount: paymentAmount,
        paymentMethod: paymentMethod,
      });
      setIsPaymentModalOpen(false);
      refetch();
      alert('Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending: { color: 'yellow', label: 'Pending' },
      paid: { color: 'green', label: 'Paid' },
      canceled: { color: 'red', label: 'Canceled' },
      overdue: { color: 'orange', label: 'Overdue' },
    };

    const statusInfo = statusMap[status] || { color: 'gray', label: status };
    return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const itemsColumns = [
    {
      header: 'Product',
      accessorKey: 'productName',
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
    },
    {
      header: 'Unit Price',
      accessorKey: 'unitPrice',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.unitPrice),
    },
    {
      header: 'Discount',
      accessorKey: 'discountAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.discountAmount),
    },
    {
      header: 'Tax',
      accessorKey: 'taxAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.taxAmount),
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      cell: ({ row }: { row: any }) => formatCurrency(row.original.totalAmount),
    },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">Error loading invoice</h2>
        <p className="mb-4">There was a problem loading the invoice details.</p>
        <Button onClick={() => router.push('/admin/invoices')}>Back to Invoices</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice #{invoice.code}</h1>
        <div className="flex space-x-2">
          {invoice.status !== 'canceled' && invoice.status !== 'paid' && (
            <Button onClick={() => setIsPaymentModalOpen(true)}>Record Payment</Button>
          )}
          <Button variant="outline" onClick={() => handlePrintInvoice()}>Print</Button>
          <Button variant="outline" onClick={() => setIsEmailModalOpen(true)}>Email</Button>
          {invoice.status !== 'canceled' && (
            <Button variant="outline" color="red" onClick={handleCancelInvoice}>
              Cancel Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Invoice Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span>{getStatusBadge(invoice.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span>{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice #:</span>
              <span>{invoice.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Warehouse:</span>
              <span>{invoice.warehouseName}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span>{invoice.customerName || 'Walk-in Customer'}</span>
            </div>
            {/* Additional customer info would go here */}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span>{formatCurrency(invoice.discountAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span>{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Balance:</span>
              <span>{formatCurrency(invoice.totalAmount - invoice.paidAmount)}</span>
            </div>
            {invoice.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>{invoice.paymentMethod}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">Items</h3>
        <DataTable
          data={invoice.items || []}
          columns={itemsColumns}
          pagination={false}
        />
      </Card>

      {invoice.notes && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Notes</h3>
          <p className="text-gray-700">{invoice.notes}</p>
        </Card>
      )}

      {/* Payment Modal */}
      <Dialog
        title="Record Payment"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount
            </label>
            <FormInput
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
              placeholder="0.00"
            />
          </div>
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
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>Process Payment</Button>
          </div>
        </div>
      </Dialog>

      {/* Email Modal */}
      <Dialog
        title="Email Invoice"
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <FormInput
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Template
            </label>
            <FormSelect
              options={templates?.map((template: any) => ({
                value: template.id,
                label: template.name,
              })) || []}
              value={selectedTemplate}
              onChange={(value) => setSelectedTemplate(value)}
              placeholder="Select a template"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailInvoice}>Send Email</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
