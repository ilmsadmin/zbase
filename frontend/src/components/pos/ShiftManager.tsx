'use client';

import { useState } from 'react';
import { useShift } from '@/hooks/useShift';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';

interface ShiftFormData {
  cashAmount: number;
  notes: string;
}

export default function ShiftManager() {
  const { currentShift, isLoading, error, startShift, endShift, clearError } = useShift();
  const [formData, setFormData] = useState<ShiftFormData>({
    cashAmount: 0,
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cashAmount' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    await startShift(formData.cashAmount, formData.notes);
    setFormData({ cashAmount: 0, notes: '' });
  };
  
  const handleEndShift = async (e: React.FormEvent) => {
    e.preventDefault();
    await endShift(formData.cashAmount, formData.notes);
    setFormData({ cashAmount: 0, notes: '' });
  };
  
  if (isLoading) {
    return (
      <div className="p-4 bg-card rounded-lg shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      {error && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="font-bold">×</button>
        </div>
      )}
      
      {currentShift ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Ca làm việc đang hoạt động</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Đang hoạt động
            </span>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-muted-foreground">Thời gian bắt đầu:</span>
              <span>{currentShift.startTime.toLocaleTimeString()}</span>
            </div>
            <div>
              <span className="block text-muted-foreground">Tiền đầu ca:</span>
              <span>{currentShift.cashStart.toLocaleString()} VNĐ</span>
            </div>
            {currentShift.notes && (
              <div className="col-span-2">
                <span className="block text-muted-foreground">Ghi chú:</span>
                <span>{currentShift.notes}</span>
              </div>
            )}
          </div>
          
          <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]}>
            <form onSubmit={handleEndShift} className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Kết thúc ca làm việc</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cashAmount" className="block text-sm mb-1">
                    Tiền cuối ca:
                  </label>
                  <input
                    type="number"
                    id="cashAmount"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm mb-1">
                    Ghi chú:
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 disabled:opacity-50"
                >
                  {isLoading ? 'Đang xử lý...' : 'Kết thúc ca làm việc'}
                </button>
              </div>
            </form>
          </PermissionGuard>
        </div>
      ) : (
        <PermissionGuard requiredRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]}>
          <form onSubmit={handleStartShift}>
            <h3 className="font-medium mb-3">Bắt đầu ca làm việc mới</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="cashAmount" className="block text-sm mb-1">
                  Tiền đầu ca:
                </label>
                <input
                  type="number"
                  id="cashAmount"
                  name="cashAmount"
                  value={formData.cashAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm mb-1">
                  Ghi chú:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Bắt đầu ca làm việc'}
              </button>
            </div>
          </form>
        </PermissionGuard>
      )}
    </div>
  );
}
