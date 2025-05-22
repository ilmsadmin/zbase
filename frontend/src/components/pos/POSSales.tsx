import { useState } from 'react';
import Link from 'next/link';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Sample product categories
const categories = [
  { id: 1, name: 'Điện thoại' },
  { id: 2, name: 'Máy tính' },
  { id: 3, name: 'Phụ kiện' },
  { id: 4, name: 'Linh kiện' },
  { id: 5, name: 'Đồng hồ' },
  { id: 6, name: 'Máy ảnh' },
  { id: 7, name: 'Thiết bị văn phòng' },
  { id: 8, name: 'Thiết bị mạng' },
];

// Sample products data
const products = [
  { id: 1, name: 'iPhone 14 Pro', price: 26000000, image: '/phone1.jpg', category: 1 },
  { id: 2, name: 'Samsung Galaxy S23', price: 19500000, image: '/phone2.jpg', category: 1 },
  { id: 3, name: 'MacBook Air M2', price: 28500000, image: '/laptop1.jpg', category: 2 },
  { id: 4, name: 'Lenovo ThinkPad X1', price: 32000000, image: '/laptop2.jpg', category: 2 },
  { id: 5, name: 'AirPods Pro', price: 5500000, image: '/accessory1.jpg', category: 3 },
  { id: 6, name: 'Chuột Logitech G Pro', price: 1800000, image: '/accessory2.jpg', category: 3 },
  { id: 7, name: 'SSD Samsung 1TB', price: 3200000, image: '/component1.jpg', category: 4 },
];

// Sample customers data
const customers = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0123456789', group: 'Khách hàng thân thiết', debt: 0 },
  { id: 2, name: 'Trần Thị B', phone: '0987654321', group: 'Khách hàng VIP', debt: 2500000 },
  { id: 3, name: 'Lê Văn C', phone: '0123123123', group: 'Khách hàng mới', debt: 0 },
];

export default function POSSales() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number; }[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Filter products based on category and search term
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Add product to cart
  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update item quantity
  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate discount
  const discount = discountType === 'percent' 
    ? (subtotal * discountValue) / 100 
    : Math.min(discountValue, subtotal);
  
  // Calculate total
  const total = subtotal - discount;
  
  // Calculate change amount
  const changeAmount = Math.max(0, paymentAmount - total);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="h-full flex">
      {/* Left: Product Categories and Products */}
      <div className="w-3/5 h-full overflow-hidden flex flex-col">
        {/* Search and Categories */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm sản phẩm (tên, mã vạch, mã hàng)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                ${selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tất cả
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                  ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto mt-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="border rounded-lg p-2 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => addToCart(product)}
              >
                <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                  {/* Replace with actual image when available */}
                  <div className="text-gray-400 text-xs">Hình ảnh</div>
                </div>
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="text-blue-600">{formatPrice(product.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right: Cart and Payment */}
      <div className="w-2/5 h-full ml-4 flex flex-col">
        {/* Cart */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-medium mb-4">Giỏ hàng</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có sản phẩm trong giỏ hàng
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-blue-600">{formatPrice(item.price)}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <MinusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <PlusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={() => removeItem(item.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Summary */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Tổng cộng ({cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Chiết khấu:</span>
                  <span className="text-red-600">{formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Thành tiền:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-4 space-y-3">
                <button
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => setCart([])}
                >
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Customer and Payment */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khách hàng
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 border rounded-md p-2 bg-gray-50">
                {selectedCustomer ? (
                  <div>
                    <div className="font-medium">{selectedCustomer.name}</div>
                    <div className="text-sm text-gray-600">{selectedCustomer.group}</div>
                    {selectedCustomer.debt > 0 && (
                      <div className="text-sm text-red-600">Công nợ: {formatPrice(selectedCustomer.debt)}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Chưa chọn khách hàng</span>
                )}
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setShowCustomerModal(true)}
              >
                Chọn
              </button>
            </div>
          </div>
          
          {/* Discount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chiết khấu
            </label>
            <div className="flex space-x-2">
              <select
                className="w-24 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
              >
                <option value="percent">%</option>
                <option value="amount">VNĐ</option>
              </select>
              <input
                type="number"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0"
                value={discountValue || ''}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </div>
          </div>
          
          {/* Payment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thanh toán
            </label>
            <input
              type="number"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nhập số tiền khách trả"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />
            {paymentAmount > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span>Tiền thừa:</span>
                <span className={changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPrice(changeAmount)}
                </span>
              </div>
            )}
          </div>
          
          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 bg-blue-50 text-blue-700 rounded border border-blue-200 font-medium text-sm">
                Tiền mặt
              </button>
              <button className="py-2 bg-gray-50 text-gray-700 rounded border border-gray-200 font-medium text-sm">
                Chuyển khoản
              </button>
              <button className="py-2 bg-gray-50 text-gray-700 rounded border border-gray-200 font-medium text-sm">
                Thẻ tín dụng
              </button>
            </div>
          </div>
          
          {/* Complete Transaction */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium">
              Lưu tạm
            </button>
            <button 
              className="py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              disabled={cart.length === 0}
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
      
      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Chọn khách hàng</h2>
              <button onClick={() => setShowCustomerModal(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tìm kiếm khách hàng (tên, số điện thoại)"
              />
            </div>
            
            <div className="overflow-y-auto max-h-80 mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhóm
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Công nợ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map(customer => (
                    <tr 
                      key={customer.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerModal(false);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {customer.debt > 0 ? (
                          <span className="text-red-600">{formatPrice(customer.debt)}</span>
                        ) : (
                          <span className="text-gray-500">0 đ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowCustomerModal(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                onClick={() => setShowCustomerModal(false)}
              >
                Khách hàng mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
