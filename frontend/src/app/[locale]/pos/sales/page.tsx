'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import POSLayout from '@/components/layouts/POSLayout';
import { formatCurrency } from '@/lib/utils/format';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function POSSales() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  
  // Categories for filter
  const categories = [
    'all', 'phone', 'laptop', 'tablet', 'accessory', 'component'
  ];
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  // Mock data loading
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'iPhone 14 Pro Max',
          price: 28990000,
          image: 'https://via.placeholder.com/80',
          category: 'phone',
          inStock: 12
        },
        {
          id: 2,
          name: 'Samsung Galaxy S23 Ultra',
          price: 26990000,
          image: 'https://via.placeholder.com/80',
          category: 'phone',
          inStock: 8
        },
        {
          id: 3,
          name: 'MacBook Pro M2',
          price: 32990000,
          image: 'https://via.placeholder.com/80',
          category: 'laptop',
          inStock: 5
        },
        {
          id: 4,
          name: 'Dell XPS 13',
          price: 28990000,
          image: 'https://via.placeholder.com/80',
          category: 'laptop',
          inStock: 3
        },
        {
          id: 5,
          name: 'iPad Pro 12.9',
          price: 25990000,
          image: 'https://via.placeholder.com/80',
          category: 'tablet',
          inStock: 7
        },
        {
          id: 6,
          name: 'Tai nghe AirPods Pro',
          price: 5490000,
          image: 'https://via.placeholder.com/80',
          category: 'accessory',
          inStock: 15
        },
        {
          id: 7,
          name: 'Chuột Logitech MX Master',
          price: 1990000,
          image: 'https://via.placeholder.com/80',
          category: 'accessory',
          inStock: 20
        },
        {
          id: 8,
          name: 'RAM 16GB DDR4',
          price: 1590000,
          image: 'https://via.placeholder.com/80',
          category: 'component',
          inStock: 28
        }
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle search and filtering
  useEffect(() => {
    let results = [...products];
    
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products]);
  
  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity
        return prevCart.map(item => 
          item.id === product.id 
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
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price
          }
        ];
      }
    });
  };
  
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              quantity: newQuantity,
              total: item.price * newQuantity 
            } 
          : item
      )
    );
  };
  
  const removeItem = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const handleCompleteSale = () => {
    // In a real app, this would submit the sale to the backend
    alert(`Sale completed with ${paymentMethod === 'cash' ? 'Cash' : 'Card'} payment for ${formatCurrency(total)}`);
    setShowPaymentModal(false);
    clearCart();
  };
  
  return (
    <POSLayout>
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
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
                      <span className="text-xs text-gray-500">
                        SL: {product.inStock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Side - Cart */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
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
            <div className="flex justify-between text-sm">
              <span>Thuế VAT (10%):</span>
              <span>{formatCurrency(tax)}</span>
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
              onClick={() => setShowPaymentModal(true)}
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
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleCompleteSale}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                <span>Hoàn tất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </POSLayout>
  );
}
