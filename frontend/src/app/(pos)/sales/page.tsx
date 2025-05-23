'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import ShiftManager from '@/components/pos/ShiftManager';
import { UserRole } from '@/types';

export default function POSSalesPage() {
  const { /* user not used currently */ } = useAuth();
  const [showShiftManager, setShowShiftManager] = useState(false);
  
  return (
    <div className="flex h-full w-full">
      {/* Left Side - Products & Shift Management */}
      <div className="w-2/3 p-4 flex flex-col">
        {/* Shift Manager Toggle */}
        <div className="mb-4">
          <button 
            onClick={() => setShowShiftManager(!showShiftManager)}
            className={`px-4 py-2 mb-3 rounded-md text-sm ${
              showShiftManager 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {showShiftManager ? 'Quay lại bán hàng' : 'Quản lý ca làm việc'}
          </button>
          
          {showShiftManager ? (
            <ShiftManager />
          ) : (
            <>
              {/* Search and Category Bar */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  Tìm
                </button>
              </div>
              
              {/* Categories */}
              <div className="flex overflow-x-auto space-x-2 py-2">
                {['Tất cả', 'Đồ uống', 'Thực phẩm', 'Đồ dùng', 'Đồ điện tử', 'Khác'].map((category) => (
                  <button 
                    key={category}
                    className="px-4 py-1 border border-border rounded-full hover:bg-secondary whitespace-nowrap"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
          {/* Products Grid - Only show when not in shift manager */}
        {!showShiftManager && (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(20).fill(0).map((_, idx) => (
                <div key={idx} className="border border-border rounded-lg p-2 bg-card hover:border-primary cursor-pointer">
                  <div className="aspect-square bg-muted rounded-md mb-2"></div>
                  <p className="font-medium truncate">Sản phẩm {idx + 1}</p>
                  <p className="text-primary font-semibold">{(10000 * (idx + 1)).toLocaleString()}₫</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Right Side - Cart */}
      <div className="w-1/3 border-l border-border flex flex-col">
        {/* Customer Info */}
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Khách hàng</h3>
            <button className="text-sm text-primary">+ Thêm</button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Khách lẻ</span>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Sản phẩm {item}</p>
                  <p className="text-sm text-muted-foreground">{item} x {(10000 * item).toLocaleString()}₫</p>
                </div>
                <div className="flex space-x-2 items-center">
                  <button className="w-6 h-6 flex items-center justify-center border border-border rounded">−</button>
                  <span className="w-6 text-center">{item}</span>
                  <button className="w-6 h-6 flex items-center justify-center border border-border rounded">+</button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty Cart Message */}
          {false && (
            <div className="h-40 flex items-center justify-center border border-dashed border-border rounded-md">
              <p className="text-muted-foreground">Giỏ hàng trống</p>
            </div>
          )}
        </div>
        
        {/* Cart Summary */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span>60,000₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giảm giá:</span>
              <span>0₫</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng:</span>
              <span>60,000₫</span>
            </div>
          </div>
            {/* Payment Buttons */}
          <div className="space-y-2">
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-md">
              Thanh toán
            </button>
            
            <div className="flex space-x-2">
              <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]}>
                <button className="flex-1 py-2 border border-border text-muted-foreground rounded-md">
                  Giữ đơn
                </button>
              </PermissionGuard>
              
              <button className="flex-1 py-2 border border-border text-destructive rounded-md">
                Hủy
              </button>
            </div>
            
            <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]} fallback={null}>
              <button className="w-full mt-2 py-2 bg-yellow-500 text-white rounded-md">
                Áp dụng giảm giá đặc biệt
              </button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </div>
  );
}
