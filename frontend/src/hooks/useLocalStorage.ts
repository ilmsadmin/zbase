import { useState, useEffect } from 'react';

/**
 * Hook để sử dụng localStorage một cách an toàn với React
 * 
 * @param key Key để lưu trữ trong localStorage
 * @param initialValue Giá trị khởi tạo
 * @returns Tuple [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Lấy từ localStorage theo key
      const item = window.localStorage.getItem(key);
      // Trả về giá trị đã parse hoặc initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Nếu có lỗi, trả về initialValue
      console.error('Error reading localStorage key', key, ':', error);
      return initialValue;
    }
  });
  
  // Handler để cập nhật localStorage và state
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép giá trị là một function giống như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage key', key, ':', error);
    }
  };
  
  // Listen for changes to the localStorage (from other tabs)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}
