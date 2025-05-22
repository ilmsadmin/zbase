'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiEdit, FiTrash2, FiArrowLeft, FiBriefcase, FiMail, FiPhone, FiMapPin, FiGlobe, FiUser, FiFileText } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Link } from '@/i18n/navigation';
import { formatDateTime } from '@/lib/utils/format';
import { DataTable, Column } from '@/components/ui/Table/DataTable';

interface PageProps {
  params: {
    id: string;
  };
}

// Define the Partner interface
interface Partner {
  id: number;
  code: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
  website?: string;
  category: 'supplier' | 'manufacturer' | 'distributor' | 'other';
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Include related data
  products?: Product[];
  transactions?: Transaction[];
}

// Define Product interface for partner products
interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  status: string;
}

// Define Transaction interface for partner transactions
interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: 'payment' | 'purchase';
  notes?: string;
}

// Define partner service
const partnerService = {
  getPartnerById: async (id: number): Promise<Partner> => {
    const response = await fetch(`/api/partners/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch partner');
    }
    return response.json();
  },
  deletePartner: async (id: number): Promise<void> => {
    const response = await fetch(`/api/partners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete partner');
    }
  }
};

export default function PartnerDetailPage({ params }: PageProps) {
  const t = useTranslations('admin.partners');
  const { id } = params;
  const partnerId = parseInt(id, 10);

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  const fetchPartnerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const partnerData = await partnerService.getPartnerById(partnerId);
      setPartner(partnerData);
    } catch (err) {
      console.error('Error fetching partner data:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [partnerId]);

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await partnerService.deletePartner(partnerId);
        window.location.href = '/admin/partners';
      } catch (err) {
        console.error('Error deleting partner:', err);
        setError(t('errors.deleteFailed'));
      }
    }
  };

  // Define product columns for the products tab
  const productColumns: Column<Product>[] = [
    {
      key: 'code',
      header: t('products.code'),
      sortable: true
    },
    {
      key: 'name',
      header: t('products.name'),
      sortable: true
    },
    {
      key: 'price',
      header: t('products.price'),
      render: (row) => `${row.price.toLocaleString()} ₫`,
      sortable: true,
      align: 'right'
    },
    {
      key: 'status',
      header: t('products.status'),
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full 
          ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      align: 'center'
    },
    {
      key: 'actions',
      header: t('columns.actions'),
      render: (row) => (
        <div className="flex space-x-2">
          <Link href={`/admin/products/${row.id}`}>
            <button className="p-1 text-blue-600 hover:text-blue-800">
              <FiEdit size={18} />
            </button>
          </Link>
        </div>
      ),
      align: 'center',
      width: '100px'
    }
  ];

  // Define transaction columns for the transactions tab
  const transactionColumns: Column<Transaction>[] = [
    {
      key: 'id',
      header: t('transactions.id'),
      sortable: true
    },
    {
      key: 'date',
      header: t('transactions.date'),
      render: (row) => formatDateTime(row.date),
      sortable: true
    },
    {
      key: 'amount',
      header: t('transactions.amount'),
      render: (row) => `${row.amount.toLocaleString()} ₫`,
      sortable: true,
      align: 'right'
    },
    {
      key: 'type',
      header: t('transactions.type'),
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full 
          ${row.type === 'payment' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
        >
          {t(`transactions.types.${row.type}`)}
        </span>
      ),
      sortable: true
    },
    {
      key: 'notes',
      header: t('transactions.notes'),
      render: (row) => row.notes || '-'
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

  if (error || !partner) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-600">
              {error || t('errors.notFound')}
            </div>
            <Link href="/admin/partners" className="text-primary hover:underline mt-4 inline-block">
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
              <Link href="/admin/partners" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <FiBriefcase size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{partner.name}</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {partner.code}
              </span>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                {t(`categories.${partner.category}`)}
              </span>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/partners/${partner.id}/edit`}>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                  <FiEdit className="mr-2" /> {t('edit')}
                </button>
              </Link>
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
                onClick={() => setActiveTab('info')}
                className={`py-4 px-6 ${activeTab === 'info'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('tabs.info')}
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 ${activeTab === 'products'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('tabs.products')}
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-6 ${activeTab === 'transactions'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {t('tabs.transactions')}
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* Partner info tab */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">{t('basicInfo')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiBriefcase className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.name')}</div>
                        <div className="font-medium">{partner.name}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiUser className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.contactName')}</div>
                        <div className="font-medium">{partner.contactName || t('notSpecified')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiPhone className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.phone')}</div>
                        <div className="font-medium">{partner.phone || t('notSpecified')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiMail className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.email')}</div>
                        <div className="font-medium">{partner.email || t('notSpecified')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiMapPin className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.address')}</div>
                        <div className="font-medium">{partner.address || t('notSpecified')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">{t('additionalInfo')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiGlobe className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.website')}</div>
                        <div className="font-medium">
                          {partner.website ? (
                            <a 
                              href={partner.website.startsWith('http') ? partner.website : `http://${partner.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {partner.website}
                            </a>
                          ) : (
                            t('notSpecified')
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiFileText className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.taxId')}</div>
                        <div className="font-medium">{partner.taxId || t('notSpecified')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.notes')}</div>
                        <div className="font-medium">{partner.notes || t('noNotes')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.createdAt')}</div>
                        <div className="font-medium">{formatDateTime(partner.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{t('fields.updatedAt')}</div>
                        <div className="font-medium">{formatDateTime(partner.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('tabs.products')}</h2>
                  <Link href={`/admin/products/new?partnerId=${partner.id}`}>
                    <button className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                      <FiPlus className="inline mr-2" /> {t('products.addProduct')}
                    </button>
                  </Link>
                </div>
                
                {partner.products && partner.products.length > 0 ? (
                  <DataTable
                    columns={productColumns}
                    data={partner.products}
                    exportable
                    exportFilename={`partner-${partner.id}-products`}
                  />
                ) : (
                  <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">{t('products.noProducts')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions tab */}
            {activeTab === 'transactions' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('tabs.transactions')}</h2>
                  <Link href={`/admin/transactions/new?partnerId=${partner.id}`}>
                    <button className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                      <FiPlus className="inline mr-2" /> {t('transactions.create')}
                    </button>
                  </Link>
                </div>
                
                {partner.transactions && partner.transactions.length > 0 ? (
                  <DataTable
                    columns={transactionColumns}
                    data={partner.transactions}
                    exportable
                    exportFilename={`partner-${partner.id}-transactions`}
                  />
                ) : (
                  <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">{t('transactions.noTransactions')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
