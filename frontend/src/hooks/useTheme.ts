import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';

/**
 * Hook để quản lý theme (dark/light mode)
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  
  // Hiệu ứng chỉ chạy ở phía client
  useEffect(() => {
    setMounted(true);
    
    // Khởi tạo theme dựa trên localStorage hoặc system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    
  }, [setTheme]);
  
  return {
    theme,
    setTheme,
    toggleTheme,
    mounted, // Giúp tránh hydration mismatch
  };
};
