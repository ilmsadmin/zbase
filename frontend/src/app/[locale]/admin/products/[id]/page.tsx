'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiEdit, FiTrash2, FiArrowLeft, FiTag, FiPackage, FiDollarSign, FiGrid, FiInfo } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { productService, Product, ProductAttribute } from '@/lib/api/services/product';
import { Link } from '@/i18n/navigation';
import { formatDateTime, formatCurrency } from '@/lib/utils/format';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const t = useTranslations('admin.products');
  const { id } = params;
  const productId = parseInt(id, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productData, attributesData] = await Promise.all([
        productService.getProductById(productId),
        productService.getProductAttributes(productId)
      ]);
      setProduct(productData);
      setAttributes(attributesData);
    } catch (err) {
      console.error('Error fetching product data:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const handleDeleteProduct = async () => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await productService.deleteProduct(productId);
        // Redirect after successful deletion
        window.location.href = '/admin/products';
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(t('errors.deleteFailed'));
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="mt-4 text-gray-600">{t('loading')}</span>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col items-center">
                  <div className="bg-red-100 p-4 rounded-full">
                    <FiInfo className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{t('errors.productNotFound')}</h3>
                  <p className="mt-2 text-sm text-gray-500">{error}</p>
                  <div className="mt-6">
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiArrowLeft className="mr-2" /> {t('backToProductsList')}
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
          {/* Header */}
          <div className="mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-2"
                >
                  <FiArrowLeft className="mr-1" /> {t('backToProductsList')}
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {product.name}
                </h1>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiTag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {t('code')}: {product.code}
                  </div>
                  {product.category && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FiGrid className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {t('category')}: {product.category.name}
                    </div>
                  )}
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {t('basePrice')}: {formatCurrency(product.basePrice)}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex lg:mt-0 lg:ml-4">
                <span className="hidden sm:block ml-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiEdit className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                    {t('edit')}
                  </Link>
                </span>
                <span className="sm:ml-3">
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {t('delete')}
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('details')}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('productDetails')}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('code')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.code}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('description')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.description || '—'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('basePrice')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(product.basePrice)}</dd>
                </div>
                {product.costPrice && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">{t('costPrice')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(product.costPrice)}</dd>
                  </div>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('taxRate')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.taxRate || 0}%</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('barcode')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.barcode || '—'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('unit')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.unit || '—'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('manufacturer')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.manufacturer || '—'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('warrantyMonths')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.warrantyMonths ? `${product.warrantyMonths} ${t('months')}` : '—'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('category')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.category ? product.category.name : t('uncategorized')}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('createdAt')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDateTime(product.createdAt)}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('updatedAt')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDateTime(product.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Product Attributes */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('attributes')}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('productAttributes')}</p>
              </div>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiEdit className="mr-1.5 h-4 w-4" />
                {t('editAttributes')}
              </Link>
            </div>
            <div className="border-t border-gray-200">
              {attributes.length === 0 ? (
                <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                  {t('noAttributes')}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {attributes.map((attribute) => (
                    <li key={attribute.id} className="px-4 py-4 sm:px-6 flex justify-between">
                      <div className="text-sm font-medium text-gray-900">{attribute.attributeName}</div>
                      <div className="text-sm text-gray-500">{attribute.attributeValue}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
