'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiEdit, FiTrash2, FiArrowLeft, FiPrinter, FiDownload, FiFileText, FiCheck, FiX, FiCreditCard } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Link } from '@/i18n/navigation';
import { formatDateTime, formatCurrency } from '@/lib/utils/format';
import { DataTable, Column } from '@/components/ui/Table/DataTable';
import { Modal } from '@/components/ui/modal/Modal';

interface PageProps {
  params: {
    id: string;
  };
}

// Define Invoice interface
interface Invoice {
  id: number;
  code: string;
  date: string;
  customerId: number;
  customer?: {
    id: number;
    name: string;
    code: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  createdBy: number;
  createdByUser?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Define InvoiceItem interface
interface InvoiceItem {
  id: number;
  invoiceId: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    code: string;
  };
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

// Define Payment interface
interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  date: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

// Define invoice service
const invoiceService = {
  getInvoiceById: async (id: number): Promise<Invoice> => {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    return response.json();
  },
  getInvoicePayments: async (id: number): Promise<Payment[]> => {
    const response = await fetch(`/api/invoices/${id}/payments`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  },
  updateInvoiceStatus: async (id: number, status: string): Promise<Invoice> => {
    const response = await fetch(`/api/invoices/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update invoice status');
    }
    return response.json();
  },
  recordPayment: async (invoiceId: number, paymentData: Partial<Payment>): Promise<Payment> => {
    const response = await fetch(`/api/invoices/${invoiceId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      throw new Error('Failed to record payment');
    }
    return response.json();
  },
  deleteInvoice: async (id: number): Promise<void> => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
  }
};

export default function InvoiceDetailPage({ params }: PageProps) {
  const t = useTranslations('admin.invoices');
  const { id } = params;
  const invoiceId = parseInt(id, 10);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<Partial<Payment>>({
    amount: 0,
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
  });

  const fetchInvoiceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoiceData, paymentsData] = await Promise.all([
        invoiceService.getInvoiceById(invoiceId),
        invoiceService.getInvoicePayments(invoiceId)
      ]);
      setInvoice(invoiceData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Error fetching invoice data:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceId]);

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await invoiceService.deleteInvoice(invoiceId);
        window.location.href = '/admin/invoices';
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError(t('errors.deleteFailed'));
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (window.confirm(t('confirmStatusChange', { status: t(`status.${newStatus}`) }))) {
      try {
        const updatedInvoice = await invoiceService.updateInvoiceStatus(invoiceId, newStatus);
        setInvoice(updatedInvoice);
      } catch (err) {
        console.error('Error updating invoice status:', err);
        setError(t('errors.updateFailed'));
      }
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newPayment = await invoiceService.recordPayment(invoiceId, paymentData);
      setPayments([...payments, newPayment]);
      setIsPaymentModalOpen(false);
      
      // Refresh invoice data to get updated payment status
      const updatedInvoice = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(updatedInvoice);
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(t('errors.paymentFailed'));
    }
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  // Define invoice item columns
  const itemColumns: Column<InvoiceItem>[] = [
    {
      key: 'product',
      header: t('items.product'),
      render: (row) => row.product ? `${row.product.name} (${row.product.code})` : '-',
      width: '40%'
    },
    {
      key: 'quantity',
      header: t('items.quantity'),
      render: (row) => row.quantity.toString(),
      align: 'center'
    },
    {
      key: 'price',
      header: t('items.price'),
      render: (row) => formatCurrency(row.price),
      align: 'right'
    },
    {
      key: 'discount',
      header: t('items.discount'),
      render: (row) => row.discount ? formatCurrency(row.discount) : '-',
      align: 'right'
    },
    {
      key: 'tax',
      header: t('items.tax'),
      render: (row) => row.tax ? formatCurrency(row.tax) : '-',
      align: 'right'
    },
    {
      key: 'total',
      header: t('items.total'),
      render: (row) => formatCurrency(row.total),
      align: 'right'
    }
  ];

  // Define payment columns
  const paymentColumns: Column<Payment>[] = [
    {
      key: 'id',
      header: t('payments.id'),
      render: (row) => `#${row.id}`,
      width: '10%'
    },
    {
      key: 'date',
      header: t('payments.date'),
      render: (row) => formatDateTime(row.date),
      width: '20%'
    },
    {
      key: 'method',
      header: t('payments.method'),
      render: (row) => t(`payments.methods.${row.method}`),
      width: '15%'
    },
    {
      key: 'amount',
      header: t('payments.amount'),
      render: (row) => formatCurrency(row.amount),
      align: 'right',
      width: '15%'
    },
    {
      key: 'reference',
      header: t('payments.reference'),
      render: (row) => row.reference || '-',
      width: '20%'
    },
    {
      key: 'notes',
      header: t('payments.notes'),
      render: (row) => row.notes || '-',
      width: '20%'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !invoice) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-600">
              {error || t('errors.notFound')}
            </div>
            <Link href="/admin/invoices" className="text-primary hover:underline mt-4 inline-block">
              <FiArrowLeft className="inline mr-2" /> {t('backToList')}
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header with actions */}
          <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <Link href="/admin/invoices" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <FiFileText size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">
                {t('invoice')} #{invoice.code}
              </h1>
              <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full 
                ${invoice.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'}`}
              >
                {t(`status.${invoice.status}`)}
              </span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full 
                ${invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                  invoice.paymentStatus === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}
              >
                {t(`paymentStatus.${invoice.paymentStatus}`)}
              </span>
            </div>
            
            <div className="flex flex-wrap space-x-2">
              <button 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => window.print()}
              >
                <FiPrinter className="mr-2" /> {t('print')}
              </button>
              
              <button 
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiDownload className="mr-2" /> {t('download')}
              </button>
              
              {invoice.status !== 'completed' && invoice.status !== 'cancelled' && (
                <button 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  onClick={() => handleStatusChange('completed')}
                >
                  <FiCheck className="mr-2" /> {t('markAsCompleted')}
                </button>
              )}
              
              {invoice.status !== 'cancelled' && (
                <button 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  <FiX className="mr-2" /> {t('markAsCancelled')}
                </button>
              )}
              
              {invoice.status !== 'cancelled' && invoice.paymentStatus !== 'paid' && (
                <button 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => {
                    // Set default amount to balance due
                    setPaymentData({
                      ...paymentData,
                      amount: invoice.balanceDue
                    });
                    setIsPaymentModalOpen(true);
                  }}
                >
                  <FiCreditCard className="mr-2" /> {t('recordPayment')}
                </button>
              )}
              
              {invoice.status === 'draft' && (
                <Link href={`/admin/invoices/${invoice.id}/edit`}>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                    <FiEdit className="mr-2" /> {t('edit')}
                  </button>
                </Link>
              )}
              
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                <FiTrash2 className="mr-2" /> {t('delete')}
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-6 ${activeTab === 'details'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('tabs.details')}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-6 ${activeTab === 'payments'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('tabs.payments')}
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* Invoice details tab */}
            {activeTab === 'details' && (
              <div>
                {/* Invoice header info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('from')}:</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold mb-1">ZBase Trading Company</p>
                      <p>123 Business Street</p>
                      <p>Ho Chi Minh City, Vietnam</p>
                      <p>+84 28 1234 5678</p>
                      <p>info@zbase-trading.com</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('to')}:</h3>
                    <div className="text-sm text-gray-600">
                      {invoice.customer ? (
                        <>
                          <p className="font-semibold mb-1">{invoice.customer.name}</p>
                          {invoice.customer.address && <p>{invoice.customer.address}</p>}
                          {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
                          {invoice.customer.email && <p>{invoice.customer.email}</p>}
                        </>
                      ) : (
                        <p>{t('customerNotSpecified')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice meta info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="text-xs uppercase text-gray-500">{t('invoiceNumber')}</h4>
                    <p className="font-medium">#{invoice.code}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500">{t('invoiceDate')}</h4>
                    <p className="font-medium">{formatDateTime(invoice.date, 'date-only')}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500">{t('createdBy')}</h4>
                    <p className="font-medium">{invoice.createdByUser?.name || 'System'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-500">{t('createdAt')}</h4>
                    <p className="font-medium">{formatDateTime(invoice.createdAt)}</p>
                  </div>
                </div>

                {/* Invoice items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t('items.title')}</h3>
                  <div className="overflow-x-auto">
                    <DataTable 
                      columns={itemColumns}
                      data={invoice.items}
                      exportable={false}
                    />
                  </div>
                </div>

                {/* Invoice totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-full md:w-1/2 lg:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">{t('subtotal')}:</span>
                        <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      
                      {invoice.discount > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">
                            {t('discount')} 
                            {invoice.discountType === 'percentage' && ` (${invoice.discount}%)`}:
                          </span>
                          <span className="font-medium">
                            {invoice.discountType === 'fixed' 
                              ? formatCurrency(invoice.discount) 
                              : formatCurrency((invoice.subtotal * invoice.discount) / 100)
                            }
                          </span>
                        </div>
                      )}
                      
                      {invoice.tax > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">
                            {t('tax')} ({invoice.taxRate}%):
                          </span>
                          <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-3 font-bold text-lg">
                        <span>{t('total')}:</span>
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 bg-blue-50 rounded px-2 mt-2">
                        <span className="text-blue-800">{t('paidAmount')}:</span>
                        <span className="font-medium text-blue-800">{formatCurrency(invoice.paidAmount)}</span>
                      </div>
                      
                      {invoice.balanceDue > 0 && (
                        <div className="flex justify-between py-2 bg-red-50 rounded px-2 mt-2">
                          <span className="text-red-800">{t('balanceDue')}:</span>
                          <span className="font-bold text-red-800">{formatCurrency(invoice.balanceDue)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('notes')}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payments tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('tabs.payments')}</h3>
                  
                  {invoice.status !== 'cancelled' && invoice.paymentStatus !== 'paid' && (
                    <button 
                      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => {
                        // Set default amount to balance due
                        setPaymentData({
                          ...paymentData,
                          amount: invoice.balanceDue
                        });
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      <FiPlus className="mr-2" /> {t('recordPayment')}
                    </button>
                  )}
                </div>
                
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-700">{t('summary.invoiceTotal')}</h3>
                    <p className="text-2xl font-bold text-blue-800">{formatCurrency(invoice.total)}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-700">{t('summary.paid')}</h3>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(invoice.paidAmount)}</p>
                  </div>
                  <div className={`${invoice.balanceDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} border rounded-lg p-4`}>
                    <h3 className={`text-sm font-medium ${invoice.balanceDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {t('summary.balance')}
                    </h3>
                    <p className={`text-2xl font-bold ${invoice.balanceDue > 0 ? 'text-red-800' : 'text-green-800'}`}>
                      {formatCurrency(invoice.balanceDue)}
                    </p>
                  </div>
                </div>
                
                {/* Payments list */}
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <DataTable 
                      columns={paymentColumns}
                      data={payments}
                      exportable={false}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">{t('payments.noPayments')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        title={t('recordPayment')}
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                {t('payments.amount')} *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0"
                step="0.01"
                max={invoice.balanceDue}
                required
                value={paymentData.amount}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('payments.maxAmount')}: {formatCurrency(invoice.balanceDue)}
              </p>
            </div>

            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                {t('payments.method')} *
              </label>
              <select
                id="method"
                name="method"
                required
                value={paymentData.method}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="cash">{t('payments.methods.cash')}</option>
                <option value="bank_transfer">{t('payments.methods.bank_transfer')}</option>
                <option value="credit_card">{t('payments.methods.credit_card')}</option>
                <option value="other">{t('payments.methods.other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                {t('payments.date')} *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={paymentData.date}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                {t('payments.reference')}
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={paymentData.reference}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder={t('payments.referencePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                {t('payments.notes')}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={paymentData.notes}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder={t('payments.notesPlaceholder')}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
