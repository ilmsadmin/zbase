import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email: string, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock login logic - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would verify the password here
      // For now, we're just using a mock but keeping the parameter for future implementation
      
      // Simulated successful login
      const mockUser = {
        id: '1',
        email: email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as User;
      
      const mockToken = 'mock-jwt-token';
      
      // Save to localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false
      });
      
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        isLoading: false
      });
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    
    // Update state
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    
    // Redirect to login page if in browser context
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check for token in localStorage
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // In a real app, validate token with the server
        const user = JSON.parse(storedUser) as User;
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
