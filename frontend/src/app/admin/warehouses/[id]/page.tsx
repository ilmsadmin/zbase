'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiUser, FiMapPin, FiList } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { warehouseService, Warehouse, WarehouseLocation } from '@/lib/api/services/warehouse';
import { Link } from '@/i18n/navigation';
import { formatDateTime } from '@/lib/utils/format';

interface PageProps {
  params: {
    id: string;
  };
}

export default function WarehouseDetailPage({ params }: PageProps) {
  const t = useTranslations('admin.warehouses');
  const { id } = params;
  const warehouseId = parseInt(id, 10);
  
  // Validate that warehouseId is a valid number
  if (isNaN(warehouseId)) {
    console.error('Invalid warehouse ID:', id);
  }

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchWarehouseData = async () => {
    setLoading(true);
    setError(null);
    
    // Check if warehouseId is valid before making API calls
    if (isNaN(warehouseId)) {
      console.error('Invalid warehouse ID:', id);
      setError(t('errors.invalidId'));
      setLoading(false);
      return;
    }
    
    try {
      const [warehouseData, locationsData] = await Promise.all([
        warehouseService.getWarehouseById(warehouseId),
        warehouseService.getAllLocations(warehouseId)
      ]);
      setWarehouse(warehouseData);
      setLocations(locationsData);
    } catch (err) {
      console.error('Error fetching warehouse data:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseData();
  }, [warehouseId]);

  const handleDeleteLocation = async (locationId: number) => {
    if (window.confirm(t('confirmDeleteLocation'))) {
      try {
        await warehouseService.deleteLocation(locationId);
        fetchWarehouseData(); // Refresh data
      } catch (err) {
        console.error('Error deleting location:', err);
        setError(t('errors.deleteLocationFailed'));
      }
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

  if (error || !warehouse) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error || t('errors.warehouseNotFound')}
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/admin/warehouses"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <FiArrowLeft className="mr-2" /> {t('backToList')}
                    </Link>
                  </div>
                </div>
              </div>
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
          {/* Breadcrumb and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
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
                      <span className="ml-4 text-sm font-medium text-gray-500">{warehouse.name}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{warehouse.name}</h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <Link 
                href={`/admin/warehouses/${warehouseId}/edit`} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiEdit className="mr-2 -ml-1 h-5 w-5 text-gray-500" /> {t('edit')}
              </Link>
              <Link 
                href={`/admin/warehouses/${warehouseId}/locations/new`} 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" /> {t('addLocation')}
              </Link>
            </div>
          </div>
          
          {/* Warehouse Details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('warehouseDetails')}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('warehouseDetailsDesc')}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('table.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{warehouse.name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('table.address')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{warehouse.address || '-'}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('table.manager')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {warehouse.manager ? (
                      <div className="flex items-center">
                        <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{warehouse.manager.name}</span>
                        <span className="ml-2 text-gray-500">({warehouse.manager.email})</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('table.created')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDateTime(warehouse.createdAt)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('table.updated')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDateTime(warehouse.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Warehouse Locations */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {t('locations')} ({locations.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('locationsDesc')}</p>
              </div>
              <Link 
                href={`/admin/warehouses/${warehouseId}/locations/new`} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" /> {t('addLocation')}
              </Link>
            </div>
            {locations.length === 0 ? (
              <div className="text-center py-8 border-t border-gray-200">
                <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noLocations')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('addFirstLocation')}</p>
                <div className="mt-6">
                  <Link
                    href={`/admin/warehouses/${warehouseId}/locations/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {t('addLocation')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('table.locationCode')}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('table.description')}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('table.status')}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('table.capacity')}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t('table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {`${location.zone}-${location.aisle}-${location.rack}-${location.shelf}-${location.position}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {location.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            location.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : location.status === 'maintenance' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {location.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {location.maxCapacity ?? '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/admin/warehouse-locations/${location.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FiList className="h-5 w-5" title={t('viewItems')} />
                            </Link>
                            <Link
                              href={`/admin/warehouse-locations/${location.id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <FiEdit className="h-5 w-5" title={t('edit')} />
                            </Link>
                            <button
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="h-5 w-5" title={t('delete')} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
