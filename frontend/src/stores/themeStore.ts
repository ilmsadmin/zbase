import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Mặc định sử dụng theme 'system' (theo thiết lập của hệ thống)
  theme: 
    (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 
    'system',
  
  setTheme: (theme) => {
    // Lưu theme vào localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      // Áp dụng class dark cho body nếu cần
      const isDark = 
        theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Cập nhật state
    set({ theme });
  },
  
  toggleTheme: () => {
    const { theme, setTheme } = get();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
}));
