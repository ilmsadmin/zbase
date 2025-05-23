import { useState, useEffect } from 'react';

/**
 * Hook để theo dõi trạng thái của một media query
 * 
 * @param query CSS media query string
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Kiểm tra xem window có được định nghĩa (client-side) không
    if (typeof window === 'undefined') return;
    
    // Tạo một MediaQueryList object
    const media = window.matchMedia(query);
    
    // Cập nhật state ban đầu
    setMatches(media.matches);
    
    // Callback để xử lý khi media query thay đổi
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Thêm listener
    media.addEventListener('change', listener);
    
    // Cleanup function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Re-run nếu query thay đổi
  
  return matches;
};

// Predefined media queries
export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
