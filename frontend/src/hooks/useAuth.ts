"use client";

import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

/**
 * Hook để quản lý authentication
 */
export const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    checkAuth, 
    clearError 
  } = useAuthStore();
  
  const router = useRouter();
  
  // Kiểm tra trạng thái auth khi component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Utility function để redirect người dùng chưa đăng nhập
  const requireAuth = useCallback((redirectTo = '/login') => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return true;
  }, [isAuthenticated, isLoading, router]);
  
  // Utility function để redirect người dùng đã đăng nhập
  const redirectIfAuthenticated = useCallback((redirectTo = '/admin') => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
      return true;
    }
    return false;
  }, [isAuthenticated, isLoading, router]);  // Kiểm tra quyền hạn của user  
  const hasPermission = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (permissionKey: string) => {
      // Ví dụ đơn giản, trong thực tế sẽ kiểm tra từ danh sách permissions trong user object
      if (!user) return false;
      
      // Admin có tất cả quyền
      if (user.role === 'ADMIN') return true;
      
      // Implement logic kiểm tra permission thực tế ở đây
      // Có thể lấy từ một mảng permissions trong user object
      return false;
    }, 
    [user]
  );
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    requireAuth,
    redirectIfAuthenticated,
    hasPermission
  };
};
