import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/lib/services/authService';
import { setCookie, deleteCookie } from '@/utils/cookies';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean}>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email: string, password: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call the real API
      const response = await authService.login({ email, password });
      
      // Map the response to our User type
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.name.split(' ')[0],
        lastName: response.user.name.split(' ').slice(1).join(' '),
        role: response.user.role as any, // Tạm thời dùng any để vượt qua lỗi TypeScript
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
        // Save to localStorage if rememberMe is true, otherwise session storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', response.token);
      storage.setItem('refresh_token', response.refreshToken);
      storage.setItem('user', JSON.stringify(user));
      
      // Set cookies for middleware authentication
      setCookie('auth_token', response.token, rememberMe ? 7 : undefined); // 7 days if remember me, session cookie otherwise
      
      set({
        user,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
        } catch (error) {
      console.error('Login error:', error);
      set({
        error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        isLoading: false
      });
      return { success: false };
    }
  },
    logout: async () => {
    try {
      // Call the real logout API
      await authService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear storage regardless of API success/failure
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('refresh_token');
      
      // Delete auth cookie
      deleteCookie('auth_token');
      
      // Update state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false
      });
        // Redirect to login page if in browser context
      if (typeof window !== 'undefined') {
        // Use replace instead of href to avoid adding to history
        window.location.replace('/login');
      }
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check for token in both localStorage and sessionStorage
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (token && storedUser) {        try {
          // Validate token by getting current user profile
          const profile = await authService.getProfile();
          const user = JSON.parse(storedUser) as User;
          
          // Nếu profile trả về khác null thì token hợp lệ
          console.log('Auth check successful, profile:', profile);
          
          // Ensure cookie is set
          setCookie('auth_token', token);
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error("Invalid token:", error);
          // Token validation failed, clear storage and state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('refresh_token');
          
          // Also delete the cookie
          deleteCookie('auth_token');
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        set({
          user: null,
          token: null,
          refreshToken: null,
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
