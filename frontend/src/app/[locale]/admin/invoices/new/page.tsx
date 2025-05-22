"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiSave, FiX, FiArrowLeft, FiPlus, FiTrash2, FiSearch } from "react-icons/fi";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils/format";

// Define Customer interface
interface Customer {
  id: number;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Define Product interface
interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  taxRate?: number;
  availableQuantity?: number;
}

// Define Invoice interface
interface Invoice {
  id?: number;
  code: string;
  date: string;
  customerId?: number;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

// Define InvoiceItem interface
interface InvoiceItem {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

// Define invoice service
const invoiceService = {
  createInvoice: async (data: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    
    return response.json();
  },
  generateInvoiceCode: async (): Promise<string> => {
    const response = await fetch('/api/invoices/generate-code');
    
    if (!response.ok) {
      throw new Error('Failed to generate invoice code');
    }
    
    const data = await response.json();
    return data.code;
  }
};

// Define customer service
const customerService = {
  searchCustomers: async (term: string): Promise<Customer[]> => {
    const response = await fetch(`/api/customers/search?term=${encodeURIComponent(term)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search customers');
    }
    
    return response.json();
  },
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await fetch(`/api/customers/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    
    return response.json();
  }
};

// Define product service
const productService = {
  searchProducts: async (term: string): Promise<Product[]> => {
    const response = await fetch(`/api/products/search?term=${encodeURIComponent(term)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    return response.json();
  },
  getProductById: async (id: number): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return response.json();
  }
};

export default function InvoiceNewPage() {
  const t = useTranslations('admin.invoices');
  const router = useRouter();

  // Search state
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchResults, setProductSearchResults] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);

  // Form state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({
    code: '',
    date: new Date().toISOString().substring(0, 10),
    customerId: undefined,
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 10, // Default tax rate
    discount: 0,
    discountType: 'percentage',
    total: 0,
    status: 'draft',
    notes: '',
  });

  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Initialize with generated invoice code
  useEffect(() => {
    async function initialize() {
      try {
        const generatedCode = await invoiceService.generateInvoiceCode();
        setFormData(prev => ({ ...prev, code: generatedCode }));
      } catch (error) {
        console.error('Failed to generate invoice code:', error);
        setError(t('errors.codeGenerationFailed'));
      } finally {
        setLoading(false);
      }
    }
    
    initialize();
  }, []);

  // Customer search
  useEffect(() => {
    let active = true;
    
    if (customerSearchTerm) {
      setCustomerSearchLoading(true);
      customerService.searchCustomers(customerSearchTerm)
        .then(results => {
          if (active) {
            setCustomerSearchResults(results);
            setCustomerSearchLoading(false);
          }
        })
        .catch(error => {
          console.error('Error searching customers:', error);
          if (active) {
            setCustomerSearchLoading(false);
          }
        });
    } else {
      setCustomerSearchResults([]);
    }
    
    return () => { active = false; };
  }, [customerSearchTerm]);

  // Product search
  useEffect(() => {
    let active = true;
    
    if (productSearchTerm) {
      setProductSearchLoading(true);
      productService.searchProducts(productSearchTerm)
        .then(results => {
          if (active) {
            setProductSearchResults(results);
            setProductSearchLoading(false);
          }
        })
        .catch(error => {
          console.error('Error searching products:', error);
          if (active) {
            setProductSearchLoading(false);
          }
        });
    } else {
      setProductSearchResults([]);
    }
    
    return () => { active = false; };
  }, [productSearchTerm]);

  // Calculate totals whenever invoice items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    let discountAmount = 0;
    
    if (formData.discountType === 'percentage') {
      discountAmount = subtotal * (formData.discount / 100);
    } else {
      discountAmount = formData.discount;
    }
    
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (formData.taxRate / 100);
    const total = afterDiscount + tax;
    
    setFormData(prev => ({ 
      ...prev, 
      subtotal, 
      tax, 
      total
    }));
  }, [formData.items, formData.discount, formData.discountType, formData.taxRate]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  // Handle customer selection
  const handleCustomerSelect = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({ ...prev, customerId: customer.id }));
    setShowCustomerSearch(false);
    setCustomerSearchTerm('');
  };

  // Handle product selection
  const handleProductSelect = async (product: Product) => {
    // Create a new invoice item
    const newItem: InvoiceItem = {
      productId: product.id,
      product,
      quantity: 1,
      price: product.price,
      discount: 0,
      tax: (product.price * (product.taxRate || formData.taxRate)) / 100,
      total: product.price + ((product.price * (product.taxRate || formData.taxRate)) / 100)
    };
    
    // Add to invoice items
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    // Clear search
    setShowProductSearch(false);
    setProductSearchTerm('');
  };

  // Handle item quantity change
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: number) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    
    if (field === 'quantity' || field === 'price' || field === 'discount') {
      item[field] = value;
      
      // Recalculate item total
      const subtotal = item.quantity * item.price - item.discount;
      const taxRate = item.product?.taxRate || formData.taxRate;
      item.tax = (subtotal * taxRate) / 100;
      item.total = subtotal + item.tax;
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Remove item from invoice
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Prepare invoice data
      const invoiceData = {
        ...formData,
        status
      };
      
      // Create invoice
      const newInvoice = await invoiceService.createInvoice(invoiceData);
      
      // Redirect to invoice detail page
      router.push(`/admin/invoices/${newInvoice.id}`);
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(t('errors.createFailed'));
      setSaving(false);
    }
  };

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

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin/invoices" className="mr-4 text-gray-500 hover:text-gray-700">
                <FiArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">{t('new')}</h1>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={saving}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              >
                <FiSave className="mr-2" /> {t('saveAsDraft')}
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'pending')}
                disabled={saving || formData.items.length === 0}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center disabled:opacity-50"
              >
                <FiSave className="mr-2" /> {saving ? t('saving') : t('saveAndFinalize')}
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Invoice details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t('invoiceDetails')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                      {t('fields.code')} *
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                      {t('fields.date')} *
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              
              {/* Customer section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t('customer')}</h2>
                
                {selectedCustomer ? (
                  <div className="mb-4 p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{selectedCustomer.name}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(null);
                          setFormData(prev => ({ ...prev, customerId: undefined }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {selectedCustomer.phone && <p>{selectedCustomer.phone}</p>}
                      {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                      {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex mb-1">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiSearch className="text-gray-400" />
                        </div>
                        
                        <input
                          type="text"
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          onFocus={() => setShowCustomerSearch(true)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder={t('searchCustomerPlaceholder')}
                        />
                      </div>
                    </div>
                    
                    {showCustomerSearch && (customerSearchResults.length > 0 || customerSearchLoading) && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                        {customerSearchLoading && (
                          <div className="p-3 text-gray-500">{t('searching')}</div>
                        )}
                        
                        {!customerSearchLoading && customerSearchResults.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Products/Items section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('items.title')}</h2>
                <div className="relative">
                  <div className="flex">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      
                      <input
                        type="text"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        onFocus={() => setShowProductSearch(true)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder={t('searchProductPlaceholder')}
                      />
                    </div>
                  </div>
                  
                  {showProductSearch && (productSearchResults.length > 0 || productSearchLoading) && (
                    <div className="absolute mt-1 right-0 w-96 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                      {productSearchLoading && (
                        <div className="p-3 text-gray-500">{t('searching')}</div>
                      )}
                      
                      {!productSearchLoading && productSearchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{product.code}</span>
                            <span className="font-medium">{formatCurrency(product.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Items table */}
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('items.product')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        {t('items.quantity')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        {t('items.price')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        {t('items.discount')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        {t('items.total')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          {t('items.noItems')}
                        </td>
                      </tr>
                    ) : (
                      formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {item.product?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product?.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                              className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                            {formatCurrency(item.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals and additional details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Notes */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    {t('fields.notes')}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder={t('notesPlaceholder')}
                  />
                </div>
              </div>
              
              {/* Totals */}
              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">{t('subtotal')}</span>
                    <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <div className="flex space-x-2 items-center">
                      <span className="text-gray-600">{t('discount')}</span>
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
                        className="text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">{t('currency')}</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="discount"
                        min="0"
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="w-20 px-2 py-1 text-right border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <div className="flex space-x-2 items-center">
                      <span className="text-gray-600">{t('tax')}</span>
                      <input
                        type="number"
                        name="taxRate"
                        min="0"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={handleInputChange}
                        className="w-16 px-2 py-1 text-right border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                      <span>%</span>
                    </div>
                    
                    <span className="font-medium">{formatCurrency(formData.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 font-bold text-lg">
                    <span>{t('total')}</span>
                    <span>{formatCurrency(formData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
