'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import POSLayout from '@/components/layouts/POSLayout';
import { formatCurrency } from '@/lib/utils/format';
import { posService } from '@/lib/api/services/pos';
import { printInvoice, generateInvoiceId } from '@/lib/utils/invoicePrint';
import {
  BarcodeFormat,
  validateBarcode,
  cleanBarcodeInput,
  handlePartialBarcode
} from '@/lib/utils/barcode';

interface Product {
  id: number;
  name: string;
  price: number;
  basePrice?: number;
  image?: string;
  category?: string;
  code: string;
  availableQuantity: number;
  taxRate?: number;
  description?: string;
  location?: any;
}

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  taxRate: number;
}

interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  code?: string;
}

// Helper function to print a sale invoice
const printSaleInvoice = (saleResponse: any) => {
  // If we have a successful sale response, generate and print invoice
  if (!saleResponse) return;
  
  // Get store information (this would typically come from app settings)
  const storeInfo = {
    name: 'ZBase Technologies',
    address: '123 Tech Street, District 1, Ho Chi Minh City, Vietnam',
    phone: '+84 123 456 789',
    email: 'sales@zbase.vn',
    website: 'www.zbase.vn',
  };
  
  // Map cart items to invoice items
  const invoiceItems = cart.map(item => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
    taxRate: item.taxRate
  }));
  
  // Create invoice data object
  const invoiceData = {
    invoiceId: saleResponse.invoiceNumber || generateInvoiceId(),
    date: new Date(),
    items: invoiceItems,
    subtotal: subtotal,
    tax: tax,
    discount: 0, // Add discount handling if needed
    total: total,
    customer: selectedCustomer || undefined,
    paymentMethod: paymentMethod,
    paidAmount: paidAmount,
    notes: saleResponse.notes || `Sale completed on ${new Date().toLocaleDateString()}`,
    storeName: storeInfo.name,
    storeAddress: storeInfo.address,
    storePhone: storeInfo.phone,
    storeEmail: storeInfo.email,
    storeWebsite: storeInfo.website
    // Add logo URL if available
  };
  
  // Print the invoice
  printInvoice(invoiceData);
};

export default function POSSales() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [activeShift, setActiveShift] = useState<any | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingSale, setIsProcessingSale] = useState(false);
    // Barcode scanner states
  const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [isProcessingBarcode, setIsProcessingBarcode] = useState<boolean>(false);
  const [scanFeedback, setScanFeedback] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const [detectedBarcodeFormat, setDetectedBarcodeFormat] = useState<BarcodeFormat | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  
  // Categories for filter
  const categories = [
    'all', 'phone', 'laptop', 'tablet', 'accessory', 'component'
  ];
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = cart.reduce((sum, item) => sum + (item.price * item.quantity * (item.taxRate / 100)), 0);
  const total = subtotal; // Tax is already included in the subtotal calculated from cart items
  
  useEffect(() => {
    checkShiftAndLoadProducts();
  }, []);
  
  // Barcode scanner detection
  useEffect(() => {
    // Handler for keydown events for barcode scanning
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check if this could be part of a barcode scan
      const currentTime = new Date().getTime();
      
      // Barcode scanners typically send characters very quickly in succession
      // If the time gap is too large, we assume it's manual typing
      // Maximum gap between characters depends on scanner speed, typically 20-50ms
      const maxGap = 50; // milliseconds
      
      if (currentTime - lastScanTime > maxGap && barcodeBuffer.length > 0) {
        // Reset if the gap is too large
        // If buffer has reasonable length, it might be a manually entered barcode
        if (barcodeBuffer.length >= 5) {
          // Handle as a potential manual barcode entry
          const cleanedBarcode = cleanBarcodeInput(barcodeBuffer);
          processBarcode(cleanedBarcode);
        }
        // Reset the buffer regardless
        setBarcodeBuffer('');
      }
      
      setLastScanTime(currentTime);
      
      // Add character to buffer if it's a valid barcode character
      // Expanding the valid characters to support more barcode formats
      // Including digits, letters, spaces and special characters used in various barcode types
      if (e.key.length === 1 && /[\d\w\-\.\$\/\+\% ]/.test(e.key)) {
        setBarcodeBuffer(prev => prev + e.key);
      } else if (e.key === 'Enter' && barcodeBuffer.length > 3) {
        // Most barcode scanners send Enter key after scanning
        // Reduced minimum length to 4 to support some short format barcodes
        e.preventDefault();
        
        // Clean the buffer before processing
        const cleanedBarcode = cleanBarcodeInput(barcodeBuffer);
        processBarcode(cleanedBarcode);
      }
    };

    // Add and remove event listener
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [barcodeBuffer, lastScanTime]);
    // Check for offline mode on component mount and when network status changes
  useEffect(() => {
    const checkNetworkStatus = () => {
      const wasOffline = isOfflineMode;
      const isNowOffline = !navigator.onLine;
      
      setIsOfflineMode(isNowOffline);
      
      // If we were offline but now we're online, process stored barcodes
      if (wasOffline && !isNowOffline) {
        setScanFeedback({
          message: 'Back online! Processing stored barcodes...',
          type: 'success'
        });
        
        // Small delay to ensure connection is stable
        setTimeout(() => {
          processOfflineBarcodes();
        }, 1000);
      }
    };
    
    // Initial check
    checkNetworkStatus();
    
    // Add event listeners for network status changes
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, [isOfflineMode]);
  
  const checkShiftAndLoadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user has an active shift
      const shiftStatus = await posService.checkActiveShift();
      
      if (!shiftStatus.hasActiveShift) {
        // No active shift, redirect to the shifts page
        router.push('/pos/shifts');
        return;
      }
      
      setActiveShift(shiftStatus.shiftData);
      
      // Load products
      const response = await posService.searchProducts('', shiftStatus.shiftData.warehouseId);
      
      const formattedProducts = response.items.map(product => ({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        basePrice: product.basePrice,
        code: product.code,
        availableQuantity: Number(product.availableQuantity),
        taxRate: product.taxRate || 0,
        description: product.description || '',
        image: 'https://via.placeholder.com/80',
        category: getCategoryFromName(product.name),
        location: product.location,
      }));
      
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine category based on product name
  const getCategoryFromName = (name: string): string => {
    name = name.toLowerCase();
    if (name.includes('phone') || name.includes('iphone') || name.includes('samsung')) return 'phone';
    if (name.includes('laptop') || name.includes('macbook') || name.includes('thinkpad')) return 'laptop';
    if (name.includes('tablet') || name.includes('ipad')) return 'tablet';
    if (name.includes('headphone') || name.includes('airpod') || name.includes('mouse') || name.includes('keyboard')) return 'accessory';
    if (name.includes('ram') || name.includes('cpu') || name.includes('gpu')) return 'component';
    return 'other';
  };
  
  // Search for customers
  const searchCustomers = async (query: string) => {
    if (!query || query.length < 2) {
      setCustomers([]);
      return;
    }
    
    try {
      setIsCustomerLoading(true);
      const response = await posService.searchCustomers(query);
      setCustomers(response.items);
    } catch (err) {
      console.error('Error searching customers:', err);
    } finally {
      setIsCustomerLoading(false);
    }
  };
  
  // Handle search and filtering
  useEffect(() => {
    let results = [...products];
    
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products]);
  
  // Handle customer search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchCustomers(customerSearchQuery);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [customerSearchQuery]);
    // Process the barcode after scanning
  const processBarcode = async (barcode: string) => {
    if (isProcessingBarcode || !barcode || barcode.length < 4) return;
    
    try {
      setIsProcessingBarcode(true);
      console.log(`Processing barcode: ${barcode}`);
      
      // Validate the barcode format
      const validationResult = validateBarcode(barcode);
      setDetectedBarcodeFormat(validationResult.format);
      
      // If the barcode format is invalid but we have a partial scan, try to recover
      if (!validationResult.isValid) {
        console.log(`Barcode validation failed: ${validationResult.message}`);
        
        // Try to recover from partial scan
        const recoveredBarcode = handlePartialBarcode(barcode);
        if (!recoveredBarcode) {
          // If recovery failed, show error
          setScanFeedback({
            message: `Invalid barcode format: ${validationResult.message || 'Unknown error'}`,
            type: 'error'
          });
          return;
        }
        
        // Use the recovered barcode instead
        barcode = recoveredBarcode;
        console.log(`Using recovered barcode: ${barcode}`);
      }
      
      // Store the last scanned barcode for potential re-use
      setLastScannedBarcode(barcode);
      
      // Search for the product in the database by barcode
      if (!activeShift) {
        setScanFeedback({
          message: 'No active shift found. Please start a shift first.',
          type: 'error'
        });
        return;
      }
      
      // Check if offline mode is active
      if (isOfflineMode) {
        // In offline mode, only search locally
        handleOfflineBarcodeScan(barcode);
        return;
      }
      
      // First check if the product is already loaded in the local state
      const existingProduct = products.find(
        p => p.code === barcode || (p as any).barcode === barcode
      );
      
      if (existingProduct) {
        // Add product directly to cart if found
        addToCart(existingProduct);
        // Show success feedback
        setScanFeedback({
          message: `Added ${existingProduct.name} to cart`,
          type: 'success'
        });
        // Clear the barcode buffer
        setBarcodeBuffer('');
        return;
      }
      
      // If not found locally, search via API
      const response = await posService.searchProducts(barcode, activeShift.warehouseId);
      
      if (response.items.length > 0) {
        const scannedProduct = response.items[0];
        const formattedProduct = {
          id: scannedProduct.id,
          name: scannedProduct.name,
          price: scannedProduct.basePrice,
          basePrice: scannedProduct.basePrice,
          code: scannedProduct.code,
          availableQuantity: Number(scannedProduct.availableQuantity),
          taxRate: scannedProduct.taxRate || 0,
          description: scannedProduct.description || '',
          image: 'https://via.placeholder.com/80',
          category: getCategoryFromName(scannedProduct.name),
          location: scannedProduct.location,
        };

        // Add product to cart
        addToCart(formattedProduct);
        
        // Add to products list if not already there
        setProducts(prevProducts => {
          if (!prevProducts.some(p => p.id === formattedProduct.id)) {
            return [...prevProducts, formattedProduct];
          }
          return prevProducts;
        });
        
        // Show success feedback
        setScanFeedback({
          message: `Added ${formattedProduct.name} to cart`,
          type: 'success'
        });
      } else {
        // No product found for this barcode
        console.log(`No product found with barcode: ${barcode}`);
        setScanFeedback({
          message: `No product found with barcode: ${barcode}`,
          type: 'error'
        });
      }
    } catch (err: any) {
      console.error('Error processing barcode:', err);
      setScanFeedback({
        message: err.message || 'Error processing barcode',
        type: 'error'
      });
    } finally {
      setIsProcessingBarcode(false);
      setBarcodeBuffer(''); // Reset buffer regardless of result
      
      // Hide feedback after 3 seconds
      setTimeout(() => {
        setScanFeedback(null);
      }, 3000);
    }
  };
    // Handle barcode scanning in offline mode
  const handleOfflineBarcodeScan = (barcode: string) => {
    // In offline mode, we can only search in already loaded products
    const existingProduct = products.find(
      p => p.code === barcode || (p as any).barcode === barcode
    );
    
    if (existingProduct) {
      // Add product to cart
      addToCart(existingProduct);
      setScanFeedback({
        message: `Added ${existingProduct.name} to cart (offline mode)`,
        type: 'success'
      });
    } else {
      // Store the barcode for later processing when online
      const stored = storeOfflineBarcode(barcode);
      
      setScanFeedback({
        message: stored 
          ? `Product not found in offline cache. Barcode saved for processing when online.`
          : `Failed to store barcode for later processing.`,
        type: stored ? 'success' : 'error'
      });
    }
    
    // Reset buffer
    setBarcodeBuffer('');
  };
  
  // Store offline barcode for later processing
  const storeOfflineBarcode = (barcode: string) => {
    try {
      // Get existing offline barcodes
      const existingBarcodes = JSON.parse(localStorage.getItem('offline_barcodes') || '[]');
      
      // Add new barcode with timestamp
      const offlineBarcode = {
        barcode,
        timestamp: new Date().toISOString(),
        processed: false
      };
      
      // Add to list and save back to localStorage
      localStorage.setItem('offline_barcodes', 
        JSON.stringify([...existingBarcodes, offlineBarcode])
      );
      
      return true;
    } catch (error) {
      console.error('Error storing offline barcode:', error);
      return false;
    }
  };
  
  // Process offline barcodes when we're back online
  const processOfflineBarcodes = async () => {
    if (isOfflineMode) return;
    
    try {
      // Get stored barcodes
      const storedBarcodes = JSON.parse(localStorage.getItem('offline_barcodes') || '[]');
      
      if (storedBarcodes.length === 0) return;
      
      setScanFeedback({
        message: `Processing ${storedBarcodes.length} offline barcodes...`,
        type: 'success'
      });
      
      // Process each barcode
      for (const item of storedBarcodes) {
        if (!item.processed) {
          await processBarcode(item.barcode);
          
          // Mark as processed
          item.processed = true;
        }
      }
      
      // Save updated list
      localStorage.setItem('offline_barcodes', JSON.stringify(storedBarcodes));
      
      // Remove all processed barcodes
      const remainingBarcodes = storedBarcodes.filter(item => !item.processed);
      localStorage.setItem('offline_barcodes', JSON.stringify(remainingBarcodes));
      
    } catch (error) {
      console.error('Error processing offline barcodes:', error);
    }
  };
  
  // Cart functions
  const addToCart = (product: Product) => {
    if (product.availableQuantity < 1) {
      alert('This product is out of stock');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Check if we can add more of this product
        if (existingItem.quantity >= product.availableQuantity) {
          alert(`Cannot add more items. Only ${product.availableQuantity} available in stock.`);
          return prevCart;
        }
        
        // Update quantity
        return prevCart.map(item => 
          item.productId === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: item.price * (item.quantity + 1) 
              } 
            : item
        );
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            id: Date.now(), // Temporary ID for cart item
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price,
            taxRate: product.taxRate || 0
          }
        ];
      }
    });
  };
  
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === itemId);
      if (!item) return prevCart;
      
      const product = products.find(p => p.id === item.productId);
      if (product && newQuantity > product.availableQuantity) {
        alert(`Cannot add more items. Only ${product.availableQuantity} available in stock.`);
        return prevCart;
      }
      
      return prevCart.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              quantity: newQuantity,
              total: item.price * newQuantity 
            } 
          : item
      );
    });
  };
  
  const removeItem = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
    const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };
  
  // Barcode scan feedback component
  const BarcodeScanFeedback = () => {
    if (!scanFeedback) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 transition-opacity duration-300 ${
        scanFeedback.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 
                                         'bg-red-100 border-l-4 border-red-500'
      }`}>
        <div className="flex items-center">
          {scanFeedback.type === 'success' ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
          ) : (
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
          )}
          <div>
            <p className={`font-medium ${
              scanFeedback.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {scanFeedback.message}
            </p>
            {detectedBarcodeFormat && (
              <p className="text-sm text-gray-600 mt-1">Format: {detectedBarcodeFormat}</p>
            )}
            {isOfflineMode && (
              <p className="text-sm text-amber-600 font-semibold mt-1">
                Working in offline mode
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
    const handleShowPayment = () => {
    setPaidAmount(total); // Default to full amount
    setShowPaymentModal(true);
  };
  
  // Helper function to print a sale invoice
  const printSaleInvoice = (saleResponse: any) => {
    // If we have a successful sale response, generate and print invoice
    if (!saleResponse) return;
    
    // Get store information (this would typically come from app settings)
    const storeInfo = {
      name: 'ZBase Technologies',
      address: '123 Tech Street, District 1, Ho Chi Minh City, Vietnam',
      phone: '+84 123 456 789',
      email: 'sales@zbase.vn',
      website: 'www.zbase.vn'
    };
    
    // Map cart items to invoice items
    const invoiceItems = cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      taxRate: item.taxRate
    }));
    
    // Create invoice data object
    const invoiceData = {
      invoiceId: saleResponse.invoiceNumber || generateInvoiceId(),
      date: new Date(),
      items: invoiceItems,
      subtotal: subtotal,
      tax: tax,
      discount: 0, // Add discount handling if needed
      total: total,
      customer: selectedCustomer || undefined,
      paymentMethod: paymentMethod,
      paidAmount: paidAmount,
      notes: saleResponse.notes || `Sale completed on ${new Date().toLocaleDateString()}`,
      storeName: storeInfo.name,
      storeAddress: storeInfo.address,
      storePhone: storeInfo.phone,
      storeEmail: storeInfo.email,
      storeWebsite: storeInfo.website
      // Add logo URL if available
    };
    
    // Print the invoice
    printInvoice(invoiceData);
  };
    
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    
    try {
      setIsProcessingSale(true);
      
      // Format cart items for API
      const saleItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }));
      
      // Create sale request
      const saleData = {
        customerId: selectedCustomer?.id,
        items: saleItems,
        paymentMethod: paymentMethod,
        paidAmount: paidAmount,
        notes: `POS sale completed on ${new Date().toLocaleDateString()}`
      };
      
      // Submit to API
      const saleResponse = await posService.createQuickSale(saleData);
      
      // Print invoice
      printSaleInvoice(saleResponse);
      
      // Success! Clear cart and close modal
      setShowPaymentModal(false);
      clearCart();
      
      // Show success message
      alert('Sale completed successfully!');
      
    } catch (err: any) {
      console.error('Error completing sale:', err);
      alert(`Failed to complete sale: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessingSale(false);
    }
  };
  
  if (error) {
    return (
      <POSLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Sales Interface</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={checkShiftAndLoadProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </POSLayout>
    );
  }
    return (
    <POSLayout>
      {/* Barcode Scanner Status Bar */}
      <div className={`mb-4 p-2 rounded-md flex items-center justify-between ${
        isOfflineMode ? 'bg-amber-100 border-l-4 border-amber-500' : 'bg-blue-50 border-l-4 border-blue-500'
      }`}>
        <div className="flex items-center">
          {isOfflineMode ? (
            <span className="inline-flex items-center text-amber-800">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> 
              Offline Mode - Using cached products only
            </span>
          ) : (
            <span className="inline-flex items-center text-blue-800">
              <CheckCircleIcon className="h-5 w-5 mr-2" /> 
              Barcode Scanner Ready - Online Mode
            </span>
          )}
        </div>
        {detectedBarcodeFormat && lastScannedBarcode && (
          <div className="text-sm text-gray-700">
            Last scan: <span className="font-medium">{lastScannedBarcode}</span> 
            <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
              {detectedBarcodeFormat}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex h-full">
        {/* Left Side - Products */}
        <div className="w-2/3 pr-6">
          {/* Search and Filter */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button 
                onClick={checkShiftAndLoadProducts} 
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                title="Refresh products"
              >
                <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'Tất cả' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow
                    ${product.availableQuantity > 0 ? 'border-gray-200' : 'border-red-200 opacity-60'}`}
                >
                  <div className="p-4 flex flex-col">
                    <div className="w-full h-24 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="max-h-20" />
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-blue-600 font-bold">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={`text-xs ${product.availableQuantity > 0 ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                        SL: {product.availableQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && !isLoading && (
                <div className="col-span-4 py-12 flex flex-col items-center">
                  <p className="text-gray-500 mb-3">No products found</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Side - Cart */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
          {/* Customer selection */}
          <div className="mb-4 border-b border-gray-200 pb-4">
            {selectedCustomer ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Customer</div>
                  <div className="font-medium">{selectedCustomer.name}</div>
                  <div className="text-sm text-gray-500">{selectedCustomer.phone}</div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                {!showCustomerSelect ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Customer</div>
                      <div className="font-medium">Walk-in Customer</div>
                    </div>
                    <button 
                      onClick={() => setShowCustomerSelect(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <UserIcon className="h-3.5 w-3.5 mr-1" />
                      Select
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto border-gray-200 rounded-lg">
                      {isCustomerLoading ? (
                        <div className="text-center py-3">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <div>
                          {customers.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                              {customers.map(customer => (
                                <div 
                                  key={customer.id} 
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setShowCustomerSelect(false);
                                    setCustomerSearchQuery('');
                                  }}
                                  className="py-2 px-3 hover:bg-blue-50 cursor-pointer"
                                >
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                </div>
                              ))}
                            </div>
                          ) : customerSearchQuery.length > 1 ? (
                            <div className="text-center py-3 text-sm text-gray-500">
                              No customers found
                            </div>
                          ) : (
                            <div className="text-center py-3 text-sm text-gray-500">
                              Type to search customers
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-2 flex justify-between">
                        <button
                          onClick={() => {
                            setShowCustomerSelect(false);
                            setCustomerSearchQuery('');
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowCustomerSelect(false);
                            setCustomerSearchQuery('');
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1"
                        >
                          Use walk-in customer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <h2 className="text-lg font-medium mb-4">Giỏ hàng</h2>
          
          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Giỏ hàng trống
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex-grow mr-4">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">{formatCurrency(item.price)}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-md"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-md text-blue-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 flex items-center justify-center bg-red-100 rounded-md text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={clearCart}
              disabled={cart.length === 0}
              className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xóa tất cả
            </button>
            <button 
              onClick={handleShowPayment}
              disabled={cart.length === 0}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Xác nhận thanh toán</h2>
            <div className="mb-6">
              <div className="flex justify-between py-2">
                <span>Số lượng sản phẩm:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              {/* Paid amount input */}
              <div className="mt-4">
                <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền thanh toán
                </label>
                <input
                  type="number"
                  id="paidAmount"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {paidAmount < total && (
                <div className="mt-2 text-sm text-yellow-600">
                  <p>This will create an unpaid balance of {formatCurrency(total - paidAmount)}</p>
                </div>
              )}
              
              {paidAmount > total && (
                <div className="flex justify-between py-2 text-green-600 mt-2">
                  <span>Tiền thừa:</span>
                  <span>{formatCurrency(paidAmount - total)}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border ${
                    paymentMethod === 'cash' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <BanknotesIcon className="h-5 w-5" />
                  <span>Tiền mặt</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border ${
                    paymentMethod === 'card' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  <span>Thẻ</span>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessingSale}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCompleteSale}
                disabled={isProcessingSale}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingSale ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Hoàn tất</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Barcode Scan Feedback */}
      <BarcodeScanFeedback />
    </POSLayout>
  );
}
