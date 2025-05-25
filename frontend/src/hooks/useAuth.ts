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
    // Kiểm tra trạng thái auth khi component mount - only run once
  useEffect(() => {
    // Only check auth if we're not already authenticated and not currently checking
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, []); // Empty dependency array to run only once on mount
  
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
    (permissionKey: string) => {
      // Nếu không có user, không có quyền
      if (!user) return false;
      
      // Admin có tất cả quyền
      if (user.role === 'ADMIN') return true;
      
      // Kiểm tra cụ thể từ danh sách permissions trong user object
      return user.permissions?.includes(permissionKey) || false;
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
