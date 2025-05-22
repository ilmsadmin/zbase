'use client';

import { useState, useEffect } from 'react';
import POSLayout from '@/components/layouts/POSLayout';
import { formatDateTime, formatCurrency } from '@/lib/utils/format';
import { warrantyService, WarrantyStatus } from '@/lib/api/services/warranty';
import { posService } from '@/lib/api/services/pos';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ClockIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  QrCodeIcon,
  CameraIcon,
  PrinterIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Mock warranty data for demo purposes
interface WarrantyInfo {
  id: number;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  invoiceId: number;
  invoiceCode: string;
  price: number;
  warrantyDuration: string;
  notes?: string;
  warrantyRequests: WarrantyRequest[];
}

interface WarrantyRequest {
  id: number;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  description: string;
  resolution?: string;
  completedDate?: string;
  technician?: string;
}

// Define the interfaces for warranty information
interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
}

interface WarrantyRequest {
  id: number;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  description: string;
  resolution?: string;
  completedDate?: string;
  technician?: string;
}

interface WarrantyInfo {
  id: number;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  invoiceId: number;
  invoiceCode: string;
  price: number;
  warrantyDuration: string;
  notes?: string;
  warrantyRequests: WarrantyRequest[];
}

export default function POSWarrantyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'serial' | 'invoice' | 'phone'>('serial');
  const [searchResults, setSearchResults] = useState<WarrantyInfo[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyInfo | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  
  // Form state for creating a new warranty request
  const [newWarrantyForm, setNewWarrantyForm] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    productId: '',
    productName: '',
    serialNumber: '',
    invoiceId: '',
    invoiceCode: '',
    issueDescription: '',
    expectedReturnDate: '',
    notes: ''
  });

  useEffect(() => {
    checkCurrentShift();
  }, []);

  const checkCurrentShift = async () => {
    try {
      const shift = await posService.checkActiveShift();
      setActiveShift(shift.hasActiveShift ? shift.shiftData : null);
    } catch (err: any) {
      console.error('Error checking current shift:', err);
      setError(err.message || 'Failed to check current shift');
    }
  };  // Helper function to render badge for request status
  const getRequestStatusBadge = (status: 'pending' | 'processing' | 'completed' | 'rejected') => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // Mock data for warranty information
  const mockWarranties: WarrantyInfo[] = [
    {
      id: 1,
      productName: 'iPhone 15 Pro Max',
      serialNumber: 'SN123456789',
      purchaseDate: '2025-01-15T10:30:00Z',
      expiryDate: '2026-01-15T10:30:00Z',
      status: 'active',
      customer: {
        name: 'John Doe',
        phone: '0987654321',
        email: 'johndoe@example.com'
      },
      invoiceId: 12345,
      invoiceCode: 'INV-2025-001',
      price: 1299.99,
      warrantyDuration: '12 months',
      notes: 'Extended warranty purchased',
      warrantyRequests: []
    },
    {
      id: 2,
      productName: 'MacBook Pro 16"',
      serialNumber: 'MAC987654321',
      purchaseDate: '2024-11-20T14:45:00Z',
      expiryDate: '2025-11-20T14:45:00Z',
      status: 'active',
      customer: {
        name: 'Jane Smith',
        phone: '0123456789',
        email: 'janesmith@example.com'
      },
      invoiceId: 12346,
      invoiceCode: 'INV-2024-156',
      price: 2499.99,
      warrantyDuration: '12 months',
      notes: 'AppleCare+ included',
      warrantyRequests: [
        {
          id: 101,
          requestDate: '2025-03-10T09:15:00Z',
          status: 'completed',
          description: 'Display showing artifacts',
          resolution: 'Replaced display panel',
          completedDate: '2025-03-15T16:30:00Z',
          technician: 'Mike Johnson'
        }
      ]
    },
    {
      id: 3,
      productName: 'Samsung Galaxy S24 Ultra',
      serialNumber: 'SG24U123456',
      purchaseDate: '2025-02-05T11:30:00Z',
      expiryDate: '2026-02-05T11:30:00Z',
      status: 'active',
      customer: {
        name: 'Robert Brown',
        phone: '0345678912',
        email: 'robertbrown@example.com'
      },
      invoiceId: 12347,
      invoiceCode: 'INV-2025-023',
      price: 1199.99,
      warrantyDuration: '12 months',
      warrantyRequests: [
        {
          id: 102,
          requestDate: '2025-04-18T10:20:00Z',
          status: 'pending',
          description: 'Battery draining quickly',
          technician: 'Pending assignment'
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchQuery || searchQuery.length < 3) {
      alert('Please enter at least 3 characters to search');
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results: WarrantyInfo[] = [];
      
      // Mock search based on search type
      if (searchType === 'serial') {
        results = mockWarranties.filter(w => 
          w.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (searchType === 'invoice') {
        results = mockWarranties.filter(w => 
          w.invoiceCode.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (searchType === 'phone') {
        results = mockWarranties.filter(w => 
          w.customer.phone.includes(searchQuery)
        );
      }
      
      setSearchResults(results);
      
      if (results.length === 1) {
        // If only one result, select it automatically
        setSelectedWarranty(results[0]);
      } else {
        setSelectedWarranty(null);
      }
      
      setLoading(false);
    }, 800);
  };
  
  const handleSelectWarranty = (warranty: WarrantyInfo) => {
    setSelectedWarranty(warranty);
  };
  
  const handleCreateWarranty = () => {
    if (!activeShift) {
      alert('You need to open a shift before creating a warranty request');
      return;
    }
    
    const requiredFields = ['customerName', 'customerPhone', 'productName', 'serialNumber', 'issueDescription'];
    
    const missingFields = requiredFields.filter(field => {
      return !newWarrantyForm[field as keyof typeof newWarrantyForm];
    });
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create a new mock warranty
      const newWarranty: WarrantyInfo = {
        id: Math.floor(Math.random() * 10000),
        productName: newWarrantyForm.productName,
        serialNumber: newWarrantyForm.serialNumber,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        customer: {
          name: newWarrantyForm.customerName,
          phone: newWarrantyForm.customerPhone,
          email: ''
        },
        invoiceId: newWarrantyForm.invoiceId ? parseInt(newWarrantyForm.invoiceId) : 0,
        invoiceCode: newWarrantyForm.invoiceCode,
        price: 0,
        warrantyDuration: '12 months',
        notes: newWarrantyForm.notes,
        warrantyRequests: [
          {
            id: Math.floor(Math.random() * 10000),
            requestDate: new Date().toISOString(),
            status: 'pending',
            description: newWarrantyForm.issueDescription,
            technician: 'Pending assignment'
          }
        ]
      };
      
      // Reset the form
      setNewWarrantyForm({
        customerId: '',
        customerName: '',
        customerPhone: '',
        productId: '',
        productName: '',
        serialNumber: '',
        invoiceId: '',
        invoiceCode: '',
        issueDescription: '',
        expectedReturnDate: '',
        notes: ''
      });
      
      setShowCreateForm(false);
      
      // Display the newly created warranty
      setSelectedWarranty(newWarranty);
      setSearchResults([newWarranty]);
      setHasSearched(true);
      setLoading(false);
    }, 1000);
  };
  
  const handleCancel = () => {
    setShowCreateForm(false);
    setNewWarrantyForm({
      customerId: '',
      customerName: '',
      customerPhone: '',
      productId: '',
      productName: '',
      serialNumber: '',
      invoiceId: '',
      invoiceCode: '',
      issueDescription: '',
      expectedReturnDate: '',
      notes: ''
    });
  };
  
  // Function to print the warranty details
  const printWarranty = () => {
    if (!selectedWarranty) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the warranty details');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Warranty Receipt #${selectedWarranty.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1, h2 { text-align: center; }
            .warranty-box { border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; }
            .section-title { font-weight: bold; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo h1 { margin-bottom: 0; }
            .logo p { margin-top: 5px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; }
            .disclaimer { margin-top: 20px; font-size: 11px; }
            .barcode { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="logo">
            <h1>ZBase Electronics</h1>
            <p>Your Trusted Electronics Partner</p>
          </div>
          
          <h2>Warranty Receipt</h2>
          
          <div class="warranty-box">
            <div class="row">
              <span><strong>Warranty ID:</strong></span>
              <span>${selectedWarranty.id}</span>
            </div>
            <div class="row">
              <span><strong>Date:</strong></span>
              <span>${formatDateTime(selectedWarranty.purchaseDate)}</span>
            </div>
            <div class="row">
              <span><strong>Status:</strong></span>
              <span>${selectedWarranty.status}</span>
            </div>
          </div>
          
          <div class="section-title">Customer Information</div>
          <div class="warranty-box">
            <div class="row">
              <span><strong>Name:</strong></span>
              <span>${selectedWarranty.customer.name}</span>
            </div>
            <div class="row">
              <span><strong>Phone:</strong></span>
              <span>${selectedWarranty.customer.phone}</span>
            </div>
          </div>
          
          <div class="section-title">Product Information</div>
          <div class="warranty-box">
            <div class="row">
              <span><strong>Product:</strong></span>
              <span>${selectedWarranty.productName}</span>
            </div>
            <div class="row">
              <span><strong>Serial Number:</strong></span>
              <span>${selectedWarranty.serialNumber}</span>
            </div>
            <div class="row">
              <span><strong>Invoice:</strong></span>
              <span>${selectedWarranty.invoiceCode}</span>
            </div>
          </div>
          
          <div class="section-title">Warranty Information</div>
          <div class="warranty-box">
            <div class="row">
              <span><strong>Purchase Date:</strong></span>
              <span>${formatDateTime(selectedWarranty.purchaseDate)}</span>
            </div>
            <div class="row">
              <span><strong>Expiry Date:</strong></span>
              <span>${formatDateTime(selectedWarranty.expiryDate)}</span>
            </div>
            <div class="row">
              <span><strong>Duration:</strong></span>
              <span>${selectedWarranty.warrantyDuration}</span>
            </div>
            ${selectedWarranty.notes ? `<p><strong>Notes:</strong><br>${selectedWarranty.notes}</p>` : ''}
          </div>
          
          <div class="footer">
            <p>Thank you for choosing ZBase Electronics!</p>
            <p>For any warranty inquiries, please call: (123) 456-7890</p>
          </div>
          
          <div class="disclaimer">
            <p>DISCLAIMER: This warranty covers manufacturer defects only. Physical damage, water damage, or improper use are not covered. Warranty is void if product has been opened, modified, or repaired by unauthorized personnel.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  // Helper function to render badge based on warranty status
  const getStatusBadge = (status: 'active' | 'expired' | 'pending') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Expired
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };
  return (
    <POSLayout>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Warranty Management</h1>
          
          <button 
            onClick={() => setShowCreateForm(true)}
            disabled={!activeShift}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              activeShift 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={activeShift ? 'Create new warranty request' : 'Open a shift to create warranty requests'}
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Request</span>
          </button>
        </div>        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-medium mb-4">Search Warranty</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSearchType('serial')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    searchType === 'serial' 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Serial Number
                </button>
                <button
                  onClick={() => setSearchType('invoice')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    searchType === 'invoice' 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => setSearchType('phone')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    searchType === 'phone' 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Phone
                </button>
              </div>
              
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === 'serial' ? "Enter serial number..." :
                    searchType === 'invoice' ? "Enter invoice number..." :
                    "Enter customer phone..."
                  }
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading || searchQuery.length < 3}
              className={`md:self-end px-4 py-2 rounded-md flex items-center justify-center ${
                loading || searchQuery.length < 3
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                  Search
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}          {/* Search hint */}
          {!hasSearched && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Search for warranties by serial number, invoice number, or customer phone</p>
              <p className="mt-1">For demo: Try searching for "SN1", "INV", or "098"</p>
            </div>
          )}
          
          {/* Search results */}
          {hasSearched && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Search Results</h3>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}
              
              {searchResults.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
                  No warranty information found for this search. Please try a different query or create a new warranty request.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serial Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((warranty) => (
                        <tr 
                          key={warranty.id}
                          className={`hover:bg-gray-50 ${selectedWarranty?.id === warranty.id ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {warranty.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {warranty.serialNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{warranty.customer.name}</div>
                            <div className="text-sm text-gray-500">{warranty.customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(warranty.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(warranty.expiryDate).split(' ')[0]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleSelectWarranty(warranty)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>        {/* Selected Warranty Details */}
        {selectedWarranty && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-4">
                  <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedWarranty.productName}</h3>
                  <p className="text-sm text-gray-500">Serial: {selectedWarranty.serialNumber}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={printWarranty}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title="Print warranty details"
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
              </div>
            </div>            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Product Information</h4>
                  <div className="bg-gray-50 rounded-md p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Product Name</div>
                      <div className="font-medium">{selectedWarranty.productName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Serial Number</div>
                      <div className="font-medium">{selectedWarranty.serialNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Purchase Date</div>
                      <div className="font-medium">{formatDateTime(selectedWarranty.purchaseDate).split(' ')[0]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Warranty Until</div>
                      <div className="font-medium">{formatDateTime(selectedWarranty.expiryDate).split(' ')[0]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Price</div>
                      <div className="font-medium">{formatCurrency(selectedWarranty.price)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Invoice</div>
                      <div className="font-medium">{selectedWarranty.invoiceCode}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Warranty Status</div>
                      <div className="font-medium">{getStatusBadge(selectedWarranty.status)}</div>
                    </div>
                    {selectedWarranty.notes && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500 mb-1">Notes</div>
                        <div className="font-medium">{selectedWarranty.notes}</div>
                      </div>
                    )}
                  </div>
                </div>                
                {/* Customer Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h4>
                  <div className="bg-gray-50 rounded-md p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Name</div>
                      <div className="font-medium">{selectedWarranty.customer.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <div className="font-medium">{selectedWarranty.customer.phone}</div>
                    </div>
                    {selectedWarranty.customer.email && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium">{selectedWarranty.customer.email}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Warranty History */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Warranty Requests</h4>
                    {selectedWarranty.warrantyRequests.length === 0 ? (
                      <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
                        No warranty requests found
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="space-y-4">
                          {selectedWarranty.warrantyRequests.map((request) => (
                            <div key={request.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Request #{request.id}</span>
                                {getRequestStatusBadge(request.status)}
                              </div>
                              <div className="text-sm text-gray-700 mb-2">{request.description}</div>
                              <div className="text-xs text-gray-500">
                                Submitted: {formatDateTime(request.requestDate)}
                              </div>
                              {request.completedDate && (
                                <div className="text-xs text-gray-500">
                                  Completed: {formatDateTime(request.completedDate)}
                                </div>
                              )}
                              {request.resolution && (
                                <div className="mt-2 text-sm border-l-2 border-gray-300 pl-2">
                                  <span className="text-gray-500">Resolution: </span>
                                  <span className="text-gray-700">{request.resolution}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedWarranty(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to Search
                </button>
                <button
                  onClick={() => {
                    if (activeShift) {
                      setShowCreateForm(true);
                      setNewWarrantyForm({
                        ...newWarrantyForm,
                        productName: selectedWarranty.productName,
                        serialNumber: selectedWarranty.serialNumber,
                        customerName: selectedWarranty.customer.name,
                        customerPhone: selectedWarranty.customer.phone
                      });
                    } else {
                      alert('You need to open a shift before creating a warranty request');
                    }
                  }}
                  disabled={!activeShift}
                  className={`px-4 py-2 rounded-md flex items-center justify-center ${
                    activeShift 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Request
                </button>
              </div>
            </div>
          </div>
        )}        {/* New Warranty Request Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="font-medium text-lg">Create Warranty Request</h3>
                <button 
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Customer Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Customer Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        value={newWarrantyForm.customerName}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, customerName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        id="customerPhone"
                        value={newWarrantyForm.customerPhone}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, customerPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Product Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Product Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="productName"
                        value={newWarrantyForm.productName}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, productName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Serial Number *
                      </label>
                      <input
                        type="text"
                        id="serialNumber"
                        value={newWarrantyForm.serialNumber}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, serialNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter serial number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="invoiceCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="invoiceCode"
                        value={newWarrantyForm.invoiceCode}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, invoiceCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter invoice number"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Issue Details */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <ShieldExclamationIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Issue Details
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Description *
                      </label>
                      <textarea
                        id="issueDescription"
                        value={newWarrantyForm.issueDescription}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, issueDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the issue in detail"
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={newWarrantyForm.notes}
                        onChange={(e) => setNewWarrantyForm({ ...newWarrantyForm, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional notes or comments"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWarranty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* No Active Shift Warning (when applicable) */}
        {!activeShift && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">No Active Shift</p>
                <p className="text-yellow-700 mt-1">
                  You need to open a shift to create new warranty requests. 
                  Go to <span className="font-medium">Shift Management</span> to open a new shift.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </POSLayout>
  );
}


