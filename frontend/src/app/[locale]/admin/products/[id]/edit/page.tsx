'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiPlus, FiX } from 'react-icons/fi';
import AdminLayout from '@/components/layouts/AdminLayout';
import { 
  productService, 
  Product,
  UpdateProductDto, 
  ProductCategory, 
  ProductAttribute,
  AttributeSummary 
} from '@/lib/api/services/product';
import { Link } from '@/i18n/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

interface AttributeInput {
  attributeName: string;
  attributeValue: string;
  id: string | number; // Can be existing id or local id for new attributes
  isNew?: boolean;
}

export default function EditProductPage({ params }: PageProps) {
  const t = useTranslations('admin.products');
  const router = useRouter();

  const { id } = params;
  const productId = parseInt(id, 10);

  const [productData, setProductData] = useState<Omit<UpdateProductDto, 'attributes'>>({
    code: '',
    name: '',
    description: '',
    basePrice: 0,
    categoryId: undefined,
    taxRate: 0,
  });
  
  const [attributes, setAttributes] = useState<AttributeInput[]>([]);
  const [commonAttributes, setCommonAttributes] = useState<AttributeSummary[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch product data
        const productDetails = await productService.getProductById(productId);
        setProductData({
          code: productDetails.code,
          name: productDetails.name,
          description: productDetails.description,
          basePrice: productDetails.basePrice,
          costPrice: productDetails.costPrice,
          categoryId: productDetails.categoryId,
          taxRate: productDetails.taxRate,
          barcode: productDetails.barcode,
          unit: productDetails.unit,
          manufacturer: productDetails.manufacturer,
          warrantyMonths: productDetails.warrantyMonths
        });

        // Fetch product attributes
        const attributesData = await productService.getProductAttributes(productId);
        setAttributes(attributesData.map(attr => ({
          ...attr,
          id: attr.id
        })));

        // Fetch categories
        const categoriesData = await productService.getAllCategories();
        setCategories(categoriesData);
        
        // Fetch common attributes
        const attributeSummary = await productService.getAttributeSummary();
        setCommonAttributes(attributeSummary);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setProductData({
        ...productData,
        [name]: value === '' ? undefined : Number(value),
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const addAttribute = () => {
    const newAttribute: AttributeInput = {
      attributeName: '',
      attributeValue: '',
      id: `new-${Date.now()}`, // Use timestamp as local ID
      isNew: true
    };
    setAttributes([...attributes, newAttribute]);
  };

  const updateAttribute = (index: number, field: keyof AttributeInput, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value
    };
    setAttributes(updatedAttributes);
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Filter out empty attributes and format them for the API
      const validAttributes = attributes
        .filter(attr => attr.attributeName.trim() !== '' && attr.attributeValue.trim() !== '')
        .map(({ attributeName, attributeValue }) => ({ attributeName, attributeValue }));
      
      const updatedProduct: UpdateProductDto = {
        ...productData,
        attributes: validAttributes
      };
      
      // Update product
      await productService.updateProduct(productId, updatedProduct);
      setSuccess(t('updateSuccess'));
      
      // Redirect to product detail page after a short delay
      setTimeout(() => {
        router.push(`/admin/products/${productId}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || t('errors.updateFailed'));
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

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/admin/products/${productId}`}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FiArrowLeft className="mr-1" /> {t('backToProductDetails')}
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{t('editProduct')}</h1>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{t('basicInfo')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('basicInfoDescription')}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Product Code */}
                  <div className="sm:col-span-3">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      {t('code')} *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="code"
                        name="code"
                        required
                        value={productData.code}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('name')} *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={productData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('description')}
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={productData.description || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-6">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      {t('category')}
                    </label>
                    <div className="mt-1">
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={productData.categoryId || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">{t('selectCategory')}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{t('pricing')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('pricingDescription')}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Base Price */}
                  <div className="sm:col-span-3">
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                      {t('basePrice')} *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₫</span>
                      </div>
                      <input
                        type="number"
                        id="basePrice"
                        name="basePrice"
                        min="0"
                        step="1000"
                        required
                        value={productData.basePrice || ''}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Cost Price */}
                  <div className="sm:col-span-3">
                    <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                      {t('costPrice')}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₫</span>
                      </div>
                      <input
                        type="number"
                        id="costPrice"
                        name="costPrice"
                        min="0"
                        step="1000"
                        value={productData.costPrice || ''}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Tax Rate */}
                  <div className="sm:col-span-3">
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                      {t('taxRate')}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="taxRate"
                        name="taxRate"
                        min="0"
                        max="100"
                        step="0.1"
                        value={productData.taxRate || ''}
                        onChange={handleChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{t('additionalDetails')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('additionalDetailsDescription')}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Barcode */}
                  <div className="sm:col-span-3">
                    <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                      {t('barcode')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="barcode"
                        name="barcode"
                        value={productData.barcode || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Unit */}
                  <div className="sm:col-span-3">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                      {t('unit')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="unit"
                        name="unit"
                        value={productData.unit || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Manufacturer */}
                  <div className="sm:col-span-3">
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                      {t('manufacturer')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={productData.manufacturer || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Warranty Months */}
                  <div className="sm:col-span-3">
                    <label htmlFor="warrantyMonths" className="block text-sm font-medium text-gray-700">
                      {t('warrantyMonths')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="warrantyMonths"
                        name="warrantyMonths"
                        min="0"
                        value={productData.warrantyMonths || ''}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{t('attributes')}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t('attributesDescription')}</p>
                </div>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="-ml-0.5 mr-1" /> {t('addAttribute')}
                </button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                {attributes.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <p>{t('noAttributesAdded')}</p>
                    <button
                      type="button"
                      onClick={addAttribute}
                      className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      {t('addAttribute')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attributes.map((attr, index) => (
                      <div key={attr.id} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label htmlFor={`attrName-${index}`} className="block text-sm font-medium text-gray-700">
                            {t('attributeName')}
                          </label>
                          <input
                            type="text"
                            id={`attrName-${index}`}
                            value={attr.attributeName}
                            onChange={(e) => updateAttribute(index, 'attributeName', e.target.value)}
                            list={`commonAttributes-${index}`}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <datalist id={`commonAttributes-${index}`}>
                            {commonAttributes.map((common, i) => (
                              <option key={i} value={common.name} />
                            ))}
                          </datalist>
                        </div>
                        <div className="flex-1">
                          <label htmlFor={`attrValue-${index}`} className="block text-sm font-medium text-gray-700">
                            {t('attributeValue')}
                          </label>
                          <input
                            type="text"
                            id={`attrValue-${index}`}
                            value={attr.attributeValue}
                            onChange={(e) => updateAttribute(index, 'attributeValue', e.target.value)}
                            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className="mt-5 flex items-center justify-center h-10 w-10 rounded-md bg-white border border-gray-200 text-red-500 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <span className="sr-only">{t('removeAttribute')}</span>
                            <FiX className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <Link
                href={`/admin/products/${productId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('cancel')}
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 -ml-1 h-4 w-4" />
                    {t('save')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
