import { useState, useEffect } from 'react';

/**
 * Hook để debounce một giá trị
 * Hữu ích cho các tác vụ như search khi nhập liệu
 * 
 * @param value Giá trị cần debounce
 * @param delay Thời gian trì hoãn (ms)
 * @returns Giá trị đã được debounce
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập timeout để cập nhật giá trị debouncedValue sau một khoảng thời gian
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timeout nếu value hoặc delay thay đổi
    // Cũng được thực thi khi component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
