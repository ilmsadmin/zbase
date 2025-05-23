import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface Shift {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  cashStart: number;
  cashEnd: number | null;
  notes: string;
  isActive: boolean;
}

/**
 * Hook để quản lý ca làm việc (shift)
 */
export const useShift = () => {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
    // Kiểm tra ca làm việc hiện tại của người dùng
  const checkActiveShift = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated active shift (or null if no active shift)
      const mockActiveShift = {
        id: '123',
        userId: user?.id || '',
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endTime: null,
        cashStart: 500000,
        cashEnd: null,
        notes: 'Ca sáng',
        isActive: true
      };
      
      setCurrentShift(mockActiveShift);
    } catch (err) {
      console.error('Error checking active shift:', err);
      setError('Không thể tải thông tin ca làm việc');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Bắt đầu ca làm việc mới
  const startShift = async (cashStart: number, notes: string = '') => {
    if (!user) {
      setError('Vui lòng đăng nhập để bắt đầu ca làm việc');
      return;
    }
    
    if (currentShift) {
      setError('Bạn đã có ca làm việc đang hoạt động');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new shift
      const newShift: Shift = {
        id: Date.now().toString(),
        userId: user.id,
        startTime: new Date(),
        endTime: null,
        cashStart,
        cashEnd: null,
        notes,
        isActive: true
      };
      
      setCurrentShift(newShift);
      return newShift;
    } catch (err) {
      console.error('Error starting shift:', err);
      setError('Không thể bắt đầu ca làm việc');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kết thúc ca làm việc hiện tại
  const endShift = async (cashEnd: number, notes: string = '') => {
    if (!currentShift) {
      setError('Không có ca làm việc đang hoạt động');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current shift
      const endedShift: Shift = {
        ...currentShift,
        endTime: new Date(),
        cashEnd,
        notes: notes ? `${currentShift.notes}; ${notes}` : currentShift.notes,
        isActive: false
      };
      
      setCurrentShift(null); // Clear current shift
      return endedShift;
    } catch (err) {
      console.error('Error ending shift:', err);
      setError('Không thể kết thúc ca làm việc');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
    const clearError = () => {
    setError(null);
  };
  
  // Check for active shift when component mounts or user changes
  useEffect(() => {
    checkActiveShift();
  }, [checkActiveShift]);
  
  return {
    currentShift,
    isLoading,
    error,
    startShift,
    endShift,
    checkActiveShift,
    clearError
  };
};
