'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { warehouseService, Warehouse, UpdateWarehouseDto } from '@/lib/api/services/warehouse';
import { Link } from '@/i18n/navigation';
import { apiClient } from '@/lib/api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditWarehousePage({ params }: PageProps) {
  const t = useTranslations('admin.warehouses');
  const router = useRouter();

  const { id } = params;
  const warehouseId = parseInt(id, 10);

  const [warehouseData, setWarehouseData] = useState<UpdateWarehouseDto>({
    name: '',
    address: '',
    managerId: undefined
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch warehouse data
        const warehouseDetails = await warehouseService.getWarehouseById(warehouseId);
        setWarehouseData({
          name: warehouseDetails.name,
          address: warehouseDetails.address || '',
          managerId: warehouseDetails.managerId
        });

        // Fetch users for manager selection
        setLoadingUsers(true);
        const usersData = await apiClient.get('/users');
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, [warehouseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'managerId') {
      setWarehouseData({
        ...warehouseData,
        managerId: value ? parseInt(value, 10) : undefined
      });
    } else {
      setWarehouseData({
        ...warehouseData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await warehouseService.updateWarehouse(warehouseId, warehouseData);
      setSuccess(t('updateSuccess'));
      
      // Redirect to the warehouse detail page after a short delay
      setTimeout(() => {
        router.push(`/admin/warehouses/${warehouseId}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating warehouse:', err);
      setError(t('errors.updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb and Title */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/admin/warehouses" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                      {t('breadcrumb.warehouses')}
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <Link 
                        href={`/admin/warehouses/${warehouseId}`} 
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {warehouseData.name}
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-500">{t('editWarehouse')}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {t('editWarehouse')}: {warehouseData.name}
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href={`/admin/warehouses/${warehouseId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiArrowLeft className="mr-2 -ml-1 h-5 w-5 text-gray-500" /> {t('cancel')}
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('form.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={warehouseData.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                    {t('form.manager')}
                  </label>
                  <select
                    id="managerId"
                    name="managerId"
                    value={warehouseData.managerId || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={loadingUsers}
                  >
                    <option value="">{t('form.selectManager')}</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    {t('form.address')}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={warehouseData.address || ''}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder={t('form.addressPlaceholder')}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/admin/warehouses/${warehouseId}`}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('saving')}
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 -ml-1 h-5 w-5" />
                      {t('save')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
